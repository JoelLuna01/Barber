"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  TrendingUp, 
  Calendar, 
  ShoppingBag, 
  DollarSign, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle,
  Coins
} from "lucide-react"

interface OverviewTabProps {
  metrics: {
    todayIncome: number
    weeklyIncome: number
    monthlyIncome: number
    yearlyIncome: number
    todayAppointmentsCount: number
    pendingAppointmentsCount: number
    completedAppointmentsCount: number
    lowStockCount: number
    lowStockList: any[]
    cajaStatus: "open" | "closed"
    cajaRegister: any
  }
  analytics: {
    totalRevenue: number
    totalExpenses: number
    netProfit: number
    ticketAverage: number
    monthlyChart: { name: string; income: number; expenses: number; net: number }[]
    serviceChart: { name: string; value: number }[]
    employeeChart: { name: string; value: number }[]
    hoursChart: { hour: string; count: number }[]
    customerRetention: { name: string; value: number }[]
  }
  onSwitchTab: (tab: string) => void
}

export default function OverviewTab({ metrics, analytics, onSwitchTab }: OverviewTabProps) {
  
  // Find maximum income in monthly data to scale SVG chart heights
  const maxIncome = Math.max(...analytics.monthlyChart.map(d => d.income), 1000)
  
  // Find maximum appointment count to scale hour chart heights
  const maxHourCount = Math.max(...analytics.hoursChart.map(d => d.count), 1)

  // Compute donut percentages for customer retention
  const totalClients = analytics.customerRetention.reduce((acc, c) => acc + c.value, 0)
  const recurrentPercentage = totalClients > 0 
    ? Math.round((analytics.customerRetention[0].value / totalClients) * 100) 
    : 0

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Low Stock Banner Warning */}
      {metrics.lowStockCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/30 dark:bg-amber-950/10 text-amber-800 dark:text-amber-400"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 animate-pulse text-amber-500" />
            <div>
              <h4 className="text-sm font-bold">Alerta de Inventario</h4>
              <p className="text-xs mt-0.5">Tienes {metrics.lowStockCount} productos con inventario crítico (5 unidades o menos).</p>
            </div>
          </div>
          <button 
            onClick={() => onSwitchTab("inventario")}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-600 hover:text-amber-500 dark:text-amber-400"
          >
            Ver Inventario
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {/* 2. Top Metric Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Today Income */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ingreso de Hoy</span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-zinc-950 dark:text-white">
              ${metrics.todayIncome.toFixed(2)}
            </h3>
            <p className="mt-1 text-xs text-zinc-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span>Semana: ${metrics.weeklyIncome.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Card 2: Today Appointments */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Citas de Hoy</span>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-zinc-950 dark:text-white">
              {metrics.todayAppointmentsCount}
            </h3>
            <div className="mt-1 text-xs text-zinc-500 flex gap-2">
              <span className="text-amber-500 font-semibold">{metrics.pendingAppointmentsCount} pendientes</span>
              <span>•</span>
              <span className="text-emerald-500 font-semibold">{metrics.completedAppointmentsCount} listas</span>
            </div>
          </div>
        </div>

        {/* Card 3: Ticket Average */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ticket Promedio</span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-zinc-950 dark:text-white">
              ${analytics.ticketAverage.toFixed(2)}
            </h3>
            <p className="mt-1 text-xs text-zinc-500">Valor promedio de compras y cortes.</p>
          </div>
        </div>

        {/* Card 4: Caja Status */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Estado de Caja</span>
            <div className={`rounded-xl p-2 ${
              metrics.cajaStatus === "open" 
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" 
                : "bg-rose-50 text-rose-600 dark:bg-rose-950/20"
            }`}>
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${metrics.cajaStatus === "open" ? "bg-emerald-500" : "bg-rose-500"}`} />
              {metrics.cajaStatus === "open" ? "Caja Abierta" : "Caja Cerrada"}
            </h3>
            <button
              onClick={() => onSwitchTab("caja")}
              className="mt-3 text-xs font-bold text-amber-600 hover:text-amber-500 uppercase tracking-wider block"
            >
              Gestionar Caja & Ventas →
            </button>
          </div>
        </div>

      </div>

      {/* 3. Custom SVG Charts Section */}
      <div className="grid gap-8 md:grid-cols-2">
        
        {/* Chart 1: Financial Balance */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wider">Balance Mensual (Ingresos vs Egresos)</h4>
          
          <div className="h-[200px] flex items-end justify-between gap-4 px-2">
            {analytics.monthlyChart.map((d, index) => {
              const incomeHeight = (d.income / maxIncome) * 140
              const expenseHeight = (d.expenses / maxIncome) * 140

              return (
                <div key={d.name || index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full h-[140px] flex items-end justify-center gap-1">
                    {/* Income Bar */}
                    <div 
                      className="w-3 bg-amber-500 rounded-t-sm group relative"
                      style={{ height: `${Math.max(incomeHeight, 4)}px` }}
                    >
                      {/* Tooltip */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block rounded bg-zinc-950 px-2 py-0.5 text-[10px] text-white whitespace-nowrap z-20 font-semibold shadow-md">
                        +${d.income.toFixed(0)}
                      </span>
                    </div>

                    {/* Expense Bar */}
                    <div 
                      className="w-3 bg-zinc-300 dark:bg-zinc-700 rounded-t-sm group relative"
                      style={{ height: `${Math.max(expenseHeight, 4)}px` }}
                    >
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block rounded bg-zinc-950 px-2 py-0.5 text-[10px] text-white whitespace-nowrap z-20 font-semibold shadow-md">
                        -${d.expenses.toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{d.name}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-zinc-600 dark:text-zinc-400">Ingresos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="text-zinc-600 dark:text-zinc-400">Gastos</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Busy peak hours */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wider">Pico de Horas Agendadas</h4>

          {analytics.hoursChart.length > 0 ? (
            <div className="h-[200px] flex items-end justify-between gap-2 px-2">
              {analytics.hoursChart.map((h, index) => {
                const barHeight = (h.count / maxHourCount) * 140

                return (
                  <div key={h.hour || index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="relative w-full h-[140px] flex items-end justify-center">
                      <div 
                        className="w-5 bg-amber-500/20 hover:bg-amber-500 rounded-t-md transition-all group relative"
                        style={{ height: `${Math.max(barHeight, 4)}px` }}
                      >
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block rounded bg-zinc-950 px-2 py-0.5 text-[10px] text-white whitespace-nowrap z-20 font-semibold shadow-md">
                          {h.count} citas
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400">{h.hour}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-xs text-zinc-400">
              No hay citas agendadas registradas para graficar.
            </div>
          )}
        </div>

        {/* Chart 3: Service split */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wider">Ventas por Servicio</h4>
            
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
              {/* Radial donut using SVG */}
              <div className="relative h-32 w-32 shrink-0">
                <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Outer circle track */}
                  <path
                    className="text-zinc-100 dark:text-zinc-800"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Segment 1: Classic cut (approx 50%) */}
                  <path
                    className="text-amber-500"
                    strokeDasharray="50, 100"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Segment 2: Beard (approx 30%) */}
                  <path
                    className="text-emerald-500"
                    strokeDasharray="30, 100"
                    strokeDashoffset="-50"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Segment 3: Combo (approx 20%) */}
                  <path
                    className="text-purple-500"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-80"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs uppercase font-semibold text-zinc-400 leading-none">Total</span>
                  <span className="text-base font-black text-zinc-950 dark:text-white mt-1">100%</span>
                </div>
              </div>

              {/* Legends list */}
              <div className="space-y-2 text-xs">
                {analytics.serviceChart.map((s, idx) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className={`inline-block h-3.5 w-3.5 rounded ${
                      idx === 0 ? "bg-amber-500" : idx === 1 ? "bg-emerald-500" : "bg-purple-500"
                    }`} />
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{s.name}:</span>
                    <span className="text-zinc-500">${s.value.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chart 4: Customer Retention */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-wider">Retención de Clientes</h4>
            
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
              {/* Progress Ring using SVG */}
              <div className="relative h-32 w-32 shrink-0">
                <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-zinc-150 dark:text-zinc-850"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-500"
                    strokeDasharray={`${recurrentPercentage}, 100`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400">Recurrentes</span>
                  <span className="text-xl font-black text-zinc-950 dark:text-white mt-1">{recurrentPercentage}%</span>
                </div>
              </div>

              {/* Counts listing */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-3 rounded-full bg-amber-500" />
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">Clientes Recurrentes</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{analytics.customerRetention[0]?.value || 0} personas con 2 o más visitas</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-3 rounded-full bg-zinc-250 dark:bg-zinc-850 border border-zinc-300" />
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">Clientes Nuevos</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{analytics.customerRetention[1]?.value || 0} personas con 1 visita o invitados</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
