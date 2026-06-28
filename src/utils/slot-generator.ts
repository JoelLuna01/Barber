import { WorkingHour, BlockedDate, Appointment } from "@/types"

export interface TimeSlot {
  time: string // e.g. "09:30"
  startTimeISO: string // ISO string for slot start
  endTimeISO: string // ISO string for slot end
  available: boolean
}

/**
 * Calculates available slots of 30 min intervals for a given date.
 */
export function generateAvailableSlots({
  selectedDate,
  workingHours,
  blockedDates,
  existingAppointments,
  serviceDurationMinutes
}: {
  selectedDate: Date
  workingHours: WorkingHour[]
  blockedDates: BlockedDate[]
  existingAppointments: Appointment[]
  serviceDurationMinutes: number
}): TimeSlot[] {
  const dayOfWeek = selectedDate.getDay() // 0 = Sunday, 1 = Monday...
  
  // Find employee working hours for this weekday
  const dailySchedule = workingHours.find(wh => wh.day_of_week === dayOfWeek && wh.is_active)
  if (!dailySchedule) return []

  const dateStr = selectedDate.toISOString().split("T")[0] // "YYYY-MM-DD"

  // Check if the entire shop or employee is blocked for this date
  const isDateBlocked = blockedDates.some(block => {
    const blockStart = new Date(block.start_date)
    const blockEnd = new Date(block.end_date)
    // Check if selectedDate (at midnight to end of day) overlaps with blocked window
    const dayStart = new Date(`${dateStr}T00:00:00Z`)
    const dayEnd = new Date(`${dateStr}T23:59:59Z`)
    return blockStart <= dayEnd && blockEnd >= dayStart
  })

  if (isDateBlocked) return []

  // Create starting time object
  const [startHour, startMin] = dailySchedule.start_time.split(":").map(Number)
  const [endHour, endMin] = dailySchedule.end_time.split(":").map(Number)

  const slots: TimeSlot[] = []
  
  // Set calendar pointers
  let currentPtr = new Date(selectedDate)
  currentPtr.setHours(startHour, startMin, 0, 0)

  const endPtr = new Date(selectedDate)
  endPtr.setHours(endHour, endMin, 0, 0)

  const now = new Date()

  // Generate slots in 30 minute steps
  while (currentPtr < endPtr) {
    const slotStart = new Date(currentPtr)
    const slotEnd = new Date(currentPtr.getTime() + serviceDurationMinutes * 60 * 1000)

    const slotTimeStr = slotStart.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    })

    // Check if slot falls out of shop hours
    if (slotEnd > endPtr) {
      currentPtr.setMinutes(currentPtr.getMinutes() + 30)
      continue
    }

    // Check if slot overlaps with lunch break
    let overlapsLunch = false
    if (dailySchedule.lunch_start && dailySchedule.lunch_end) {
      const [lStartH, lStartM] = dailySchedule.lunch_start.split(":").map(Number)
      const [lEndH, lEndM] = dailySchedule.lunch_end.split(":").map(Number)
      
      const lunchStart = new Date(selectedDate)
      lunchStart.setHours(lStartH, lStartM, 0, 0)
      
      const lunchEnd = new Date(selectedDate)
      lunchEnd.setHours(lEndH, lEndM, 0, 0)

      // Overlap occurs if slotStart < lunchEnd AND slotEnd > lunchStart
      if (slotStart < lunchEnd && slotEnd > lunchStart) {
        overlapsLunch = true
      }
    }

    // Check if slot overlaps with existing appointments
    const overlapsAppointment = existingAppointments.some(ap => {
      if (ap.status === "cancelled" || ap.status === "no_show") return false
      
      const apStart = new Date(ap.start_time)
      const apEnd = new Date(ap.end_time)

      return slotStart < apEnd && slotEnd > apStart
    })

    // Check if slot is in the past (if selecting today)
    const isInPast = slotStart < now

    const available = !overlapsLunch && !overlapsAppointment && !isInPast

    slots.push({
      time: slotTimeStr,
      startTimeISO: slotStart.toISOString(),
      endTimeISO: slotEnd.toISOString(),
      available
    })

    // Increment pointer by 30 mins
    currentPtr.setMinutes(currentPtr.getMinutes() + 30)
  }

  return slots
}
