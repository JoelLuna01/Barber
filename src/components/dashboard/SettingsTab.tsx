"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings, Scissors, Calendar, Image as ImageIcon, Plus, Trash2,
  Check, Save, RefreshCw, X, AlertCircle, PlusCircle, Gift, Percent, Store
} from "lucide-react"
import { Service, BlockedDate, GalleryItem, Promotion, Barbershop } from "@/types"
import { BarberShopService } from "@/services/barber-shop.service"
import { AppointmentsService } from "@/services/appointments.service"

interface SettingsTabProps {
  services: Service[]
  blockedDates: BlockedDate[]
  gallery: GalleryItem[]
  promotions: Promotion[]
  barbershop?: Barbershop
  onRefresh: () => void
}

export default function SettingsTab({
  services,
  blockedDates,
  gallery,
  promotions,
  barbershop,
  onRefresh
}: SettingsTabProps) {
  const [subTab, setSubTab] = React.useState<"services" | "dates" | "gallery" | "promotions" | "loyalty" | "profile">("services")

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
  // PROMOTIONS state & handlers
  // -------------------------------------------------------------
  const [editingPromoId, setEditingPromoId] = React.useState<string | null>(null)
  const [promoForm, setPromoForm] = React.useState<Partial<Promotion>>({
    name: "",
    description: "",
    discount_type: "percentage",
    discount_value: 10,
    start_date: "",
    end_date: "",
    is_active: true
  })
  const [savingPromo, setSavingPromo] = React.useState(false)

  const handleEditPromo = (p: Promotion) => {
    setEditingPromoId(p.id)
    setPromoForm({
      ...p,
      start_date: p.start_date ? p.start_date.split("T")[0] : "",
      end_date: p.end_date ? p.end_date.split("T")[0] : ""
    })
  }

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoForm.name || !promoForm.start_date || !promoForm.end_date) return
    setSavingPromo(true)

    const payload = {
      barbershop_id: barbershop?.id || "11111111-1111-1111-1111-111111111111",
      name: promoForm.name,
      description: promoForm.description || "",
      discount_type: promoForm.discount_type || "percentage",
      discount_value: Number(promoForm.discount_value) || 0,
      start_date: new Date(promoForm.start_date).toISOString(),
      end_date: new Date(promoForm.end_date).toISOString(),
      is_active: promoForm.is_active ?? true
    }

    if (editingPromoId) {
      await BarberShopService.updatePromotion(editingPromoId, payload)
      setEditingPromoId(null)
    } else {
      await BarberShopService.addPromotion(payload)
    }

    setSavingPromo(false)
    setPromoForm({
      name: "",
      description: "",
      discount_type: "percentage",
      discount_value: 10,
      start_date: "",
      end_date: "",
      is_active: true
    })
    onRefresh()
  }

  const handleDeletePromo = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta promoción?")) {
      await BarberShopService.deletePromotion(id)
      onRefresh()
    }
  }

  const handleTogglePromo = async (id: string, currentStatus: boolean) => {
    await BarberShopService.updatePromotion(id, { is_active: !currentStatus })
    onRefresh()
  }

  // -------------------------------------------------------------
  // LOYALTY state & handlers
  // -------------------------------------------------------------
  const [loyaltyEnabled, setLoyaltyEnabled] = React.useState(true)
  const [loyaltyGoal, setLoyaltyGoal] = React.useState(10)
  const [loyaltyPointsPerVisit, setLoyaltyPointsPerVisit] = React.useState(10)
  const [loyaltyReward, setLoyaltyReward] = React.useState("Corte clásico gratis o 50% en tu próximo ritual")
  const [savingLoyalty, setSavingLoyalty] = React.useState(false)
  const [loyaltySavedSuccess, setLoyaltySavedSuccess] = React.useState(false)

  // Load from localstorage to simulate persistence of loyalty program
  React.useEffect(() => {
    const savedEnabled = localStorage.getItem("loyalty_enabled")
    const savedGoal = localStorage.getItem("loyalty_goal")
    const savedPoints = localStorage.getItem("loyalty_points_per_visit")
    const savedReward = localStorage.getItem("loyalty_reward")
    if (savedEnabled !== null) setLoyaltyEnabled(savedEnabled === "true")
    if (savedGoal !== null) setLoyaltyGoal(Number(savedGoal))
    if (savedPoints !== null) setLoyaltyPointsPerVisit(Number(savedPoints))
    if (savedReward !== null) setLoyaltyReward(savedReward)
  }, [])

  const handleSaveLoyalty = (e: React.FormEvent) => {
    e.preventDefault()
    setSavingLoyalty(true)
    setTimeout(() => {
      localStorage.setItem("loyalty_enabled", String(loyaltyEnabled))
      localStorage.setItem("loyalty_goal", String(loyaltyGoal))
      localStorage.setItem("loyalty_points_per_visit", String(loyaltyPointsPerVisit))
      localStorage.setItem("loyalty_reward", loyaltyReward)
      setSavingLoyalty(false)
      setLoyaltySavedSuccess(true)
      setTimeout(() => setLoyaltySavedSuccess(false), 3000)
      onRefresh()
    }, 800)
  }

  // -------------------------------------------------------------
  // PROFILE state & handlers
  // -------------------------------------------------------------
  const [profileForm, setProfileForm] = React.useState<Partial<Barbershop>>({})
  const [savingProfile, setSavingProfile] = React.useState(false)
  const [profileSavedSuccess, setProfileSavedSuccess] = React.useState(false)

  React.useEffect(() => {
    if (barbershop) {
      setProfileForm({ ...barbershop })
    }
  }, [barbershop])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!barbershop?.id) return
    setSavingProfile(true)
    await BarberShopService.updateBarbershop(barbershop.id, profileForm)
    setSavingProfile(false)
    setProfileSavedSuccess(true)
    setTimeout(() => setProfileSavedSuccess(false), 3000)
    onRefresh()
  }

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
      barbershop_id: barbershop?.id || "11111111-1111-1111-1111-111111111111",
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
      <div className="flex gap-2 border-b border-zinc-150 dark:border-zinc-800 pb-3 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 flex-nowrap">
        {[
          { id: "services", label: "Servicios", icon: <Scissors className="h-4 w-4" /> },
          { id: "dates", label: "Horarios y Bloqueos", icon: <Calendar className="h-4 w-4" /> },
          { id: "gallery", label: "Galería de Fotos", icon: <ImageIcon className="h-4 w-4" /> },
          { id: "promotions", label: "Promociones", icon: <Percent className="h-4 w-4" /> },
          { id: "loyalty", label: "Fidelización", icon: <Gift className="h-4 w-4" /> },
          { id: "profile", label: "Perfil", icon: <Store className="h-4 w-4" /> }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shrink-0 whitespace-nowrap ${
              subTab === t.id
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm"
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

      {/* ===== PROMOTIONS SUB TAB ===== */}
      {subTab === "promotions" && (
        <div className="grid gap-6 md:grid-cols-12 items-start">
          {/* Add / Edit promo form */}
          <div className="md:col-span-5 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">
              {editingPromoId ? "Editar Promoción" : "Crear Nueva Promoción"}
            </h4>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              Define descuentos especiales y códigos de cupón para tus clientes. Se aplicarán automáticamente en las citas y ventas.
            </p>

            <form onSubmit={handleSavePromo} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Nombre de la Promoción</label>
                <input
                  type="text"
                  placeholder="Ej. Jueves de Barba 2x1"
                  required
                  value={promoForm.name || ""}
                  onChange={e => setPromoForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Descripción / Restricciones</label>
                <textarea
                  placeholder="Ej. Válido únicamente en servicio de barba los días jueves."
                  rows={2}
                  value={promoForm.description || ""}
                  onChange={e => setPromoForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Tipo de Descuento</label>
                  <select
                    value={promoForm.discount_type || "percentage"}
                    onChange={e => setPromoForm(prev => ({ ...prev, discount_type: e.target.value as any }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Fijo ($)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    Valor ({promoForm.discount_type === "percentage" ? "%" : "$"})
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={promoForm.discount_value || ""}
                    onChange={e => setPromoForm(prev => ({ ...prev, discount_value: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    value={promoForm.start_date || ""}
                    onChange={e => setPromoForm(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Fecha Término</label>
                  <input
                    type="date"
                    required
                    value={promoForm.end_date || ""}
                    onChange={e => setPromoForm(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="promoActive"
                  checked={!!promoForm.is_active}
                  onChange={e => setPromoForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded border-zinc-300 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="promoActive" className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Promoción Activa inmediatamente
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                {editingPromoId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPromoId(null)
                      setPromoForm({
                        name: "",
                        description: "",
                        discount_type: "percentage",
                        discount_value: 10,
                        start_date: "",
                        end_date: "",
                        is_active: true
                      })
                    }}
                    className="w-1/3 rounded-xl border border-zinc-250 py-3 text-xs font-bold hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 transition text-zinc-600 dark:text-zinc-300"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={savingPromo}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950`}
                >
                  {savingPromo ? "Procesando..." : (editingPromoId ? "Guardar Cambios" : "Crear Promoción")}
                </button>
              </div>
            </form>
          </div>

          {/* Promotions list */}
          <div className="md:col-span-7 space-y-3">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Promociones Vigentes</h4>

            {promotions.length > 0 ? (
              <div className="space-y-3">
                {promotions.map(p => (
                  <div key={p.id} className="p-5 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-bold text-zinc-900 dark:text-white text-sm">{p.name}</h5>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            p.discount_type === "percentage"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400"
                          }`}>
                            -{p.discount_type === "percentage" ? `${p.discount_value}%` : `$${p.discount_value}`}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{p.description || "Sin descripción"}</p>
                        <p className="text-[10px] text-zinc-400 mt-2">
                          Válido: {new Date(p.start_date).toLocaleDateString("es-MX")} al {new Date(p.end_date).toLocaleDateString("es-MX")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePromo(p.id, p.is_active)}
                          className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                            p.is_active
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400"
                          }`}
                        >
                          {p.is_active ? "Activa" : "Pausada"}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                      <button
                        onClick={() => handleEditPromo(p)}
                        className="rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletePromo(p.id)}
                        className="rounded-xl border border-rose-200 text-rose-500 px-3 py-1.5 text-xs font-semibold hover:bg-rose-50 dark:border-rose-950/20 dark:hover:bg-rose-950/30 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs">
                No hay promociones configuradas actualmente.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== LOYALTY PROGRAM SUB TAB ===== */}
      {subTab === "loyalty" && (
        <form onSubmit={handleSaveLoyalty} className="max-w-2xl mx-auto rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-4">
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Programa de Fidelización de Clientes</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Premia a tus clientes recurrentes con puntos o visitas gratis para motivarlos a agendar más seguido.
              </p>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={loyaltyEnabled}
                onChange={e => setLoyaltyEnabled(e.target.checked)}
                className="sr-only peer"
                id="loyaltyToggle"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-amber-500"></div>
            </div>
          </div>

          {loyaltyEnabled ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    Meta de visitas requeridas
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={loyaltyGoal}
                    onChange={e => setLoyaltyGoal(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    Al llegar a este número de visitas finalizadas, el cliente desbloquea su beneficio.
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    Puntos acumulados por visita
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={loyaltyPointsPerVisit}
                    onChange={e => setLoyaltyPointsPerVisit(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    Cantidad base de puntos que se cargan automáticamente en cada cita completada.
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                  Beneficio / Recompensa Final
                </label>
                <input
                  type="text"
                  required
                  value={loyaltyReward}
                  onChange={e => setLoyaltyReward(e.target.value)}
                  placeholder="Ej. 1 Corte Clásico completamente gratis"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  Descripción clara de lo que se le entregará al cliente. Se mostrará en su perfil de reservas.
                </span>
              </div>

              <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-950/30 flex gap-3 items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  <strong className="font-bold block mb-0.5">¿Cómo funciona?</strong>
                  Al habilitar esta opción, cada cita registrada en estado <span className="font-bold">Completada</span> en el dashboard sumará +1 visita y {loyaltyPointsPerVisit} puntos en la cuenta del cliente de forma automática.
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-zinc-400 text-xs">
              El programa de fidelización se encuentra desactivado. Los clientes no acumularán visitas ni puntos.
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-zinc-150 dark:border-zinc-800 pt-4">
            {loyaltySavedSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mr-auto self-center animate-pulse">
                <Check className="h-4 w-4" /> Configuración guardada
              </span>
            )}
            <button
              type="submit"
              disabled={savingLoyalty}
              className="rounded-xl bg-zinc-950 px-5 py-3 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 transition"
            >
              {savingLoyalty ? "Guardando..." : "Guardar Configuración"}
            </button>
          </div>
        </form>
      )}

      {/* ===== BARBERSHOP PROFILE TAB ===== */}
      {subTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="max-w-2xl mx-auto rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-6">
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Perfil Público de la Barbería</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Esta información se utiliza directamente en la Landing Page pública para que los clientes te conozcan y te contacten.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  required
                  value={profileForm.name || ""}
                  onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Slug URL único</label>
                <input
                  type="text"
                  required
                  disabled
                  value={profileForm.slug || ""}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Descripción / Eslogan</label>
              <textarea
                rows={3}
                required
                value={profileForm.description || ""}
                onChange={e => setProfileForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Teléfono Fijo</label>
                <input
                  type="text"
                  value={profileForm.phone || ""}
                  onChange={e => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">WhatsApp Móvil</label>
                <input
                  type="text"
                  value={profileForm.whatsapp || ""}
                  onChange={e => setProfileForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Email de Contacto</label>
                <input
                  type="email"
                  value={profileForm.email || ""}
                  onChange={e => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Dirección Física</label>
              <input
                type="text"
                required
                value={profileForm.address || ""}
                onChange={e => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Enlace Imagen Logo (URL)</label>
                <input
                  type="url"
                  value={profileForm.logo_url || ""}
                  onChange={e => setProfileForm(prev => ({ ...prev, logo_url: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Enlace Imagen Portada (URL)</label>
                <input
                  type="url"
                  value={profileForm.cover_url || ""}
                  onChange={e => setProfileForm(prev => ({ ...prev, cover_url: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={profileForm.instagram || ""}
                  onChange={e => setProfileForm(prev => ({ ...prev, instagram: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">TikTok URL</label>
                <input
                  type="url"
                  value={profileForm.tiktok || ""}
                  onChange={e => setProfileForm(prev => ({ ...prev, tiktok: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={profileForm.facebook || ""}
                  onChange={e => setProfileForm(prev => ({ ...prev, facebook: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-zinc-150 dark:border-zinc-800 pt-4">
            {profileSavedSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mr-auto self-center animate-pulse">
                <Check className="h-4 w-4" /> Perfil guardado con éxito
              </span>
            )}
            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-xl bg-zinc-950 px-5 py-3 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 transition"
            >
              {savingProfile ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      )}

    </div>
  )
}
