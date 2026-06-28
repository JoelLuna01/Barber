import { 
  Barbershop, 
  Category, 
  Service, 
  Employee, 
  Customer, 
  WorkingHour, 
  BlockedDate, 
  Appointment, 
  AppointmentPhoto, 
  Product, 
  InventoryMovement, 
  CashRegister, 
  CashMovement, 
  Sale, 
  SaleItem, 
  Commission, 
  Expense, 
  Review, 
  GalleryItem, 
  Promotion,
  ActivityLog
} from "@/types"

// Helper to simulate delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// -------------------------------------------------------------
// In-Memory Storage State (seeded with initial values)
// -------------------------------------------------------------

export const mockBarbershop: Barbershop = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "BarberBook Studio",
  slug: "barberbook-studio",
  logo_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&q=80",
  cover_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=80",
  description: "Estilo, técnica y tradición en un ambiente premium pensado para el caballero moderno. Creadores de cortes icónicos y afeitados incomparables.",
  address: "Av. de la Reforma 450, Col. Juárez, Ciudad de México",
  phone: "+52 55 1234 5678",
  whatsapp: "+52 55 1234 5678",
  facebook: "https://facebook.com/barberbookstudio",
  instagram: "https://instagram.com/barberbookstudio",
  tiktok: "https://tiktok.com/@barberbookstudio",
  email: "contacto@barberbookstudio.com",
  created_at: new Date().toISOString()
}

export const mockCategories: Category[] = [
  { id: "cat-1", barbershop_id: mockBarbershop.id, name: "Cortes", type: "service", created_at: new Date().toISOString() },
  { id: "cat-2", barbershop_id: mockBarbershop.id, name: "Afeitado y Barba", type: "service", created_at: new Date().toISOString() },
  { id: "cat-3", barbershop_id: mockBarbershop.id, name: "Combos Especiales", type: "service", created_at: new Date().toISOString() },
  { id: "cat-4", barbershop_id: mockBarbershop.id, name: "Productos de Peinado", type: "product", created_at: new Date().toISOString() }
]

export const mockServices: Service[] = [
  {
    id: "s1",
    barbershop_id: mockBarbershop.id,
    category_id: "cat-1",
    name: "Corte de Cabello Clásico",
    description: "Corte tradicional con tijera y máquina, lavado de cabello, masaje capilar y peinado con pomada premium.",
    price: 350.00,
    duration_minutes: 30,
    image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&q=80",
    color: "#3B82F6",
    is_active: true,
    is_featured: true,
    display_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: "s2",
    barbershop_id: mockBarbershop.id,
    category_id: "cat-2",
    name: "Perfilado de Barba Ritual",
    description: "Recorte y alineación de barba con navaja libre, toallas calientes aromatizadas, bálsamo hidratante y aceite protector.",
    price: 280.00,
    duration_minutes: 20,
    image_url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&q=80",
    color: "#10B981",
    is_active: true,
    is_featured: true,
    display_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: "s3",
    barbershop_id: mockBarbershop.id,
    category_id: "cat-3",
    name: "Ritual Completo (Corte + Barba)",
    description: "El servicio insignia: Corte de cabello clásico + Ritual de barba completo con toallas calientes y exfoliación facial.",
    price: 550.00,
    duration_minutes: 50,
    image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80",
    color: "#8B5CF6",
    is_active: true,
    is_featured: true,
    display_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: "s4",
    barbershop_id: mockBarbershop.id,
    category_id: "cat-1",
    name: "Corte Degradado (Fade)",
    description: "Degradado de alta precisión (Low, Mid, High Fade) terminado a navaja, lavado y peinado con fijación mate.",
    price: 390.00,
    duration_minutes: 40,
    image_url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80",
    color: "#EC4899",
    is_active: true,
    is_featured: false,
    display_order: 4,
    created_at: new Date().toISOString()
  }
]

export const mockEmployees: Employee[] = [
  {
    id: "e1",
    barbershop_id: mockBarbershop.id,
    profile_id: "prof-barber-1",
    name: "Mateo Silva",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    bio: "Especialista en degradados (fades), cortes modernos de tijera y diseño de barba urbana.",
    experience_years: 8,
    specialties: ["Mid Fade", "Taper Fade", "Ritual de Barba"],
    social_instagram: "https://instagram.com/mateo_silvabarber",
    social_tiktok: "https://tiktok.com/@mateo_silvabarber",
    rating_avg: 4.95,
    is_active: true,
    commission_type: "percentage",
    commission_value: 40.00,
    created_at: new Date().toISOString()
  },
  {
    id: "e2",
    barbershop_id: mockBarbershop.id,
    profile_id: "prof-barber-2",
    name: "Lucas Russo",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    bio: "Maestro del corte tradicional clásico, afeitado a navaja libre antigua y tratamientos capilares.",
    experience_years: 12,
    specialties: ["Corte Clásico", "Afeitado Tradicional", "Masaje Capilar"],
    social_instagram: "https://instagram.com/lucas_russobarber",
    social_tiktok: "https://tiktok.com/@lucas_russobarber",
    rating_avg: 4.88,
    is_active: true,
    commission_type: "percentage",
    commission_value: 40.00,
    created_at: new Date().toISOString()
  }
]

export const mockWorkingHours: WorkingHour[] = [];

// Seed working hours (Mon-Sat, 9:00 - 18:00, lunch 13:00 - 14:00)
mockEmployees.forEach(emp => {
  for (let day = 1; day <= 6; day++) {
    mockWorkingHours.push({
      id: `wh-${emp.id}-${day}`,
      employee_id: emp.id,
      day_of_week: day,
      start_time: "09:00:00",
      end_time: "18:00:00",
      lunch_start: "13:00:00",
      lunch_end: "14:00:00",
      is_active: true
    })
  }
})

export const mockBlockedDates: BlockedDate[] = [
  {
    id: "block-1",
    employee_id: "e1",
    barbershop_id: mockBarbershop.id,
    start_date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0] + "T09:00:00Z",
    end_date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0] + "T18:00:00Z",
    reason: "Capacitación técnica de peinados",
    created_at: new Date().toISOString()
  }
]

export const mockCustomers: Customer[] = [
  {
    id: "c-1",
    barbershop_id: mockBarbershop.id,
    profile_id: "prof-client-1",
    full_name: "Alejandro Mendoza",
    email: "alejandro@gmail.com",
    phone: "+52 55 9876 5432",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    birth_date: "1994-08-15",
    notes: "Cabello crespo, prefiere pomada mate fuerte. Le gusta platicar de fútbol.",
    hair_type: "rizado",
    beard_type: "abundante",
    allergies: "Ninguna",
    loyalty_points: 120,
    total_spent: 2450.00,
    visits_count: 7, // 🥇 Cliente Frecuente
    created_at: new Date().toISOString()
  },
  {
    id: "c-2",
    barbershop_id: mockBarbershop.id,
    profile_id: "prof-client-2",
    full_name: "Roberto Garza",
    email: "roberto.garza@hotmail.com",
    phone: "+52 55 8765 4321",
    avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    birth_date: "1988-12-03",
    notes: "Cabello lacio delgado. Prefiere perfilado suave y loción refrescante de menta.",
    hair_type: "lacio",
    beard_type: "corta",
    allergies: "Sensible al alcohol en la piel",
    loyalty_points: 350,
    total_spent: 5900.00,
    visits_count: 15, // ⭐⭐ Cliente VIP
    created_at: new Date().toISOString()
  },
  {
    id: "c-3",
    barbershop_id: mockBarbershop.id,
    profile_id: null, // Guest user
    full_name: "Ignacio Torres (Invitado)",
    email: "ignacio@outlook.com",
    phone: "+52 55 4321 8765",
    avatar_url: null,
    birth_date: null,
    notes: "Cliente nuevo, reservó sin registro.",
    hair_type: "ondulado",
    beard_type: "ninguna",
    allergies: null,
    loyalty_points: 10,
    total_spent: 350.00,
    visits_count: 1,
    created_at: new Date().toISOString()
  }
]

export const mockAppointments: Appointment[] = [
  {
    id: "ap-1",
    barbershop_id: mockBarbershop.id,
    customer_id: "c-1",
    employee_id: "e1",
    service_id: "s1",
    start_time: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    status: "completed",
    notes: "Quiere el degradado habitual.",
    total_price: 350.00,
    created_at: new Date().toISOString()
  },
  {
    id: "ap-2",
    barbershop_id: mockBarbershop.id,
    customer_id: "c-2",
    employee_id: "e2",
    service_id: "s3",
    start_time: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(11, 50, 0, 0)).toISOString(),
    status: "confirmed",
    notes: "Ritual completo para evento.",
    total_price: 550.00,
    created_at: new Date().toISOString()
  },
  {
    id: "ap-3",
    barbershop_id: mockBarbershop.id,
    customer_id: "c-3",
    employee_id: "e1",
    service_id: "s2",
    start_time: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(12, 20, 0, 0)).toISOString(),
    status: "pending",
    notes: "Primer afeitado con nosotros.",
    total_price: 280.00,
    created_at: new Date().toISOString()
  }
]

export const mockAppointmentPhotos: AppointmentPhoto[] = [
  {
    id: "photo-1",
    appointment_id: "ap-1",
    barbershop_id: mockBarbershop.id,
    photo_type: "before",
    image_url: "https://images.unsplash.com/photo-1517832606589-7a598bbd0fb6?w=400&q=80",
    products_used: [],
    notes: "Llegó con crecimiento de 4 semanas.",
    created_at: new Date().toISOString()
  },
  {
    id: "photo-2",
    appointment_id: "ap-1",
    barbershop_id: mockBarbershop.id,
    photo_type: "after",
    image_url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80",
    products_used: ["Pomada Modeladora Fuerte"],
    notes: "Degradado medio muy limpio, perfilado con navaja.",
    created_at: new Date().toISOString()
  }
]

export const mockProducts: Product[] = [
  {
    id: "p1",
    barbershop_id: mockBarbershop.id,
    category_id: "cat-4",
    name: "Pomada Modeladora Fuerte",
    brand: "Reuzel",
    description: "Pomada base agua con fijación fuerte y brillo medio. Ideal para peinados Pompadour.",
    price: 320.00,
    cost: 180.00,
    stock: 15,
    sku: "RZ-POM-01",
    barcode: "871891823719",
    supplier: "Distribuidora Mexicana de Belleza",
    image_url: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=400&q=80",
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: "p2",
    barbershop_id: mockBarbershop.id,
    category_id: "cat-4",
    name: "Aceite Hidratante para Barba",
    brand: "Grave Before Shave",
    description: "Aceite nutritivo formulado con jojoba, almendras y aroma a sándalo. Hidrata barba y piel.",
    price: 290.00,
    cost: 160.00,
    stock: 3, // low stock
    sku: "GBS-OIL-02",
    barcode: "721891823812",
    supplier: "Grave Distributing",
    image_url: "https://images.unsplash.com/photo-1626015713026-d837d172406f?w=400&q=80",
    is_active: true,
    created_at: new Date().toISOString()
  }
]

export const mockInventoryMovements: InventoryMovement[] = [
  {
    id: "im-1",
    product_id: "p1",
    barbershop_id: mockBarbershop.id,
    type: "in",
    quantity: 20,
    reason: "Compra inicial de stock",
    created_at: new Date().toISOString()
  },
  {
    id: "im-2",
    product_id: "p1",
    barbershop_id: mockBarbershop.id,
    type: "sale",
    quantity: -5,
    reason: "Ventas registradas en mostrador",
    created_at: new Date().toISOString()
  }
]

export const mockCashRegisters: CashRegister[] = [
  {
    id: "cr-1",
    barbershop_id: mockBarbershop.id,
    opened_by: "prof-admin-1",
    closed_by: null,
    opened_at: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    closed_at: null,
    initial_amount: 1500.00,
    expected_amount: 2400.00,
    actual_amount: null,
    difference: null,
    status: "open",
    notes: "Caja abierta a tiempo por administrador."
  }
]

export const mockCashMovements: CashMovement[] = [
  {
    id: "cm-1",
    cash_register_id: "cr-1",
    barbershop_id: mockBarbershop.id,
    type: "income",
    amount: 900.00, // from cash sale
    description: "Venta de servicios en efectivo (Alejandro Mendoza + Ritual)",
    created_at: new Date().toISOString()
  }
]

export const mockSales: Sale[] = [
  {
    id: "sale-1",
    barbershop_id: mockBarbershop.id,
    cash_register_id: "cr-1",
    customer_id: "c-1",
    employee_id: "e1",
    total_amount: 670.00,
    discount_amount: 0.00,
    payment_method: "cash",
    payment_status: "completed",
    created_at: new Date(new Date().setHours(10, 30, 0, 0)).toISOString()
  }
]

export const mockSaleItems: SaleItem[] = [
  {
    id: "si-1",
    sale_id: "sale-1",
    barbershop_id: mockBarbershop.id,
    item_type: "service",
    service_id: "s1",
    product_id: null,
    quantity: 1,
    unit_price: 350.00,
    total_price: 350.00
  },
  {
    id: "si-2",
    sale_id: "sale-1",
    barbershop_id: mockBarbershop.id,
    item_type: "product",
    service_id: null,
    product_id: "p1",
    quantity: 1,
    unit_price: 320.00,
    total_price: 320.00
  }
]

export const mockCommissions: Commission[] = [
  {
    id: "com-1",
    barbershop_id: mockBarbershop.id,
    employee_id: "e1",
    sale_id: "sale-1",
    amount: 140.00, // 40% of 350 service cost
    status: "pending",
    paid_at: null,
    created_at: new Date().toISOString()
  }
]

export const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    barbershop_id: mockBarbershop.id,
    category: "services",
    description: "Pago de electricidad mensual",
    amount: 850.00,
    expense_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  }
]

export const mockReviews: Review[] = [
  {
    id: "rev-1",
    barbershop_id: mockBarbershop.id,
    appointment_id: "ap-1",
    customer_id: "c-1",
    employee_id: "e1",
    rating: 5,
    comment: "Excelente servicio como siempre. Mateo tiene una técnica impecable de difuminado y el trato es inmejorable.",
    created_at: new Date().toISOString()
  },
  {
    id: "rev-2",
    barbershop_id: mockBarbershop.id,
    appointment_id: "ap-2",
    customer_id: "c-2",
    employee_id: "e2",
    rating: 5,
    comment: "El ritual de toallas calientes es relajación pura. Lucas es sumamente profesional y perfeccionista.",
    created_at: new Date().toISOString()
  }
]

export const mockGallery: GalleryItem[] = [
  {
    id: "gal-1",
    barbershop_id: mockBarbershop.id,
    image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80",
    caption: "Ritual completo de barba y corte clásico.",
    created_at: new Date().toISOString()
  },
  {
    id: "gal-2",
    barbershop_id: mockBarbershop.id,
    image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80",
    caption: "Pompadour texturizado impecable.",
    created_at: new Date().toISOString()
  },
  {
    id: "gal-3",
    barbershop_id: mockBarbershop.id,
    image_url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80",
    caption: "Degradado medio en cabello ondulado.",
    created_at: new Date().toISOString()
  },
  {
    id: "gal-4",
    barbershop_id: mockBarbershop.id,
    image_url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80",
    caption: "Afeitado clásico y alineación a navaja libre.",
    created_at: new Date().toISOString()
  }
]

export const mockPromotions: Promotion[] = [
  {
    id: "promo-1",
    barbershop_id: mockBarbershop.id,
    name: "Jueves de Barba 2x1",
    description: "Agenda tu perfilado ritual de barba el jueves y paga solo la mitad en tu servicio.",
    discount_type: "percentage",
    discount_value: 50.00,
    start_date: new Date().toISOString(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    is_active: true,
    created_at: new Date().toISOString()
  }
]

export const mockActivityLogs: ActivityLog[] = [
  {
    id: "log-1",
    barbershop_id: mockBarbershop.id,
    profile_id: "prof-admin-1",
    action: "Caja Abierta",
    details: { initial_amount: 1500.00 },
    created_at: new Date().toISOString()
  }
]

// -------------------------------------------------------------
// React State Handlers (acting like a local DB repository)
// -------------------------------------------------------------

export class MockDatabase {
  static services = [...mockServices]
  static employees = [...mockEmployees]
  static categories = [...mockCategories]
  static workingHours = [...mockWorkingHours]
  static blockedDates = [...mockBlockedDates]
  static customers = [...mockCustomers]
  static appointments = [...mockAppointments]
  static appointmentPhotos = [...mockAppointmentPhotos]
  static products = [...mockProducts]
  static inventoryMovements = [...mockInventoryMovements]
  static cashRegisters = [...mockCashRegisters]
  static cashMovements = [...mockCashMovements]
  static sales = [...mockSales]
  static saleItems = [...mockSaleItems]
  static commissions = [...mockCommissions]
  static expenses = [...mockExpenses]
  static reviews = [...mockReviews]
  static gallery = [...mockGallery]
  static promotions = [...mockPromotions]
  static activityLogs = [...mockActivityLogs]

  // Services CRUD
  static async getServices() {
    await delay(300)
    return this.services.filter(s => s.is_active)
  }

  static async addService(service: Omit<Service, "id" | "created_at">) {
    const newService: Service = {
      ...service,
      id: `s-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    this.services.push(newService)
    return newService
  }

  static async updateService(id: string, updates: Partial<Service>) {
    this.services = this.services.map(s => s.id === id ? { ...s, ...updates } : s)
    return this.services.find(s => s.id === id)
  }

  // Employees CRUD
  static async getEmployees() {
    await delay(300)
    return this.employees.filter(e => e.is_active)
  }

  // Appointments CRUD
  static async getAppointments() {
    await delay(300)
    return this.appointments.map(ap => ({
      ...ap,
      customer: this.customers.find(c => c.id === ap.customer_id),
      employee: this.employees.find(e => e.id === ap.employee_id),
      service: this.services.find(s => s.id === ap.service_id),
      photos: this.appointmentPhotos.filter(ph => ph.appointment_id === ap.id)
    }))
  }

  static async addAppointment(ap: Omit<Appointment, "id" | "created_at">) {
    const newAp: Appointment = {
      ...ap,
      id: `ap-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    this.appointments.push(newAp)
    
    // Auto update customer visit counts
    const customer = this.customers.find(c => c.id === ap.customer_id)
    if (customer) {
      customer.visits_count += 1
      customer.total_spent += Number(ap.total_price)
    }

    return newAp
  }

  static async updateAppointmentStatus(id: string, status: Appointment["status"]) {
    this.appointments = this.appointments.map(ap => ap.id === id ? { ...ap, status } : ap)
    return this.appointments.find(ap => ap.id === id)
  }

  // Cash Register
  static async getActiveCashRegister() {
    return this.cashRegisters.find(cr => cr.status === "open") || null
  }

  static async openCashRegister(userId: string, initialAmount: number, notes?: string) {
    const newCr: CashRegister = {
      id: `cr-${Date.now()}`,
      barbershop_id: mockBarbershop.id,
      opened_by: userId,
      closed_by: null,
      opened_at: new Date().toISOString(),
      closed_at: null,
      initial_amount: initialAmount,
      expected_amount: initialAmount,
      actual_amount: null,
      difference: null,
      status: "open",
      notes: notes || null
    }
    this.cashRegisters.push(newCr)
    return newCr
  }

  static async closeCashRegister(id: string, userId: string, actualAmount: number, notes?: string) {
    const reg = this.cashRegisters.find(cr => cr.id === id)
    if (!reg) throw new Error("Caja no encontrada")
    
    // expected amount is initial_amount + cash_movements + sales cash
    const movements = this.cashMovements.filter(m => m.cash_register_id === id)
    const incomeTotal = movements.filter(m => m.type === "income").reduce((acc, m) => acc + Number(m.amount), 0)
    const expenseTotal = movements.filter(m => m.type === "expense").reduce((acc, m) => acc + Number(m.amount), 0)
    
    const expected = Number(reg.initial_amount) + incomeTotal - expenseTotal
    const difference = actualAmount - expected

    reg.closed_by = userId
    reg.closed_at = new Date().toISOString()
    reg.actual_amount = actualAmount
    reg.expected_amount = expected
    reg.difference = difference
    reg.status = "closed"
    reg.notes = notes || reg.notes

    return reg
  }

  static async addCashMovement(movement: Omit<CashMovement, "id" | "created_at">) {
    const newMove: CashMovement = {
      ...movement,
      id: `cm-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    this.cashMovements.push(newMove)
    return newMove
  }

  // Products CRUD
  static async getProducts() {
    await delay(300)
    return this.products
  }

  static async addProduct(prod: Omit<Product, "id" | "created_at">) {
    const newProd: Product = {
      ...prod,
      id: `p-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    this.products.push(newProd)
    return newProd
  }

  static async updateProductStock(id: string, quantity: number, type: InventoryMovement["type"], reason: string) {
    const prod = this.products.find(p => p.id === id)
    if (!prod) return
    prod.stock += quantity
    
    this.inventoryMovements.push({
      id: `im-${Date.now()}`,
      product_id: id,
      barbershop_id: mockBarbershop.id,
      type,
      quantity,
      reason,
      created_at: new Date().toISOString()
    })
  }

  // Sales
  static async processSale(sale: Omit<Sale, "id" | "created_at">, items: Omit<SaleItem, "id" | "sale_id" | "barbershop_id">[]) {
    const saleId = `sale-${Date.now()}`
    const newSale: Sale = {
      ...sale,
      id: saleId,
      created_at: new Date().toISOString()
    }
    this.sales.push(newSale)

    // Items
    items.forEach(item => {
      const newItem: SaleItem = {
        ...item,
        id: `si-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        sale_id: saleId,
        barbershop_id: mockBarbershop.id
      }
      this.saleItems.push(newItem)

      // If product, reduce stock
      if (item.item_type === "product" && item.product_id) {
        this.updateProductStock(item.product_id, -item.quantity, "sale", `Venta registrada #${saleId}`)
      }

      // If service, check and assign commissions to the employee
      if (item.item_type === "service" && item.service_id && sale.employee_id) {
        const emp = this.employees.find(e => e.id === sale.employee_id)
        if (emp) {
          let commissionAmount = 0
          if (emp.commission_type === "percentage") {
            commissionAmount = (Number(item.total_price) * Number(emp.commission_value)) / 100
          } else if (emp.commission_type === "fixed") {
            commissionAmount = Number(emp.commission_value)
          }
          
          this.commissions.push({
            id: `com-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            barbershop_id: mockBarbershop.id,
            employee_id: sale.employee_id,
            sale_id: saleId,
            amount: commissionAmount,
            status: "pending",
            paid_at: null,
            created_at: new Date().toISOString()
          })
        }
      }
    })

    // If cash payment and there's an open cash register, add cash movement
    if (sale.payment_method === "cash" && sale.cash_register_id) {
      this.addCashMovement({
        cash_register_id: sale.cash_register_id,
        barbershop_id: mockBarbershop.id,
        type: "income",
        amount: sale.total_amount,
        description: `Venta #${saleId}`
      })
    }

    return newSale
  }

  // Expenses CRUD
  static async getExpenses() {
    await delay(300)
    return this.expenses
  }

  static async addExpense(exp: Omit<Expense, "id" | "created_at">) {
    const newExp: Expense = {
      ...exp,
      id: `exp-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    this.expenses.push(newExp)

    // If there's an active cash register and paid in cash, record egress
    const activeReg = await this.getActiveCashRegister()
    if (activeReg) {
      this.addCashMovement({
        cash_register_id: activeReg.id,
        barbershop_id: mockBarbershop.id,
        type: "expense",
        amount: exp.amount,
        description: `Gasto registrado: ${exp.description}`
      })
    }

    return newExp
  }

  // Reviews
  static async getReviews() {
    return this.reviews.map(r => ({
      ...r,
      customer: this.customers.find(c => c.id === r.customer_id)
    }))
  }

  static async addReview(rev: Omit<Review, "id" | "created_at">) {
    const newRev: Review = {
      ...rev,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    this.reviews.push(newRev)
    return newRev
  }
}
