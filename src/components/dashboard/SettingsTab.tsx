"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings, Scissors, Calendar, Image as ImageIcon, Plus, Trash2,
  Check, Save, RefreshCw, X, AlertCircle, PlusCircle
} from "lucide-react"
import { Service, BlockedDate, GalleryItem } from "@/types"
import { BarberShopService } from "@/services/barber-shop.service"
import { AppointmentsService } from "@/services/appointments.service"

interface SettingsTabProps {
  services: Service[]
  blockedDates: BlockedDate[]
  gallery: GalleryItem[]
  onRefresh: () => void
}

export default function SettingsTab({
  services,
  blockedDates,
  gallery,
  onRefresh
}: SettingsTabProps) {
  const [subTab, setSubTab] = React.useState<"services" | "dates" | "gallery">("services")

  // Services Edit state
  const [editingServiceId, setEditingServiceId] = React.useState<string | null>(null)
  const [serviceForm, setServiceForm] = React.useState<Partial<Service>>({})
  const [savingService, setSavingService] = React.useState(false)

  // Blocked Date state
  const [blockStart, setBlockStart] = React.useState("")
  const [blockEnd, setBlockEnd] = React.useState("")
  const [blockReason, setBlockReason] = React.useState("")
  const [savingBlock, setSavingBlock] = React.useState(false)

  // Gallery upload state
  const [newImageUrl, setNewImageUrl] = React.useState("")
  const [newImageCaption, setNewImageCaption] = React.useState("")
  const [savingGallery, setSavingGallery] = React.useState(false)

  // -------------------------------------------------------------
  // Service Handlers
  // -------------------------------------------------------------
  const handleEditService = (s: Service) => {
    setEditingServiceId(s.id)
    setServiceForm({ ...s })
  }

  const handleSaveService = async (id: string) => {
    setSavingService(true)
    await BarberShopService.updateService(id, serviceForm)
    setSavingService(false)
    setEditingServiceId(null)
    onRefresh()
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    await BarberShopService.updateService(id, { is_active: !currentStatus })
    onRefresh()
  }

  // -------------------------------------------------------------
  // Blocked Date Handlers
  // -------------------------------------------------------------
  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!blockStart || !blockEnd) return
    setSavingBlock(true)

    await AppointmentsService.addBlockedDate({
      barbershop_id: "11111111-1111-1111-1111-111111111111",
      employee_id: null, // Shop-wide blockage
      start_date: blockStart + "T00:00:00Z",
      end_date: blockEnd + "T23:59:59Z",
      reason: blockReason || "Bloqueo administrativo"
    })

    setSavingBlock(false)
    setBlockStart("")
    setBlockEnd("")
    setBlockReason("")
    onRefresh()
  }

  const handleDeleteBlock = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este bloqueo?")) {
      await AppointmentsService.deleteBlockedDate(id)
      onRefresh()
    }
  }

  // -------------------------------------------------------------
  // Gallery Handlers
  // -------------------------------------------------------------
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newImageUrl.trim()) return
    setSavingGallery(true)

    await BarberShopService.addGalleryItem(newImageUrl.trim(), newImageCaption.trim() || undefined)

    setSavingGallery(false)
    setNewImageUrl("")
    setNewImageCaption("")
    onRefresh()
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Sub Tabs Selection */}
      <div className="flex gap-2 border-b border-zinc-150 dark:border-zinc-800 pb-3">
        {[
          { id: "services", label: "Servicios", icon: <Scissors className="h-4 w-4" /> },
          { id: "dates", label: "Horarios y Bloqueos", icon: <Calendar className="h-4 w-4" /> },
          { id: "gallery", label: "Galería de Fotos", icon: <ImageIcon className="h-4 w-4" /> }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              subTab === t.id
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== SERVICES MANAGEMENT SUB TAB ===== */}
      {subTab === "services" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Configurar Catálogo de Servicios</h3>
          
          <div className="space-y-3">
            {services.map(s => {
              const isEditing = editingServiceId === s.id
              return (
                <div key={s.id} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  {isEditing ? (
                    // Edit Service Mode
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Nombre</label>
                        <input
                          type="text"
                          value={serviceForm.name || ""}
                          onChange={e => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Precio ($)</label>
                        <input
                          type="number"
                          value={serviceForm.price || 0}
                          onChange={e => setServiceForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Duración (minutos)</label>
                        <input
                          type="number"
                          value={serviceForm.duration_minutes || 0}
                          onChange={e => setServiceForm(prev => ({ ...prev, duration_minutes: Number(e.target.value) }))}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Descripción</label>
                        <textarea
                          value={serviceForm.description || ""}
                          onChange={e => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={2}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3 flex justify-between items-center mt-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          <input
                            type="checkbox"
                            checked={!!serviceForm.is_featured}
                            onChange={e => setServiceForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                            className="rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
                          />
                          Destacar en Landing Page (Combo / Recomendado)
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingServiceId(null)}
                            className="rounded-xl border border-zinc-250 px-4 py-2 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                          >
                            Cancelar
                          </button>
                          <button
                            disabled={savingService}
                            onClick={() => handleSaveService(s.id)}
                            className="rounded-xl bg-zinc-950 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-850 dark:bg-white dark:text-zinc-950"
                          >
                            {savingService ? "Guardando..." : "Guardar"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Read Service Mode
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-zinc-900 dark:text-white">{s.name}</h4>
                          {s.is_featured && (
                            <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider dark:bg-amber-950/20 dark:text-amber-400">
                              Destacado
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1 max-w-md leading-relaxed">{s.description}</p>
                        <div className="flex gap-4 mt-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                          <span>Precio: <strong className="text-zinc-950 dark:text-white">${Number(s.price).toFixed(2)}</strong></span>
                          <span>•</span>
                          <span>Duración: <strong>{s.duration_minutes} min</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleActive(s.id, s.is_active)}
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                            s.is_active
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400"
                          }`}
                        >
                          {s.is_active ? "Activo" : "Pausado"}
                        </button>
                        <button
                          onClick={() => handleEditService(s)}
                          className="rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800 transition"
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ===== BLOCKED DATES SUB TAB ===== */}
      {subTab === "dates" && (
        <div className="grid gap-6 md:grid-cols-12 items-start">
          {/* Add block Form */}
          <div className="md:col-span-5 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Bloquear Fecha Especial</h4>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              Registra vacaciones, feriados o capacitaciones. El sistema bloqueará los turnos automáticamente para evitar que agenden citas.
            </p>

            <form onSubmit={handleAddBlock} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  required
                  value={blockStart}
                  onChange={e => setBlockStart(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Fecha Término</label>
                <input
                  type="date"
                  required
                  value={blockEnd}
                  onChange={e => setBlockEnd(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Motivo / Razón</label>
                <input
                  type="text"
                  placeholder="Ej. Capacitación Mateo / Día del Trabajo"
                  required
                  value={blockReason}
                  onChange={e => setBlockReason(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingBlock}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950"
              >
                Bloquear Rango de Fechas
              </button>
            </form>
          </div>

          {/* Blocked list */}
          <div className="md:col-span-7 space-y-3">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Fechas Bloqueadas Activas</h4>

            {blockedDates.length > 0 ? (
              <div className="space-y-2">
                {blockedDates.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-sm">
                    <div>
                      <h5 className="font-bold text-zinc-900 dark:text-white">{b.reason || "Bloqueo Administrativo"}</h5>
                      <p className="text-xs text-zinc-400 mt-1">
                        Desde: {new Date(b.start_date).toLocaleDateString("es-MX")} – Hasta: {new Date(b.end_date).toLocaleDateString("es-MX")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteBlock(b.id)}
                      className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl dark:hover:bg-rose-950/10 transition"
                      title="Eliminar bloqueo"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-2xl text-xs">
                No hay fechas bloqueadas configuradas actualmente.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== GALLERY SUB TAB ===== */}
      {subTab === "gallery" && (
        <div className="grid gap-6 md:grid-cols-12 items-start">
          {/* Add image form */}
          <div className="md:col-span-5 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Añadir Foto a la Galería</h4>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              Ingresa el enlace de una fotografía de tus cortes. Esta se publicará y sincronizará de inmediato en la landing page pública.
            </p>

            <form onSubmit={handleAddGallery} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Enlace de Imagen URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  required
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Pie de foto / Descripción</label>
                <input
                  type="text"
                  placeholder="Ej. Fade texturizado con corte clásico de barba"
                  value={newImageCaption}
                  onChange={e => setNewImageCaption(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingGallery}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950"
              >
                Publicar en Galería
              </button>
            </form>
          </div>

          {/* Gallery items preview list */}
          <div className="md:col-span-7">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Fotos Activas</h4>
            
            <div className="grid grid-cols-3 gap-3">
              {gallery.map(g => (
                <div key={g.id} className="relative aspect-square rounded-xl overflow-hidden group border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                  <img
                    src={g.image_url}
                    alt={g.caption || "Corte"}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <p className="text-[10px] text-white font-semibold text-center leading-snug line-clamp-2">
                      {g.caption || "Sin descripción"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
