"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Package,
  AlertTriangle,
  Plus,
  TrendingDown,
  TrendingUp,
  Search,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react"
import { Product } from "@/types"
import { ProductsService } from "@/services/products.service"

interface InventoryTabProps {
  products: Product[]
  onRefresh: () => void
}

const MOVEMENT_TYPES = [
  { value: "in",         label: "Entrada de stock",   icon: <TrendingUp className="h-4 w-4 text-emerald-500" /> },
  { value: "out",        label: "Salida de uso",       icon: <TrendingDown className="h-4 w-4 text-amber-500" /> },
  { value: "adjustment", label: "Ajuste de inventario", icon: <ArrowUpCircle className="h-4 w-4 text-blue-500" /> },
  { value: "waste",      label: "Merma / Desperdicio", icon: <ArrowDownCircle className="h-4 w-4 text-rose-500" /> }
]

export default function InventoryTab({ products, onRefresh }: InventoryTabProps) {
  const [search, setSearch] = React.useState("")
  const [movementModal, setMovementModal] = React.useState<Product | null>(null)
  const [movType, setMovType] = React.useState("in")
  const [movQty, setMovQty] = React.useState(1)
  const [movReason, setMovReason] = React.useState("")
  const [saving, setSaving] = React.useState(false)

  const lowStock = products.filter(p => p.stock <= 5)
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  const handleMovement = async () => {
    if (!movementModal) return
    setSaving(true)
    const qty = movType === "in" || movType === "adjustment" ? movQty : -movQty
    await ProductsService.logMovement(movementModal.id, qty, movType as any, movReason || "Sin motivo")
    setSaving(false)
    setMovementModal(null)
    setMovQty(1)
    setMovReason("")
    onRefresh()
  }

  return (
    <div className="space-y-6 font-sans">

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/30 dark:bg-rose-950/10">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 mb-3">
            <AlertTriangle className="h-4 w-4 animate-pulse" />
            <h4 className="text-sm font-bold">Productos en Inventario Crítico</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(p => (
              <span key={p.id} className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-600 dark:border-rose-900/30 dark:bg-zinc-950 dark:text-rose-400">
                {p.name}: <strong>{p.stock} unid.</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Buscar producto, marca o SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Products table-style list */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-zinc-50 dark:bg-zinc-950 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
          <div className="col-span-5">Producto</div>
          <div className="col-span-2 text-center">SKU</div>
          <div className="col-span-2 text-center">Stock</div>
          <div className="col-span-2 text-center">Precio</div>
          <div className="col-span-1 text-center">Acción</div>
        </div>

        {filtered.map((p, idx) => {
          const isLow = p.stock <= 5
          return (
            <div
              key={p.id}
              className={`grid grid-cols-12 gap-4 items-center px-5 py-4 text-sm transition hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 ${
                idx !== 0 ? "border-t border-zinc-100 dark:border-zinc-800" : ""
              }`}
            >
              <div className="col-span-5">
                <p className="font-bold text-zinc-900 dark:text-white leading-tight">{p.name}</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">{p.brand || "Sin marca"}</p>
              </div>
              <div className="col-span-2 text-center">
                <span className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[11px] font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {p.sku || "—"}
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                  isLow
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                }`}>
                  {isLow && <AlertTriangle className="h-3 w-3" />}
                  {p.stock} u.
                </span>
              </div>
              <div className="col-span-2 text-center font-black text-zinc-950 dark:text-white">
                ${Number(p.price).toFixed(2)}
              </div>
              <div className="col-span-1 text-center">
                <button
                  onClick={() => setMovementModal(p)}
                  title="Registrar movimiento"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 hover:bg-amber-100 hover:text-amber-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-amber-950/20 dark:hover:text-amber-400 transition mx-auto"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-zinc-400 flex flex-col items-center gap-3">
            <Package className="h-10 w-10" />
            <p className="text-sm font-semibold">No se encontraron productos.</p>
          </div>
        )}
      </div>

      {/* Movement Modal */}
      {movementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Registrar Movimiento</h3>
            <p className="text-xs text-zinc-500 mt-1">Producto: <strong>{movementModal.name}</strong> • Stock actual: <strong>{movementModal.stock}</strong></p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-2">Tipo de movimiento</label>
                <div className="grid grid-cols-2 gap-2">
                  {MOVEMENT_TYPES.map(mt => (
                    <button
                      key={mt.value}
                      onClick={() => setMovType(mt.value)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold text-left transition ${
                        movType === mt.value
                          ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                          : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                      }`}
                    >
                      {mt.icon}
                      {mt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-2">Cantidad</label>
                <input
                  type="number"
                  min={1}
                  value={movQty}
                  onChange={e => setMovQty(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block mb-2">Motivo (opcional)</label>
                <input
                  type="text"
                  placeholder="Ej. Compra proveedor, uso en servicio..."
                  value={movReason}
                  onChange={e => setMovReason(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setMovementModal(null)}
                className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                Cancelar
              </button>
              <button
                disabled={saving}
                onClick={handleMovement}
                className="flex-1 rounded-xl bg-zinc-950 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 disabled:opacity-50"
              >
                {saving ? "Registrando..." : "Confirmar Movimiento"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
