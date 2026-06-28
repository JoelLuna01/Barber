export interface Barbershop {
  id: string
  name: string
  slug: string
  logo_url: string | null
  cover_url: string | null
  description: string | null
  address: string | null
  phone: string | null
  whatsapp: string | null
  facebook: string | null
  instagram: string | null
  tiktok: string | null
  email: string | null
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: "admin" | "barber" | "client"
  barbershop_id: string | null
  created_at: string
}

export interface Category {
  id: string
  barbershop_id: string
  name: string
  type: "service" | "product"
  created_at: string
}

export interface Service {
  id: string
  barbershop_id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  duration_minutes: number
  image_url: string | null
  color: string | null
  is_active: boolean
  is_featured: boolean
  display_order: number
  created_at: string
}

export interface Employee {
  id: string
  barbershop_id: string
  profile_id: string | null
  name: string
  avatar_url: string | null
  bio: string | null
  experience_years: number | null
  specialties: string[]
  social_instagram: string | null
  social_tiktok: string | null
  rating_avg: number
  is_active: boolean
  commission_type: "fixed" | "percentage" | "service_specific"
  commission_value: number
  created_at: string
  // Virtual relation list
  working_hours?: WorkingHour[]
}

export interface Customer {
  id: string
  barbershop_id: string
  profile_id: string | null
  full_name: string
  email: string | null
  phone: string | null
  avatar_url: string | null
  birth_date: string | null
  notes: string | null
  hair_type: string | null
  beard_type: string | null
  allergies: string | null
  loyalty_points: number
  total_spent: number
  visits_count: number
  created_at: string
}

export interface WorkingHour {
  id: string
  employee_id: string
  day_of_week: number // 0 = Sunday, 1 = Monday, etc.
  start_time: string
  end_time: string
  lunch_start: string | null
  lunch_end: string | null
  is_active: boolean
}

export interface BlockedDate {
  id: string
  employee_id: string | null
  barbershop_id: string
  start_date: string
  end_date: string
  reason: string | null
  created_at: string
}

export interface Appointment {
  id: string
  barbershop_id: string
  customer_id: string
  employee_id: string
  service_id: string
  start_time: string
  end_time: string
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show"
  notes: string | null
  total_price: number
  created_at: string
  // Embedded properties
  customer?: Customer
  employee?: Employee
  service?: Service
  photos?: AppointmentPhoto[]
}

export interface AppointmentPhoto {
  id: string
  appointment_id: string
  barbershop_id: string
  photo_type: "before" | "after"
  image_url: string
  products_used: string[] | null
  notes: string | null
  created_at: string
}

export interface Product {
  id: string
  barbershop_id: string
  category_id: string | null
  name: string
  brand: string | null
  description: string | null
  price: number
  cost: number
  stock: number
  sku: string | null
  barcode: string | null
  supplier: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
}

export interface InventoryMovement {
  id: string
  product_id: string
  barbershop_id: string
  type: "in" | "out" | "sale" | "adjustment" | "waste"
  quantity: number
  reason: string | null
  created_at: string
}

export interface CashRegister {
  id: string
  barbershop_id: string
  opened_by: string
  closed_by: string | null
  opened_at: string
  closed_at: string | null
  initial_amount: number
  expected_amount: number | null
  actual_amount: number | null
  difference: number | null
  status: "open" | "closed"
  notes: string | null
}

export interface CashMovement {
  id: string
  cash_register_id: string
  barbershop_id: string
  type: "income" | "expense"
  amount: number
  description: string
  created_at: string
}

export interface Sale {
  id: string
  barbershop_id: string
  cash_register_id: string | null
  customer_id: string | null
  employee_id: string | null
  total_amount: number
  discount_amount: number
  payment_method: "cash" | "card" | "transfer" | "mercado_pago" | "stripe"
  payment_status: "pending" | "completed" | "refunded"
  created_at: string
  // Joins
  sale_items?: SaleItem[]
  customer?: Customer
  employee?: Employee
}

export interface SaleItem {
  id: string
  sale_id: string
  barbershop_id: string
  item_type: "service" | "product"
  service_id: string | null
  product_id: string | null
  quantity: number
  unit_price: number
  total_price: number
}

export interface Commission {
  id: string
  barbershop_id: string
  employee_id: string
  sale_id: string | null
  amount: number
  status: "pending" | "paid"
  paid_at: string | null
  created_at: string
}

export interface Expense {
  id: string
  barbershop_id: string
  category: "rent" | "services" | "purchases" | "salaries" | "other"
  description: string
  amount: number
  expense_date: string
  created_at: string
}

export interface Review {
  id: string
  barbershop_id: string
  appointment_id: string | null
  customer_id: string
  employee_id: string | null
  rating: number
  comment: string | null
  created_at: string
  // Joins
  customer?: Customer
}

export interface GalleryItem {
  id: string
  barbershop_id: string
  image_url: string
  caption: string | null
  created_at: string
}

export interface Favorite {
  id: string
  profile_id: string
  barbershop_id: string
  service_id: string | null
  employee_id: string | null
}

export interface Notification {
  id: string
  profile_id: string
  barbershop_id: string
  title: string
  message: string
  is_read: boolean
  type: string | null
  created_at: string
}

export interface Promotion {
  id: string
  barbershop_id: string
  name: string
  description: string | null
  discount_type: "percentage" | "fixed"
  discount_value: number
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
}

export interface ActivityLog {
  id: string
  barbershop_id: string
  profile_id: string | null
  action: string
  details: Record<string, unknown>
  created_at: string
}

export interface DashboardMetrics {
  todayIncome: number
  weeklyIncome: number
  monthlyIncome: number
  yearlyIncome: number
  todayAppointmentsCount: number
  pendingAppointmentsCount: number
  completedAppointmentsCount: number
  lowStockCount: number
  lowStockList: Product[]
  cajaStatus: "open" | "closed"
  cajaRegister: CashRegister | null
}

export interface DashboardAnalytics {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  ticketAverage: number
  monthlyChart: { name: string; income: number; expenses: number; net: number }[]
  serviceChart: { name: string; value: number }[]
  employeeChart: { name: string; value: number }[]
  hoursChart: { hour: string; count: number }[]
  customerRetention: { name: string; value: number }[]
}
