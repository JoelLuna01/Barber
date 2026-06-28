import { createClient } from "@/lib/supabase"
import { MockDatabase, mockBarbershop } from "@/lib/mock-data"
import { Sale, SaleItem, CashRegister, CashMovement, Commission, Expense } from "@/types"

const isSupabaseConfigured = () => {
  return typeof window !== 'undefined'
    ? !!process.env.NEXT_PUBLIC_SUPABASE_URL
    : !!process.env.NEXT_PUBLIC_SUPABASE_URL
}

export class SalesService {
  
  // -------------------------------------------------------------
  // Cash Register (Caja) Operations
  // -------------------------------------------------------------

  static async getActiveCashRegister(): Promise<CashRegister | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("cash_registers")
          .select("*")
          .eq("status", "open")
          .maybeSingle()

        if (error) throw error
        return data as CashRegister
      } catch (err) {
        console.warn("Supabase getActiveCashRegister failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.getActiveCashRegister()
  }

  static async getCashRegistersHistory(): Promise<CashRegister[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("cash_registers")
          .select("*, opened_by:profiles!opened_by(full_name), closed_by:profiles!closed_by(full_name)")
          .order("opened_at", { ascending: false })

        if (error) throw error
        return data as CashRegister[]
      } catch (err) {
        console.warn("Supabase getCashRegistersHistory failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.cashRegisters
  }

  static async openCashRegister(userId: string, initialAmount: number, notes?: string): Promise<CashRegister> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("cash_registers")
          .insert({
            barbershop_id: mockBarbershop.id,
            opened_by: userId,
            initial_amount: initialAmount,
            status: "open",
            notes: notes || null
          })
          .select()
          .single()

        if (error) throw error
        
        // Log action
        await supabase.from("activity_logs").insert({
          barbershop_id: mockBarbershop.id,
          profile_id: userId,
          action: "Caja Abierta",
          details: { initial_amount: initialAmount }
        })

        return data as CashRegister
      } catch (err) {
        console.warn("Supabase openCashRegister failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.openCashRegister(userId, initialAmount, notes)
  }

  static async closeCashRegister(id: string, userId: string, actualAmount: number, notes?: string): Promise<CashRegister> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        
        // Calculate expected: initial + income cash movements - expense cash movements
        const { data: movements } = await supabase
          .from("cash_movements")
          .select("type, amount")
          .eq("cash_register_id", id)

        const { data: reg } = await supabase
          .from("cash_registers")
          .select("initial_amount")
          .eq("id", id)
          .single()

        const initial = reg ? Number(reg.initial_amount) : 0
        let incomeTotal = 0
        let expenseTotal = 0

        if (movements) {
          movements.forEach(m => {
            if (m.type === "income") incomeTotal += Number(m.amount)
            if (m.type === "expense") expenseTotal += Number(m.amount)
          })
        }

        const expected = initial + incomeTotal - expenseTotal
        const difference = actualAmount - expected

        const { data, error } = await supabase
          .from("cash_registers")
          .update({
            closed_by: userId,
            closed_at: new Date().toISOString(),
            expected_amount: expected,
            actual_amount: actualAmount,
            difference,
            status: "closed",
            notes: notes || null
          })
          .eq("id", id)
          .select()
          .single()

        if (error) throw error

        // Log action
        await supabase.from("activity_logs").insert({
          barbershop_id: mockBarbershop.id,
          profile_id: userId,
          action: "Caja Cerrada",
          details: { actual_amount: actualAmount, difference }
        })

        return data as CashRegister
      } catch (err) {
        console.warn("Supabase closeCashRegister failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.closeCashRegister(id, userId, actualAmount, notes)
  }

  static async addCashMovement(movement: {
    cashRegisterId: string
    type: "income" | "expense"
    amount: number
    description: string
  }): Promise<CashMovement> {
    const rawMovement = {
      cash_register_id: movement.cashRegisterId,
      barbershop_id: mockBarbershop.id,
      type: movement.type,
      amount: movement.amount,
      description: movement.description
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("cash_movements")
          .insert(rawMovement)
          .select()
          .single()

        if (error) throw error
        return data as CashMovement
      } catch (err) {
        console.warn("Supabase addCashMovement failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.addCashMovement(rawMovement)
  }

  static async getCashMovements(registerId?: string): Promise<CashMovement[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        let query = supabase.from("cash_movements").select("*")
        if (registerId) {
          query = query.eq("cash_register_id", registerId)
        }
        const { data, error } = await query.order("created_at", { ascending: false })

        if (error) throw error
        return data as CashMovement[]
      } catch (err) {
        console.warn("Supabase getCashMovements failed, falling back to mock data.", err)
      }
    }
    if (registerId) {
      return MockDatabase.cashMovements.filter(m => m.cash_register_id === registerId)
    }
    return MockDatabase.cashMovements
  }

  // -------------------------------------------------------------
  // Sales Ledger & POS Checkouts
  // -------------------------------------------------------------

  static async getSales(): Promise<Sale[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("sales")
          .select("*, customers(*), employees(*), sale_items(*)")
          .order("created_at", { ascending: false })

        if (error) throw error
        return data as Sale[]
      } catch (err) {
        console.warn("Supabase getSales failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.sales.map(s => ({
      ...s,
      customer: MockDatabase.customers.find(c => c.id === s.customer_id),
      employee: MockDatabase.employees.find(e => e.id === s.employee_id),
      sale_items: MockDatabase.saleItems.filter(si => si.sale_id === s.id)
    }))
  }

  static async processSale(checkout: {
    customerId: string | null
    employeeId: string | null
    totalAmount: number
    discountAmount: number
    paymentMethod: "cash" | "card" | "transfer" | "mercado_pago" | "stripe"
    items: {
      itemType: "service" | "product"
      serviceId: string | null
      productId: string | null
      quantity: number
      unitPrice: number
    }[]
  }): Promise<Sale> {
    const activeReg = await this.getActiveCashRegister()
    const saleData = {
      barbershop_id: mockBarbershop.id,
      cash_register_id: activeReg ? activeReg.id : null,
      customer_id: checkout.customerId,
      employee_id: checkout.employeeId,
      total_amount: checkout.totalAmount,
      discount_amount: checkout.discountAmount,
      payment_method: checkout.paymentMethod,
      payment_status: "completed" as const
    }

    const itemsData = checkout.items.map(item => ({
      item_type: item.itemType,
      service_id: item.serviceId,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.quantity * item.unitPrice
    }))

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        
        // 1. Insert transaction
        const { data: newSale, error: saleError } = await supabase
          .from("sales")
          .insert(saleData)
          .select()
          .single()

        if (saleError) throw saleError

        // 2. Insert items, update inventory, calculate commissions
        for (const item of itemsData) {
          const { error: itemError } = await supabase
            .from("sale_items")
            .insert({
              sale_id: newSale.id,
              barbershop_id: mockBarbershop.id,
              ...item
            })

          if (itemError) throw itemError

          // If product, reduce stock
          if (item.item_type === "product" && item.product_id) {
            const { data: prod } = await supabase.from("products").select("stock").eq("id", item.product_id).single()
            const currentStock = prod ? prod.stock : 0
            
            await supabase.from("products").update({ stock: currentStock - item.quantity }).eq("id", item.product_id)
            await supabase.from("inventory_movements").insert({
              product_id: item.product_id,
              barbershop_id: mockBarbershop.id,
              type: "sale",
              quantity: -item.quantity,
              reason: `Venta registrada #${newSale.id}`
            })
          }

          // If service and employee assigned, calculate commission
          if (item.item_type === "service" && item.service_id && checkout.employeeId) {
            const { data: emp } = await supabase.from("employees").select("*").eq("id", checkout.employeeId).single()
            if (emp) {
              let commissionAmount = 0
              if (emp.commission_type === "percentage") {
                commissionAmount = (Number(item.total_price) * Number(emp.commission_value)) / 100
              } else if (emp.commission_type === "fixed") {
                commissionAmount = Number(emp.commission_value)
              }

              await supabase.from("commissions").insert({
                barbershop_id: mockBarbershop.id,
                employee_id: checkout.employeeId,
                sale_id: newSale.id,
                amount: commissionAmount,
                status: "pending"
              })
            }
          }
        }

        // 3. Add to cash register if paid in cash
        if (checkout.paymentMethod === "cash" && activeReg) {
          await supabase.from("cash_movements").insert({
            cash_register_id: activeReg.id,
            barbershop_id: mockBarbershop.id,
            type: "income",
            amount: checkout.totalAmount,
            description: `Venta POS #${newSale.id}`
          })
        }

        // 4. Update customer total spent
        if (checkout.customerId) {
          const { data: cust } = await supabase.from("customers").select("total_spent, visits_count").eq("id", checkout.customerId).single()
          if (cust) {
            await supabase.from("customers").update({
              total_spent: Number(cust.total_spent) + checkout.totalAmount,
              visits_count: cust.visits_count + 1
            }).eq("id", checkout.customerId)
          }
        }

        return newSale as Sale
      } catch (err) {
        console.warn("Supabase processSale failed, falling back to mock data.", err)
      }
    }

    return MockDatabase.processSale(saleData, itemsData)
  }

  // -------------------------------------------------------------
  // Commissions Management
  // -------------------------------------------------------------

  static async getCommissions(): Promise<Commission[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("commissions")
          .select("*, employees(*), sales(*)")
          .order("created_at", { ascending: false })

        if (error) throw error
        return data as Commission[]
      } catch (err) {
        console.warn("Supabase getCommissions failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.commissions.map(c => ({
      ...c,
      employee: MockDatabase.employees.find(e => e.id === c.employee_id),
      sale: MockDatabase.sales.find(s => s.id === c.sale_id)
    }))
  }

  static async payCommissions(employeeId: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { error } = await supabase
          .from("commissions")
          .update({
            status: "paid",
            paid_at: new Date().toISOString()
          })
          .eq("employee_id", employeeId)
          .eq("status", "pending")

        if (error) throw error
        return true
      } catch (err) {
        console.warn("Supabase payCommissions failed, falling back to mock data.", err)
      }
    }
    
    // Fallback
    MockDatabase.commissions = MockDatabase.commissions.map(c => 
      c.employee_id === employeeId && c.status === "pending"
        ? { ...c, status: "paid", paid_at: new Date().toISOString() }
        : c
    )
    return true
  }

  // -------------------------------------------------------------
  // Expenses Ledger
  // -------------------------------------------------------------

  static async getExpenses(): Promise<Expense[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("expenses")
          .select("*")
          .order("expense_date", { ascending: false })

        if (error) throw error
        return data as Expense[]
      } catch (err) {
        console.warn("Supabase getExpenses failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.getExpenses()
  }

  static async addExpense(expense: Omit<Expense, "id" | "created_at">): Promise<Expense> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("expenses")
          .insert(expense)
          .select()
          .single()

        if (error) throw error

        // If active cash register and cash checkout, add an egress movement
        const activeReg = await this.getActiveCashRegister()
        if (activeReg) {
          await supabase.from("cash_movements").insert({
            cash_register_id: activeReg.id,
            barbershop_id: mockBarbershop.id,
            type: "expense",
            amount: expense.amount,
            description: `Egreso por Gasto: ${expense.description}`
          })
        }

        return data as Expense
      } catch (err) {
        console.warn("Supabase addExpense failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.addExpense(expense)
  }
}
