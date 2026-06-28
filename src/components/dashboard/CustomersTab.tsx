"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Star, Crown, Award, Phone, Mail, UserPlus, ChevronDown, ChevronUp } from "lucide-react"
import { Customer } from "@/types"
import { AppointmentsService } from "@/services/appointments.service"

interface CustomersTabProps {
  customers: Customer[]
  onRefresh: () => void
}

function getLoyaltyBadge(visits: number): { label: string; icon: React.ReactNode; color: string } | null {
  if (visits >= 10) return { label: "VIP ⭐", icon: <Crown className="h-3 w-3" />, color: "text-amber-700 bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400" }
  if (visits >= 5) return { label: "Frecuente 🎖️", icon: <Award className="h-3 w-3" />, color: "text-blue-700 bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400" }
  return null
}

export default function CustomersTab({ customers, onRefresh }: CustomersTabProps) {
  const [search, setSearch] = React.useState("")
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editForm, setEditForm] = React.useState<Partial<Customer>>({})
  const [saving, setSaving] = React.useState(false)

  const filtered = customers.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (c: Customer) => {
    setEditingId(c.id)
    setEditForm({
      full_name: c.full_name,
      phone: c.phone || "",
      email: c.email || "",
      notes: c.notes || "",
      hair_type: c.hair_type || "",
      beard_type: c.beard_type || "",
      allergies: c.allergies || ""
    })
    setExpandedId(c.id)
  }

  const handleSave = async (id: string) => {
    setSaving(true)
    await AppointmentsService.updateCustomer(id, editForm)
    setSaving(false)
    setEditingId(null)
    onRefresh()
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o correo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 focus:outline-none focus:border-amber-500"
          />
        </div>
        <span className="text-xs text-zinc-500 shrink-0">
          {filtered.length} clientes
        </span>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-2xl font-black text-zinc-950 dark:text-white">{customers.length}</p>
          <p className="text-xs text-zinc-400 mt-1">Total Clientes</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-2xl font-black text-zinc-950 dark:text-white">{customers.filter(c => c.visits_count >= 5).length}</p>
          <p className="text-xs text-zinc-400 mt-1">Frecuentes / VIP</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-2xl font-black text-zinc-950 dark:text-white">{customers.filter(c => !c.profile_id).length}</p>
          <p className="text-xs text-zinc-400 mt-1">Invitados</p>
        </div>
      </div>

      {/* Customers List */}
      <div className="space-y-3">
        {filtered.map(c => {
          const badge = getLoyaltyBadge(c.visits_count)
          const isExpanded = expandedId === c.id
          const isEditing = editingId === c.id

          return (
            <div
              key={c.id}
              className="rounded-2xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900"
            >
              {/* Header row */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-bold text-sm dark:bg-amber-950/20 dark:text-amber-400">
                    {c.full_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{c.full_name}</h4>
                      {badge && (
                        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.color}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                      )}
                      {!c.profile_id && (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                          Invitado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      {c.phone && (
                        <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <Phone className="h-3 w-3" />
                          {c.phone}
                        </span>
                      )}
                      {c.email && (
                        <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <Mail className="h-3 w-3" />
                          {c.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-zinc-950 dark:text-white">${Number(c.total_spent).toFixed(0)}</p>
                    <p className="text-[10px] text-zinc-400">{c.visits_count} visitas</p>
                  </div>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded detail panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="border-t border-zinc-100 dark:border-zinc-800 p-4">
                      {isEditing ? (
                        // Edit Form
                        <div className="grid gap-4 sm:grid-cols-2">
                          {[
                            { label: "Nombre", field: "full_name" },
                            { label: "Teléfono", field: "phone" },
                            { label: "Email", field: "email" },
                            { label: "Tipo de Cabello", field: "hair_type" },
                            { label: "Tipo de Barba", field: "beard_type" },
                            { label: "Alergias", field: "allergies" }
                          ].map(({ label, field }) => (
                            <div key={field}>
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{label}</label>
                              <input
                                type="text"
                                value={(editForm as any)[field] || ""}
                                onChange={e => setEditForm(prev => ({ ...prev, [field]: e.target.value }))}
                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 focus:outline-none focus:border-amber-500"
                              />
                            </div>
                          ))}
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Notas del Barbero</label>
                            <textarea
                              value={editForm.notes || ""}
                              onChange={e => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                              rows={2}
                              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                          <div className="sm:col-span-2 flex gap-3 justify-end">
                            <button
                              onClick={() => setEditingId(null)}
                              className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            >
                              Cancelar
                            </button>
                            <button
                              disabled={saving}
                              onClick={() => handleSave(c.id)}
                              className="rounded-xl bg-zinc-950 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 disabled:opacity-50"
                            >
                              {saving ? "Guardando..." : "Guardar Cambios"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Read view
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tipo Cabello</p>
                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-1">{c.hair_type || "—"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tipo Barba</p>
                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-1">{c.beard_type || "—"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Alergias</p>
                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-1">{c.allergies || "—"}</p>
                          </div>
                          <div className="sm:col-span-3">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Notas del Barbero</p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{c.notes || "Sin notas adicionales."}</p>
                          </div>
                          <div className="sm:col-span-3 flex gap-2 justify-end">
                            <button
                              onClick={() => handleEdit(c)}
                              className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                            >
                              Editar Ficha
                            </button>
                            <a
                              href={`https://wa.me/${c.phone?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hola ${c.full_name}, te escribimos desde BarberBook Studio. ¡Hace tiempo no te vemos!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-zinc-400">
            <UserPlus className="h-10 w-10 mx-auto mb-3" />
            <p className="text-sm font-semibold">No se encontraron clientes.</p>
          </div>
        )}
      </div>
    </div>
  )
}
