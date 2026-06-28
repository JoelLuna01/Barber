import { SalesService } from "./sales.service"
import { ProductsService } from "./products.service"
import { AppointmentsService } from "./appointments.service"

export class AnalyticsService {
  
  static async getDailyDashboardMetrics() {
    const appointments = await AppointmentsService.getAppointments()
    const sales = await SalesService.getSales()
    const products = await ProductsService.getProducts()
    const activeRegister = await SalesService.getActiveCashRegister()

    const todayStr = new Date().toISOString().split("T")[0]
    
    // 1. Filter today's sales
    const todaySales = sales.filter(s => s.created_at.startsWith(todayStr))
    const todayIncome = todaySales.reduce((acc, s) => acc + Number(s.total_amount), 0)

    // 2. Filter weekly/monthly/yearly sales
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    const weeklyIncome = sales
      .filter(s => new Date(s.created_at) >= startOfWeek)
      .reduce((acc, s) => acc + Number(s.total_amount), 0)

    const monthlyIncome = sales
      .filter(s => new Date(s.created_at) >= startOfMonth)
      .reduce((acc, s) => acc + Number(s.total_amount), 0)

    const yearlyIncome = sales
      .filter(s => new Date(s.created_at) >= startOfYear)
      .reduce((acc, s) => acc + Number(s.total_amount), 0)

    // 3. Filter today's appointments
    const todayAppointments = appointments.filter(ap => ap.start_time.startsWith(todayStr))
    const pendingAppointments = todayAppointments.filter(ap => ap.status === "pending")
    const completedAppointments = todayAppointments.filter(ap => ap.status === "completed")

    // 4. Products stock warning
    const lowStockProducts = products.filter(p => p.stock <= 5)

    return {
      todayIncome,
      weeklyIncome,
      monthlyIncome,
      yearlyIncome,
      todayAppointmentsCount: todayAppointments.length,
      pendingAppointmentsCount: pendingAppointments.length,
      completedAppointmentsCount: completedAppointments.length,
      lowStockCount: lowStockProducts.length,
      lowStockList: lowStockProducts,
      cajaStatus: activeRegister ? ("open" as const) : ("closed" as const),
      cajaRegister: activeRegister
    }
  }

  static async getFullAnalytics() {
    const sales = await SalesService.getSales()
    const expenses = await SalesService.getExpenses()
    const appointments = await AppointmentsService.getAppointments()
    const customers = await AppointmentsService.getCustomers()

    // 1. Monthly revenue vs expenses (last 6 months)
    const monthlyData: { [month: string]: { income: number; expenses: number; net: number } } = {}
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const monthKey = d.toLocaleString("default", { month: "short", year: "2-digit" })
      monthlyData[monthKey] = { income: 0, expenses: 0, net: 0 }
    }

    sales.forEach(sale => {
      const date = new Date(sale.created_at)
      const monthKey = date.toLocaleString("default", { month: "short", year: "2-digit" })
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].income += Number(sale.total_amount)
      }
    })

    expenses.forEach(exp => {
      const date = new Date(exp.expense_date)
      const monthKey = date.toLocaleString("default", { month: "short", year: "2-digit" })
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].expenses += Number(exp.amount)
      }
    })

    // Compute net profit
    Object.keys(monthlyData).forEach(key => {
      monthlyData[key].net = monthlyData[key].income - monthlyData[key].expenses
    })

    const monthlyChart = Object.entries(monthlyData).map(([name, data]) => ({
      name,
      ...data
    }))

    // 2. Sales by service distribution
    const serviceDistribution: { [name: string]: number } = {}
    sales.forEach(sale => {
      if (sale.sale_items) {
        sale.sale_items.forEach(item => {
          if (item.item_type === "service" && item.service_id) {
            // Find service name
            const sName = item.service_id === "s1" 
              ? "Corte Clásico" 
              : item.service_id === "s2" 
                ? "Perfilado de Barba" 
                : item.service_id === "s3" 
                  ? "Combo Corte + Barba" 
                  : "Corte Degradado"
            serviceDistribution[sName] = (serviceDistribution[sName] || 0) + Number(item.total_price)
          }
        })
      }
    })

    const serviceChart = Object.entries(serviceDistribution).map(([name, value]) => ({
      name,
      value
    }))

    // 3. Sales by employee distribution
    const employeeDistribution: { [name: string]: number } = {}
    sales.forEach(sale => {
      if (sale.employee_id) {
        const empName = sale.employee_id === "e1" ? "Mateo Silva" : "Lucas Russo"
        employeeDistribution[empName] = (employeeDistribution[empName] || 0) + Number(sale.total_amount)
      }
    })

    const employeeChart = Object.entries(employeeDistribution).map(([name, value]) => ({
      name,
      value
    }))

    // 4. Peak hours (Appointments start hour distribution)
    const hourDistribution: { [hour: string]: number } = {}
    appointments.forEach(ap => {
      if (ap.status !== "cancelled") {
        const hr = new Date(ap.start_time).getHours()
        const hrKey = `${hr}:00`
        hourDistribution[hrKey] = (hourDistribution[hrKey] || 0) + 1
      }
    })

    const hoursChart = Object.entries(hourDistribution)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour))

    // 5. Customer retention metrics
    const recurrentCustomers = customers.filter(c => c.visits_count > 1).length
    const newCustomers = customers.filter(c => c.visits_count <= 1).length

    // 6. Net totals
    const totalRevenue = sales.reduce((acc, s) => acc + Number(s.total_amount), 0)
    const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount), 0)
    const netProfit = totalRevenue - totalExpenses
    const ticketAverage = sales.length > 0 ? totalRevenue / sales.length : 0

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      ticketAverage,
      monthlyChart,
      serviceChart,
      employeeChart,
      hoursChart,
      customerRetention: [
        { name: "Recurrentes", value: recurrentCustomers },
        { name: "Nuevos", value: newCustomers }
      ]
    }
  }
}
