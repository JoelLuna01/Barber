"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronLeft, 
  Clock, 
  Scissors, 
  CheckCircle, 
  ChevronRight, 
  AlertCircle,
  KeyRound
} from "lucide-react"
import { Service, Category, Employee, BlockedDate, Appointment } from "@/types"
import { generateAvailableSlots, TimeSlot } from "@/utils/slot-generator"
import { AppointmentsService } from "@/services/appointments.service"
import { createClient } from "@/lib/supabase"
import Image from "next/image"

interface BookingFlowProps {
  services: Service[]
  categories: Category[]
  employees: Employee[]
  blockedDates: BlockedDate[]
  appointments: Appointment[]
  shopName: string
  shopAddress: string
  shopWhatsapp: string
}

type BookableTimeSlot = TimeSlot & { employeeId?: string }

export default function BookingFlow({
  services,
  employees,
  blockedDates,
  appointments,
  shopName,
  shopAddress,
  shopWhatsapp
}: BookingFlowProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialService = services.find(s => s.id === searchParams.get("service")) ?? null
  const initialBarber = employees.find(e => e.id === searchParams.get("barber")) ?? null

  // -------------------------------------------------------------
  // Step & Selections State
  // -------------------------------------------------------------
  const [step, setStep] = React.useState<number>(initialService ? 2 : 1)
  
  const [selectedService, setSelectedService] = React.useState<Service | null>(initialService)
  const [selectedBarber, setSelectedBarber] = React.useState<Employee | null>(initialBarber) // null = Any Barber
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlot | null>(null)
  
  // Guest Contact Form
  const [fullName, setFullName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [notes, setNotes] = React.useState("")

  // Form error
  const [formError, setFormError] = React.useState("")

  // Booking Result State
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [createdAppointment, setCreatedAppointment] = React.useState<Appointment | null>(null)
  const [password, setPassword] = React.useState("")
  const [accountCreated, setAccountCreated] = React.useState(false)

  // -------------------------------------------------------------
  // Available Slots Calculations
  // -------------------------------------------------------------
  const computedSlots = React.useMemo<BookableTimeSlot[]>(() => {
    if (!selectedService || !selectedDate) return []

    // If a specific barber is selected
    if (selectedBarber) {
      return generateAvailableSlots({
        selectedDate,
        workingHours: selectedBarber.working_hours || [],
        blockedDates: blockedDates.filter(b => b.employee_id === selectedBarber.id || !b.employee_id),
        existingAppointments: appointments.filter(ap => ap.employee_id === selectedBarber.id),
        serviceDurationMinutes: selectedService.duration_minutes
      })
    }

    // "Any Barber" option: Merge slots. A slot is available if at least one employee is free.
    const mergedSlotsMap: { [time: string]: TimeSlot & { employeeId: string } } = {}

    employees.forEach(emp => {
      const empSlots = generateAvailableSlots({
        selectedDate,
        workingHours: emp.working_hours || [],
        blockedDates: blockedDates.filter(b => b.employee_id === emp.id || !b.employee_id),
        existingAppointments: appointments.filter(ap => ap.employee_id === emp.id),
        serviceDurationMinutes: selectedService.duration_minutes
      })

      empSlots.forEach(slot => {
        if (slot.available) {
          if (!mergedSlotsMap[slot.time]) {
            mergedSlotsMap[slot.time] = { ...slot, employeeId: emp.id }
          }
        }
      })
    })

    return Object.values(mergedSlotsMap).sort((a, b) => a.time.localeCompare(b.time))
  }, [selectedService, selectedBarber, selectedDate, employees, blockedDates, appointments])

  // -------------------------------------------------------------
  // Helper functions
  // -------------------------------------------------------------
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
  }

  const handleNextStep = () => {
    if (step === 1 && selectedService) setStep(2)
    else if (step === 2) setStep(3)
    else if (step === 3 && selectedSlot) setStep(4)
  }

  const handlePrevStep = () => {
    if (step > 1 && step < 5) setStep(step - 1)
  }

  // -------------------------------------------------------------
  // Submit Appointment
  // -------------------------------------------------------------
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (!fullName.trim() || !phone.trim()) {
      setFormError("Nombre y teléfono son obligatorios.")
      return
    }

    setIsSubmitting(true)

    // Resolve barber for Any Barber option
    let finalBarberId = selectedBarber?.id
    if (!finalBarberId && selectedSlot) {
      const slotMatch = computedSlots.find(s => s.time === selectedSlot.time)
      finalBarberId = slotMatch?.employeeId || employees[0].id
    }

    try {
      const ap = await AppointmentsService.bookAppointment({
        serviceId: selectedService!.id,
        employeeId: finalBarberId!,
        startTime: selectedSlot!.startTimeISO,
        endTime: selectedSlot!.endTimeISO,
        notes: notes.trim() || undefined,
        clientData: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined
        }
      })

      setCreatedAppointment(ap)
      setStep(5)
    } catch (err) {
      const message = err instanceof Error ? err.message : ""
      setFormError(message || "Ocurrio un error al procesar tu cita. Intentalo nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // WhatsApp Message Trigger
  const handleWhatsAppShare = () => {
    if (!createdAppointment) return
    
    const dateFormatted = new Date(createdAppointment.start_time).toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
    const timeFormatted = new Date(createdAppointment.start_time).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit"
    })

    const barberName = employees.find(e => e.id === createdAppointment.employee_id)?.name || "Barbero"
    const serviceName = selectedService?.name || "Servicio de Barbería"

    const message = `Hola ${shopName}, acabo de reservar una cita como Invitado.
📝 Nro de Reserva: #${createdAppointment.id.substring(0, 8).toUpperCase()}
✂️ Servicio: ${serviceName}
👤 Barbero: ${barberName}
📅 Fecha: ${dateFormatted}
⏰ Hora: ${timeFormatted}
📍 Dirección: ${shopAddress}
¡Espero confirmación! Gracias.`

    window.open(`https://wa.me/${shopWhatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`, "_blank")
  }

  // Optional Account Creation on final step
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim() || password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: email.trim() || `${phone.trim()}@barberbook.com`,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "client",
          phone: phone
        }
      }
    })

    if (error) {
      alert(`Error: ${error.message}`)
    } else {
      setAccountCreated(true)
    }
  }

  const getNextAvailableDates = () => {
    const dates: Date[] = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      if (d.getDay() !== 0) { // Exclude Sunday
        dates.push(d)
      }
    }
    return dates
  }

  const nextDates = getNextAvailableDates()

  return (
    <div className="w-full max-w-xl bg-[#15171A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl my-10 font-sans">
      
      {/* Top Header progress indicator */}
      {step < 5 && (
        <div className="bg-[#1B1D21] text-[#F3EDE2] p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            {step > 1 ? (
              <button 
                onClick={handlePrevStep}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A1A1AA] hover:text-[#F3EDE2] transition"
              >
                <ChevronLeft className="h-4 w-4" />
                Atrás
              </button>
            ) : (
              <span className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">Paso {step} de 4</span>
            )}
            <span className="text-sm font-bold font-serif text-[#D89B2B]">Asistente de Reservas</span>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1 w-full bg-[#0B0B0C] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#D89B2B] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="p-6">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: SELECT SERVICE */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-bold font-serif text-[#F3EDE2]">Selecciona un servicio</h2>
              <p className="text-xs text-[#A1A1AA] mt-1">Elige el servicio o ritual que deseas programar.</p>

              <div className="mt-6 space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {services.map(service => {
                  const isSel = selectedService?.id === service.id
                  return (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition duration-200 ${
                        isSel 
                          ? "border-[#D89B2B]/40 bg-[#D89B2B]/10" 
                          : "border-white/5 bg-[#1B1D21] hover:bg-[#1B1D21]/80"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D89B2B]/10 text-[#D89B2B]">
                          <Scissors className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#F3EDE2]">{service.name}</h4>
                          <span className="text-[11px] text-[#A1A1AA] mt-1 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {service.duration_minutes} min
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold font-serif text-[#F3EDE2]">
                          ${Number(service.price).toFixed(0)}<span className="text-[10px] font-sans text-[#A1A1AA] ml-1">MXN</span>
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  disabled={!selectedService}
                  onClick={handleNextStep}
                  className="flex items-center gap-2 rounded-full bg-[#D89B2B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#0B0B0C] transition hover:bg-[#e0a835] disabled:opacity-40 active:scale-95"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SELECT BARBER */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-bold font-serif text-[#F3EDE2]">Elige a tu barbero</h2>
              <p className="text-xs text-[#A1A1AA] mt-1">Selecciona al profesional de tu preferencia.</p>

              <div className="mt-6 space-y-3">
                {/* Any Barber (Default) */}
                <button
                  onClick={() => setSelectedBarber(null)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition duration-200 ${
                    selectedBarber === null
                      ? "border-[#D89B2B]/40 bg-[#D89B2B]/10"
                      : "border-white/5 bg-[#1B1D21] hover:bg-[#1B1D21]/80"
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0B0B0C] text-[#D89B2B] font-bold text-lg border border-white/5">
                    ★
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F3EDE2]">Cualquier barbero disponible</h4>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">Asigna automáticamente la primera hora disponible.</p>
                  </div>
                </button>

                {employees.map(barber => {
                  const isSel = selectedBarber?.id === barber.id
                  return (
                    <button
                      key={barber.id}
                      onClick={() => setSelectedBarber(barber)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition duration-200 ${
                        isSel
                          ? "border-[#D89B2B]/40 bg-[#D89B2B]/10"
                          : "border-white/5 bg-[#1B1D21] hover:bg-[#1B1D21]/80"
                      }`}
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/5">
                        <Image
                          src={barber.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"}
                          alt={barber.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#F3EDE2]">{barber.name}</h4>
                        <p className="text-xs text-[#A1A1AA] mt-0.5">{barber.specialties.join(", ")}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 rounded-full bg-[#D89B2B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#0B0B0C] transition hover:bg-[#e0a835] active:scale-95"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DATE & TIME */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-bold font-serif text-[#F3EDE2]">Fecha y Hora</h2>
              <p className="text-xs text-[#A1A1AA] mt-1">Selecciona el día y tu horario preferido.</p>

              {/* Horizontal Dates Carousels */}
              <div className="mt-6 flex gap-2 overflow-x-auto pb-3 scrollbar-thin">
                {nextDates.map(date => {
                  const isSel = selectedDate && selectedDate.toDateString() === date.toDateString()
                  const dayNum = date.getDate()
                  const dayName = date.toLocaleDateString("es-MX", { weekday: "short" })
                  const monthName = date.toLocaleDateString("es-MX", { month: "short" })

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDateSelect(date)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border min-w-[72px] shrink-0 text-center transition duration-200 ${
                        isSel
                          ? "border-[#D89B2B] bg-[#D89B2B] text-[#0B0B0C]"
                          : "border-white/5 bg-[#1B1D21] text-[#A1A1AA] hover:bg-[#1B1D21]/80"
                      }`}
                    >
                      <span className={`text-[9px] uppercase font-bold tracking-wider ${isSel ? "text-[#0B0B0C]/75" : "text-[#A1A1AA]"}`}>{dayName}</span>
                      <span className={`text-lg font-bold font-serif my-0.5 ${isSel ? "text-[#0B0B0C]" : "text-[#F3EDE2]"}`}>{dayNum}</span>
                      <span className={`text-[9px] uppercase font-bold tracking-wider ${isSel ? "text-[#0B0B0C]/75" : "text-[#A1A1AA]"}`}>{monthName}</span>
                    </button>
                  )
                })}
              </div>

              {/* Time Slots Grid */}
              {selectedDate ? (
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] mb-4">Horarios Disponibles</h4>
                  
                  {computedSlots.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {computedSlots.map(slot => (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-xl py-3 text-xs font-semibold border transition duration-200 ${
                            selectedSlot?.time === slot.time
                              ? "border-[#D89B2B] bg-[#D89B2B]/20 text-[#D89B2B]"
                              : slot.available
                                ? "border-white/5 bg-[#1B1D21] text-[#F3EDE2] hover:bg-[#1B1D21]/80"
                                : "border-white/5 bg-[#1B1D21]/30 text-[#A1A1AA]/10 line-through cursor-not-allowed"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-[#A1A1AA] text-sm flex flex-col items-center gap-2">
                      <AlertCircle className="h-6 w-6 text-[#A1A1AA]/50" />
                      No hay horarios disponibles para la fecha seleccionada.
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-[#A1A1AA] text-sm">
                  Selecciona una fecha arriba para ver la disponibilidad.
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  disabled={!selectedSlot}
                  onClick={handleNextStep}
                  className="flex items-center gap-2 rounded-full bg-[#D89B2B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#0B0B0C] transition hover:bg-[#e0a835] disabled:opacity-40 active:scale-95"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: GUEST INFORMATION & SUMMARY */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-bold font-serif text-[#F3EDE2]">Confirma tus datos</h2>
              <p className="text-xs text-[#A1A1AA] mt-1">Completa tu información para asegurar tu cita.</p>

              {/* Summary Card */}
              <div className="mt-6 rounded-2xl bg-[#1B1D21] p-5 border border-white/5">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#D89B2B] mb-4">Detalle de tu reserva</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A1A1AA]">Servicio:</span>
                    <span className="font-bold text-[#F3EDE2]">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A1A1AA]">Barbero:</span>
                    <span className="font-bold text-[#F3EDE2]">{selectedBarber?.name || "Cualquier barbero"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A1A1AA]">Fecha:</span>
                    <span className="font-bold text-[#F3EDE2] capitalize">
                      {selectedDate?.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A1A1AA]">Hora:</span>
                    <span className="font-bold text-[#F3EDE2]">{selectedSlot?.time} hs</span>
                  </div>
                  <hr className="my-2 border-white/5" />
                  <div className="flex justify-between text-base font-bold font-serif">
                    <span className="text-[#F3EDE2]">Total a pagar:</span>
                    <span className="text-[#D89B2B]">${Number(selectedService?.price).toFixed(0)} MXN</span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleConfirmBooking} className="mt-6 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] block mb-1.5">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Alejandro Mendoza"
                    className="w-full rounded-xl border border-white/5 bg-[#1B1D21] px-4 py-3 text-sm text-[#F3EDE2] placeholder-white/20 focus:border-[#D89B2B] focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] block mb-1.5">WhatsApp / Teléfono *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. +52 55 9876 5432"
                    className="w-full rounded-xl border border-white/5 bg-[#1B1D21] px-4 py-3 text-sm text-[#F3EDE2] placeholder-white/20 focus:border-[#D89B2B] focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] block mb-1.5">Correo Electrónico (Opcional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ej. alejandro@correo.com"
                    className="w-full rounded-xl border border-white/5 bg-[#1B1D21] px-4 py-3 text-sm text-[#F3EDE2] placeholder-white/20 focus:border-[#D89B2B] focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] block mb-1.5">Notas especiales (Opcional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. ¿Tienes alguna preferencia de corte o detalle?"
                    className="w-full rounded-xl border border-white/5 bg-[#1B1D21] px-4 py-3 text-sm text-[#F3EDE2] placeholder-white/20 focus:border-[#D89B2B] focus:outline-none transition min-h-[64px]"
                  />
                </div>

                {formError && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-950/10 p-3 rounded-xl border border-rose-900/30">
                    <AlertCircle className="h-4.5 w-4.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#D89B2B] py-3.5 text-xs font-bold uppercase tracking-wider text-[#0B0B0C] transition hover:bg-[#e0a835] disabled:opacity-40 active:scale-97 mt-6"
                >
                  {isSubmitting ? "Procesando..." : "Confirmar Reserva"}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 5: SUCCESS & WHATSAPP DEEP LINK */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-emerald-500 animate-pulse" />
              </div>

              <h2 className="text-2xl font-bold font-serif text-[#F3EDE2]">¡Reserva Enviada con Éxito!</h2>
              
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#1B1D21] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#A1A1AA] border border-white/5">
                <span>Reserva:</span>
                <span className="font-bold text-[#D89B2B]">
                  #{createdAppointment?.id.substring(0, 8).toUpperCase()}
                </span>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-[#A1A1AA] max-w-sm mx-auto">
                Tu cita ha quedado registrada. Para una confirmación inmediata, abre nuestra conversación en WhatsApp y notifícanos.
              </p>

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsAppShare}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-emerald-500 active:scale-95 shadow-lg shadow-emerald-600/20"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.233-1.371a9.936 9.936 0 004.779 1.218h.004c5.502 0 9.981-4.478 9.983-9.985a9.957 9.957 0 00-2.925-7.064A9.9 9.9 0 0012.012 2zm5.72 13.917c-.244.69-1.21 1.258-1.666 1.306-.453.048-.902.222-2.909-.575-2.008-.797-3.298-2.845-3.398-2.977-.1-.133-.807-1.077-.807-2.052 0-.974.509-1.452.689-1.636.182-.185.398-.231.531-.231h.378c.121 0 .285-.046.444.34.167.404.57 1.393.62 1.494.05.101.084.22.017.355-.067.135-.1.22-.201.34-.101.12-.211.267-.3.355-.1.1-.205.21-.088.41.117.2 5.2 8.448 5.753.864.06.1.1.22.183.27.083.05.22.017.3-.067.084-.084.57-.69.72-.924.15-.235.3-.2.508-.117.206.084 1.308.614 1.532.723.224.11.373.165.428.261.055.096.055.556-.19 1.246z" />
                </svg>
                Confirmar por WhatsApp
              </button>

              <hr className="my-8 border-white/5" />

              {/* Account Conversion / Password signup */}
              {!accountCreated ? (
                <div className="rounded-2xl border border-white/5 bg-[#1B1D21] p-5 text-left">
                  <h4 className="text-sm font-bold text-[#F3EDE2] flex items-center gap-2">
                    <KeyRound className="h-4.5 w-4.5 text-[#D89B2B]" />
                    Guarda tu historial de cortes
                  </h4>
                  <p className="text-xs text-[#A1A1AA] mt-1.5 leading-relaxed">
                    ¡Crea una contraseña y conviértete en cliente registrado! Podrás ver tu historial, acumular puntos y reprogramar desde tu panel.
                  </p>

                  <form onSubmit={handleCreateAccount} className="mt-4 flex gap-2">
                    <input
                      type="password"
                      required
                      placeholder="Crea una contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 rounded-xl border border-white/5 bg-[#0B0B0C] px-3 py-2.5 text-xs text-[#F3EDE2] placeholder-white/20 focus:border-[#D89B2B] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-[#D89B2B] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0B0B0C] transition hover:bg-[#e0a835]"
                    >
                      Registrar
                    </button>
                  </form>
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  🎉 ¡Tu cuenta ha sido creada exitosamente!
                </div>
              )}

              <button
                onClick={() => router.push("/")}
                className="mt-6 text-xs font-bold uppercase tracking-wider text-[#A1A1AA] hover:text-[#F3EDE2] transition"
              >
                Volver al Inicio
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  )
}
