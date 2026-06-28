"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DollarSign, Lock, Unlock, ArrowUpCircle, ArrowDownCircle,
  PlusCircle, MinusCircle, Receipt, AlertCircle, CheckCircle
} from "lucide-react"
import { CashRegister, CashMovement, Sale, Expense } from "@/types"
import { SalesService } from "@/services/sales.service"

interface CajaTabProps {
  activeRegister: CashRegister | null
  cashMovements: CashMovement[]
  sales: Sale[]
  expenses: Expense[]
  onRefresh: () => void
}

export default function CajaTab({
  activeRegister,
  cashMovements,
  sales,
  expenses,
  onRefresh
}: CajaTabProps) {
  // Open Caja modal
  const [openModal, setOpenModal] = React.useState(false)
  const [initialAmount, setInitialAmount] = React.useState(1500)
  const [openNotes, setOpenNotes] = React.useState("")

  // Close Caja modal
  const [closeModal, setCloseModal] = React.useState(false)
  const [actualAmount, setActualAmount] = React.useState(0)
  const [closeNotes, setCloseNotes] = React.useState("")

  // Manual movement modal
  const [movModal, setMovModal] = React.useState(false)
  const [movType, setMovType] = React.useState<"income" | "expense">("income")
  const [movAmount, setMovAmount] = React.useState(0)
  const [movDesc, setMovDesc] = React.useState("")

  // Expense modal
  const [expModal, setExpModal] = React.useState(false)
  const [expCategory, setExpCategory] = React.useState<Expense["category"]>("other")
  const [expAmount, setExpAmount] = React.useState(0)
  const [expDesc, setExpDesc] = React.useState("")
  const [expDate, setExpDate] = React.useState(new Date().toISOString().split("T")[0])

  const [saving, setSaving] = React.useState(false)

  // Summary calculations
  const todayStr = new Date().toISOString().split("T")[0]
  const todaySales = sales.filter(s => s.created_at.startsWith(todayStr))
  const todayIncome = todaySales.reduce((acc, s) => acc + Number(s.total_amount), 0)
  const todayExpenses = expenses.filter(e => e.expense_date === todayStr).reduce((acc, e) => acc + Number(e.amount), 0)
  const currentBalance = activeRegister
    ? Number(activeRegister.initial_amount) + cashMovements
        .filter(m => m.cash_register_id === activeRegister.id)
        .reduce((acc, m) => acc + (m.type === "income" ? Number(m.amount) : -Number(m.amount)), 0)
    : 0

  const handleOpenCaja = async () => {
    setSaving(true)
    await SalesService.openCashRegister("prof-admin-1", initialAmount, openNotes)
    setSaving(false)
    setOpenModal(false)
    onRefresh()
  }

  const handleCloseCaja = async () => {
    if (!activeRegister) return
    setSaving(true)
    await SalesService.closeCashRegister(activeRegister.id, "prof-admin-1", actualAmount, closeNotes)
    setSaving(false)
    setCloseModal(false)
    onRefresh()
  }

  const handleMovement = async () => {
    if (!activeRegister || !movAmount) return
    setSaving(true)
    await SalesService.addCashMovement({
      cashRegisterId: activeRegister.id,
      type: movType,
      amount: movAmount,
      description: movDesc || (movType === "income" ? "Ingreso manual" : "Egreso manual")
    })
    setSaving(false)
    setMovModal(false)
    setMovAmount(0)
    setMovDesc("")
    onRefresh()
  }

  const handleExpense = async () => {
    setSaving(true)
    await SalesService.addExpense({
      barbershop_id: "11111111-1111-1111-1111-111111111111",
      category: expCategory,
      description: expDesc || "Gasto sin descripción",
      amount: expAmount,
      expense_date: expDate
    })
    setSaving(false)
    setExpModal(false)
    setExpAmount(0)
    setExpDesc("")
    onRefresh()
  }

  return (
    <div className="space-y-6 font-sans">

      {/* Caja Status Card */}
      <div className={`rounded-3xl border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${
        activeRegister
          ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/10"
          : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            activeRegister
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
              : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          }`}>
            {activeRegister ? <Unlock className="h-7 w-7" /> : <Lock className="h-7 w-7" />}
          </div>
          <div>
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">
              {activeRegister ? "Caja Abierta" : "Caja Cerrada"}
            </h3>
            {activeRegister ? (
              <div className="flex flex-wrap gap-4 mt-1">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  Fondo inicial: <strong>${Number(activeRegister.initial_amount).toFixed(2)}</strong>
                </span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  Abierta a las: <strong>{new Date(activeRegister.opened_at).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</strong>
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                  Saldo actual: ${currentBalance.toFixed(2)}
                </span>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 mt-0.5">No hay caja abierta. Abre la caja para registrar ventas y movimientos.</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {!activeRegister ? (
            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 transition"
            >
              <Unlock className="h-4 w-4" />
              Abrir Caja
            </button>
          ) : (
            <>
              <button
                onClick={() => setMovModal(true)}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 transition"
              >
                <ArrowUpCircle className="h-4 w-4 text-blue-500" />
                Movimiento Manual
              </button>
              <button
                onClick={() => setCloseModal(true)}
                className="flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 transition"
              >
                <Lock className="h-4 w-4" />
                Cerrar Caja
              </button>
            </>
          )}
        </div>
      </div>

      {/* Today Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Ventas del Día",   value: `$${todayIncome.toFixed(2)}`,       color: "text-emerald-600 dark:text-emerald-400", icon: <DollarSign className="h-4 w-4" /> },
          { label: "Gastos del Día",   value: `$${todayExpenses.toFixed(2)}`,     color: "text-rose-600 dark:text-rose-400",       icon: <MinusCircle className="h-4 w-4" /> },
          { label: "Citas Procesadas", value: `${todaySales.length}`,             color: "text-blue-600 dark:text-blue-400",       icon: <Receipt className="h-4 w-4" /> },
          { label: "Balance Neto Hoy", value: `$${(todayIncome - todayExpenses).toFixed(2)}`, color: "text-amber-600 dark:text-amber-400", icon: <CheckCircle className="h-4 w-4" /> }
        ].map(m => (
          <div key={m.label} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${m.color} mb-2`}>
              {m.icon}
              {m.label}
            </div>
            <p className="text-2xl font-black text-zinc-950 dark:text-white">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Cash Movements */}
      <div className="rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Movimientos de Caja</h4>
          <button
            onClick={() => setExpModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-rose-50 text-rose-600 px-3 py-1.5 text-xs font-bold hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 transition"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Registrar Gasto
          </button>
        </div>

        {cashMovements.length > 0 ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {cashMovements.slice(0, 20).map(m => (
              <div key={m.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  {m.type === "income"
                    ? <ArrowUpCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                    : <ArrowDownCircle className="h-5 w-5 text-rose-500 shrink-0" />}
                  <div>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{m.description}</p>
                    <p className="text-[11px] text-zinc-400">{new Date(m.created_at).toLocaleString("es-MX", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}</p>
                  </div>
                </div>
                <span className={`text-base font-black ${m.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                  {m.type === "income" ? "+" : "-"}${Number(m.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-400 flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8" />
            <p className="text-sm font-semibold">No hay movimientos en esta caja.</p>
          </div>
        )}
      </div>

      {/* ===== MODALS ===== */}

      {/* Open Caja Modal */}
      <AnimatePresence>
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Abrir Caja del Día</h3>
              <p className="text-xs text-zinc-500 mt-1">Ingresa el fondo inicial con el que arrancas el turno.</p>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1 block">Monto Inicial ($)</label>
                  <input type="number" value={initialAmount} onChange={e => setInitialAmount(Number(e.target.value))} min={0}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1 block">Notas (opcional)</label>
                  <input type="text" placeholder="Ej. Turno matutino – Lunes" value={openNotes} onChange={e => setOpenNotes(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500" />
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => setOpenModal(false)} className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold dark:border-zinc-800">Cancelar</button>
                <button disabled={saving} onClick={handleOpenCaja} className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50">
                  {saving ? "Abriendo..." : "Abrir Caja"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Close Caja Modal */}
      <AnimatePresence>
        {closeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Cerrar Caja</h3>
              <p className="text-xs text-zinc-500 mt-1">Cuenta el efectivo físico al momento del cierre.</p>
              <div className="mt-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 p-3 text-xs">
                <p>Saldo esperado (sistema): <strong>${currentBalance.toFixed(2)}</strong></p>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1 block">Efectivo contado ($)</label>
                  <input type="number" value={actualAmount} onChange={e => setActualAmount(Number(e.target.value))} min={0}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500" />
                </div>
                {actualAmount > 0 && (
                  <div className={`rounded-xl px-4 py-2 text-xs font-bold ${
                    actualAmount >= currentBalance
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                  }`}>
                    Diferencia: {actualAmount >= currentBalance ? "+" : ""}{(actualAmount - currentBalance).toFixed(2)}
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1 block">Notas de cierre (opcional)</label>
                  <input type="text" value={closeNotes} onChange={e => setCloseNotes(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500" />
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => setCloseModal(false)} className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold dark:border-zinc-800">Cancelar</button>
                <button disabled={saving || !actualAmount} onClick={handleCloseCaja} className="flex-1 rounded-xl bg-zinc-950 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 disabled:opacity-50">
                  {saving ? "Cerrando..." : "Cerrar Caja"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Movement Modal */}
      <AnimatePresence>
        {movModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Movimiento Manual de Caja</h3>
              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <button onClick={() => setMovType("income")} className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold ${movType === "income" ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" : "border-zinc-200 dark:border-zinc-800"}`}>
                    <ArrowUpCircle className="h-4 w-4" /> Ingreso
                  </button>
                  <button onClick={() => setMovType("expense")} className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold ${movType === "expense" ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400" : "border-zinc-200 dark:border-zinc-800"}`}>
                    <ArrowDownCircle className="h-4 w-4" /> Egreso
                  </button>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1 block">Monto ($)</label>
                  <input type="number" value={movAmount} onChange={e => setMovAmount(Number(e.target.value))} min={0}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1 block">Descripción</label>
                  <input type="text" value={movDesc} onChange={e => setMovDesc(e.target.value)} placeholder="Ej. Pago de limpieza, Propina..."
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500" />
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => setMovModal(false)} className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold dark:border-zinc-800">Cancelar</button>
                <button disabled={saving || !movAmount} onClick={handleMovement} className="flex-1 rounded-xl bg-zinc-950 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 disabled:opacity-50">
                  {saving ? "Registrando..." : "Registrar"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Expense Modal */}
      <AnimatePresence>
        {expModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Registrar Gasto</h3>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1 block">Categoría</label>
                  <select value={expCategory} onChange={e => setExpCategory(e.target.value as Expense["category"])}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="rent">Renta</option>
                    <option value="services">Servicios (luz, agua...)</option>
                    <option value="purchases">Compras / Insumos</option>
                    <option value="salaries">Sueldos</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1 block">Descripción</label>
                  <input type="text" value={expDesc} onChange={e => setExpDesc(e.target.value)} placeholder="Ej. Pago de electricidad julio"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1 block">Monto ($)</label>
                  <input type="number" value={expAmount} onChange={e => setExpAmount(Number(e.target.value))} min={0}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1 block">Fecha</label>
                  <input type="date" value={expDate} onChange={e => setExpDate(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500" />
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => setExpModal(false)} className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold dark:border-zinc-800">Cancelar</button>
                <button disabled={saving || !expAmount} onClick={handleExpense} className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white hover:bg-rose-500 disabled:opacity-50">
                  {saving ? "Guardando..." : "Registrar Gasto"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
