"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, User, Scissors, Check, X, PlayCircle, AlertCircle, MoreVertical } from "lucide-react"
import { Appointment } from "@/types"
import { AppointmentsService } from "@/services/appointments.service"

interface AppointmentsTabProps {
  appointments: Appointment[]
  onRefresh: () => void
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: "Pendiente",    color: "text-amber-700",   bg: "bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400" },
  confirmed:  { label: "Confirmada",   color: "text-blue-700",    bg: "bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400" },
  in_progress:{ label: "En progreso",  color: "text-purple-700",  bg: "bg-purple-100 dark:bg-purple-950/30 dark:text-purple-400" },
  completed:  { label: "Completada",   color: "text-emerald-700", bg: "bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400" },
  cancelled:  { label: "Cancelada",    color: "text-rose-700",    bg: "bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400" },
  no_show:    { label: "No asistió",   color: "text-zinc-700",    bg: "bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400" }
}

export default function AppointmentsTab({ appointments, onRefresh }: AppointmentsTabProps) {
  const [filter, setFilter] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [dateFilter, setDateFilter] = React.useState<string>(new Date().toISOString().split("T")[0])
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null)

  const statusOptions = ["all", "pending", "confirmed", "in_progress", "completed", "cancelled", "no_show"]

  const filtered = appointments.filter(ap => {
    const matchStatus = filter === "all" || ap.status === filter
    const matchSearch = !searchQuery || 
      ap.customer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ap.employee?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ap.service?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchDate = !dateFilter || ap.start_time.startsWith(dateFilter)
    return matchStatus && matchSearch && matchDate
  })

  const handleStatusUpdate = async (id: string, status: Appointment["status"]) => {
    setUpdatingId(id)
    setOpenMenuId(null)
    await AppointmentsService.updateAppointmentStatus(id, status)
    onRefresh()
    setUpdatingId(null)
  }

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })

  return (
    <div className="space-y-6 font-sans">
      
      {/* Filters Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                filter === s
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400"
              }`}
            >
              {s === "all" ? "Todas" : STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Buscar cliente, barbero..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500 w-52"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Count badge */}
      <p className="text-xs text-zinc-500">
        Mostrando <span className="font-bold text-zinc-800 dark:text-zinc-200">{filtered.length}</span> citas
      </p>

      {/* Appointments List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map(ap => {
            const statusCfg = STATUS_CONFIG[ap.status] || STATUS_CONFIG.pending
            const isUpdating = updatingId === ap.id

            return (
              <motion.div
                key={ap.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Status color stripe */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                  ap.status === "completed" ? "bg-emerald-500" :
                  ap.status === "confirmed" ? "bg-blue-500" :
                  ap.status === "in_progress" ? "bg-purple-500" :
                  ap.status === "cancelled" || ap.status === "no_show" ? "bg-rose-400" :
                  "bg-amber-400"
                }`} />

                <div className="pl-3 flex flex-col gap-2 md:flex-row md:items-center md:gap-6 flex-1">
                  {/* Customer */}
                  <div className="flex items-center gap-2 min-w-[160px]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 font-bold text-sm dark:bg-zinc-800 dark:text-zinc-400">
                      {ap.customer?.full_name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">
                        {ap.customer?.full_name || "Cliente"}
                      </p>
                      <p className="text-[10px] text-zinc-400">{ap.customer?.phone || "Sin teléfono"}</p>
                    </div>
                  </div>

                  {/* Service + Barber */}
                  <div className="flex items-center gap-2 min-w-[180px]">
                    <Scissors className="h-4 w-4 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{ap.service?.name || "Servicio"}</p>
                      <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {ap.employee?.name || "Barbero"}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-zinc-400" />
                    <div>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{formatDate(ap.start_time)}</p>
                      <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(ap.start_time)} – {formatTime(ap.end_time)}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="min-w-[80px]">
                    <p className="text-xs text-zinc-400">Total</p>
                    <p className="text-base font-black text-zinc-950 dark:text-white">${Number(ap.total_price).toFixed(2)}</p>
                  </div>
                </div>

                {/* Status + Actions */}
                <div className="flex items-center gap-3 pl-3 md:pl-0">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusCfg.bg}`}>
                    {statusCfg.label}
                  </span>

                  {/* Quick Actions */}
                  {ap.status === "pending" && (
                    <div className="flex gap-1.5">
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusUpdate(ap.id, "confirmed")}
                        title="Confirmar"
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 transition"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusUpdate(ap.id, "cancelled")}
                        title="Cancelar"
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {ap.status === "confirmed" && (
                    <button
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate(ap.id, "in_progress")}
                      title="Iniciar"
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-950/20 dark:text-purple-400 transition"
                    >
                      <PlayCircle className="h-4 w-4" />
                    </button>
                  )}

                  {ap.status === "in_progress" && (
                    <button
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate(ap.id, "completed")}
                      title="Completar"
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 transition"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-zinc-400">
            <AlertCircle className="h-10 w-10" />
            <p className="text-sm font-semibold">No se encontraron citas con los filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  )
}
