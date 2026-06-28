import { createClient } from "@/lib/supabase"
import { MockDatabase, mockBarbershop } from "@/lib/mock-data"
import { Appointment, Customer, BlockedDate, WorkingHour } from "@/types"

const isSupabaseConfigured = () => {
  return typeof window !== 'undefined'
    ? !!process.env.NEXT_PUBLIC_SUPABASE_URL
    : !!process.env.NEXT_PUBLIC_SUPABASE_URL
}

export class AppointmentsService {
  static async getAppointments(): Promise<Appointment[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("appointments")
          .select("*, customers(*), employees(*), services(*), appointment_photos(*)")
          .order("start_time", { ascending: true })

        if (error) throw error
        return data as Appointment[]
      } catch (err) {
        console.warn("Supabase getAppointments failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.getAppointments()
  }

  static async getBlockedDates(): Promise<BlockedDate[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("blocked_dates")
          .select("*")
          .order("start_date", { ascending: true })

        if (error) throw error
        return data as BlockedDate[]
      } catch (err) {
        console.warn("Supabase getBlockedDates failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.blockedDates
  }

  static async addBlockedDate(blocked: Omit<BlockedDate, "id" | "created_at">): Promise<BlockedDate> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("blocked_dates")
          .insert(blocked)
          .select()
          .single()

        if (error) throw error
        return data as BlockedDate
      } catch (err) {
        console.warn("Supabase addBlockedDate failed, falling back to mock data.", err)
      }
    }
    const newBlock: BlockedDate = {
      ...blocked,
      id: `block-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    MockDatabase.blockedDates.push(newBlock)
    return newBlock
  }

  static async deleteBlockedDate(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { error } = await supabase
          .from("blocked_dates")
          .delete()
          .eq("id", id)

        if (error) throw error
        return true
      } catch (err) {
        console.warn("Supabase deleteBlockedDate failed, falling back to mock data.", err)
      }
    }
    MockDatabase.blockedDates = MockDatabase.blockedDates.filter(b => b.id !== id)
    return true
  }

  static async updateAppointmentStatus(id: string, status: Appointment["status"]): Promise<Appointment | undefined> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("appointments")
          .update({ status })
          .eq("id", id)
          .select()
          .single()

        if (error) throw error
        return data as Appointment
      } catch (err) {
        console.warn("Supabase updateAppointmentStatus failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.updateAppointmentStatus(id, status)
  }

  // Double booking validation & insertion logic
  static async bookAppointment(bookingData: {
    serviceId: string
    employeeId: string
    startTime: string
    endTime: string
    notes?: string
    clientData: {
      fullName: string
      phone: string
      email?: string
    }
  }): Promise<Appointment> {
    // 1. Resolve customer
    let customer: Customer | undefined

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        
        // Check if customer exists by phone
        const { data: existingCustomer } = await supabase
          .from("customers")
          .select("*")
          .eq("phone", bookingData.clientData.phone)
          .maybeSingle()

        if (existingCustomer) {
          customer = existingCustomer as Customer
        } else {
          // Create new guest customer
          const { data: newCustomer, error: createError } = await supabase
            .from("customers")
            .insert({
              barbershop_id: mockBarbershop.id,
              full_name: bookingData.clientData.fullName,
              phone: bookingData.clientData.phone,
              email: bookingData.clientData.email || null,
              loyalty_points: 0,
              total_spent: 0,
              visits_count: 0
            })
            .select()
            .single()

          if (createError) throw createError
          customer = newCustomer as Customer
        }

        // 2. Validate double booking
        const { data: conflicts } = await supabase
          .from("appointments")
          .select("*")
          .eq("employee_id", bookingData.employeeId)
          .eq("status", "confirmed")
          .lt("start_time", bookingData.endTime)
          .gt("end_time", bookingData.startTime)

        if (conflicts && conflicts.length > 0) {
          throw new Error("El horario seleccionado ya no está disponible.")
        }

        // Fetch service price
        const { data: service } = await supabase
          .from("services")
          .select("price")
          .eq("id", bookingData.serviceId)
          .single()

        const totalPrice = service ? service.price : 0

        // 3. Insert appointment
        const { data: newAp, error: apError } = await supabase
          .from("appointments")
          .insert({
            barbershop_id: mockBarbershop.id,
            customer_id: customer!.id,
            employee_id: bookingData.employeeId,
            service_id: bookingData.serviceId,
            start_time: bookingData.startTime,
            end_time: bookingData.endTime,
            status: "pending",
            notes: bookingData.notes || null,
            total_price: totalPrice
          })
          .select()
          .single()

        if (apError) throw apError
        return newAp as Appointment
      } catch (err: any) {
        console.warn("Supabase booking failed, trying mock fallback.", err)
        if (err.message && err.message.includes("El horario seleccionado")) {
          throw err
        }
      }
    }

    // Mock fallback
    let mockCust = MockDatabase.customers.find(c => c.phone === bookingData.clientData.phone)
    if (!mockCust) {
      mockCust = {
        id: `c-${Date.now()}`,
        barbershop_id: mockBarbershop.id,
        profile_id: null,
        full_name: bookingData.clientData.fullName,
        phone: bookingData.clientData.phone,
        email: bookingData.clientData.email || null,
        avatar_url: null,
        birth_date: null,
        notes: "Registrado desde flujo de reservas",
        hair_type: null,
        beard_type: null,
        allergies: null,
        loyalty_points: 0,
        total_spent: 0,
        visits_count: 0,
        created_at: new Date().toISOString()
      }
      MockDatabase.customers.push(mockCust)
    }

    // Validate conflict in Mock DB
    const hasConflict = MockDatabase.appointments.some(ap => 
      ap.employee_id === bookingData.employeeId &&
      ap.status !== "cancelled" &&
      new Date(ap.start_time) < new Date(bookingData.endTime) &&
      new Date(ap.end_time) > new Date(bookingData.startTime)
    )

    if (hasConflict) {
      throw new Error("El horario seleccionado ya no está disponible.")
    }

    const mockServ = MockDatabase.services.find(s => s.id === bookingData.serviceId)
    const price = mockServ ? mockServ.price : 0

    const newAp = await MockDatabase.addAppointment({
      barbershop_id: mockBarbershop.id,
      customer_id: mockCust.id,
      employee_id: bookingData.employeeId,
      service_id: bookingData.serviceId,
      start_time: bookingData.startTime,
      end_time: bookingData.endTime,
      status: "pending",
      notes: bookingData.notes || null,
      total_price: price
    })

    return newAp
  }

  static async getCustomers(): Promise<Customer[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .order("full_name", { ascending: true })

        if (error) throw error
        return data as Customer[]
      } catch (err) {
        console.warn("Supabase getCustomers failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.customers
  }

  static async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | undefined> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("customers")
          .update(updates)
          .eq("id", id)
          .select()
          .single()

        if (error) throw error
        return data as Customer
      } catch (err) {
        console.warn("Supabase updateCustomer failed, falling back to mock data.", err)
      }
    }
    MockDatabase.customers = MockDatabase.customers.map(c => c.id === id ? { ...c, ...updates } : c)
    return MockDatabase.customers.find(c => c.id === id)
  }
}
