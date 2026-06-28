import { createClient } from "@/lib/supabase"
import { MockDatabase, mockBarbershop } from "@/lib/mock-data"
import { Barbershop, Category, Service, Employee, GalleryItem, Review, Promotion } from "@/types"

const isSupabaseConfigured = () => {
  return typeof window !== 'undefined'
    ? !!process.env.NEXT_PUBLIC_SUPABASE_URL
    : !!process.env.NEXT_PUBLIC_SUPABASE_URL
}

export class BarberShopService {
  static async getBarbershop(slug: string): Promise<Barbershop> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("barbershops")
          .select("*")
          .eq("slug", slug)
          .single()

        if (error) throw error
        return data as Barbershop
      } catch (err) {
        console.warn("Supabase getBarbershop failed, falling back to mock data.", err)
      }
    }
    // Fallback
    return mockBarbershop
  }

  static async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true })

        if (error) throw error
        return data as Category[]
      } catch (err) {
        console.warn("Supabase getCategories failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.categories
  }

  static async getServices(): Promise<Service[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })

        if (error) throw error
        return data as Service[]
      } catch (err) {
        console.warn("Supabase getServices failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.getServices()
  }

  static async addService(service: Omit<Service, "id" | "created_at">): Promise<Service> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("services")
          .insert(service)
          .select()
          .single()

        if (error) throw error
        return data as Service
      } catch (err) {
        console.warn("Supabase addService failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.addService(service)
  }

  static async updateService(id: string, updates: Partial<Service>): Promise<Service | undefined> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("services")
          .update(updates)
          .eq("id", id)
          .select()
          .single()

        if (error) throw error
        return data as Service
      } catch (err) {
        console.warn("Supabase updateService failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.updateService(id, updates)
  }

  static async getEmployees(): Promise<Employee[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("employees")
          .select("*, working_hours(*)")
          .eq("is_active", true)

        if (error) throw error
        return data as Employee[]
      } catch (err) {
        console.warn("Supabase getEmployees failed, falling back to mock data.", err)
      }
    }
    const employees = await MockDatabase.getEmployees()
    return employees.map(emp => ({
      ...emp,
      working_hours: MockDatabase.workingHours.filter(wh => wh.employee_id === emp.id)
    }))
  }

  static async getGallery(): Promise<GalleryItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        return data as GalleryItem[]
      } catch (err) {
        console.warn("Supabase getGallery failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.gallery
  }

  static async addGalleryItem(imageUrl: string, caption?: string): Promise<GalleryItem> {
    const newItem = {
      barbershop_id: mockBarbershop.id,
      image_url: imageUrl,
      caption: caption || null
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("gallery")
          .insert(newItem)
          .select()
          .single()

        if (error) throw error
        return data as GalleryItem
      } catch (err) {
        console.warn("Supabase addGalleryItem failed, falling back to mock data.", err)
      }
    }

    const mockItem: GalleryItem = {
      ...newItem,
      id: `gal-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    MockDatabase.gallery.unshift(mockItem)
    return mockItem
  }

  static async getReviews(): Promise<Review[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("reviews")
          .select("*, customers(*)")
          .order("created_at", { ascending: false })

        if (error) throw error
        return data as Review[]
      } catch (err) {
        console.warn("Supabase getReviews failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.getReviews()
  }

  static async addReview(review: Omit<Review, "id" | "created_at">): Promise<Review> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("reviews")
          .insert(review)
          .select()
          .single()

        if (error) throw error
        return data as Review
      } catch (err) {
        console.warn("Supabase addReview failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.addReview(review)
  }

  // -------------------------------------------------------------
  // Barbershop Profile & Promotions & Loyalty
  // -------------------------------------------------------------
  static async updateBarbershop(id: string, updates: Partial<Barbershop>): Promise<Barbershop | undefined> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("barbershops")
          .update(updates)
          .eq("id", id)
          .select()
          .single()

        if (error) throw error
        return data as Barbershop
      } catch (err) {
        console.warn("Supabase updateBarbershop failed, falling back to mock data.", err)
      }
    }
    // Fallback to local mock state
    Object.assign(mockBarbershop, updates)
    return mockBarbershop
  }

  static async getPromotions(): Promise<Promotion[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("promotions")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        return data as Promotion[]
      } catch (err) {
        console.warn("Supabase getPromotions failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.promotions
  }

  static async addPromotion(promo: Omit<Promotion, "id" | "created_at">): Promise<Promotion> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("promotions")
          .insert(promo)
          .select()
          .single()

        if (error) throw error
        return data as Promotion
      } catch (err) {
        console.warn("Supabase addPromotion failed, falling back to mock data.", err)
      }
    }
    const newPromo: Promotion = {
      ...promo,
      id: `promo-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    MockDatabase.promotions.unshift(newPromo)
    return newPromo
  }

  static async updatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion | undefined> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("promotions")
          .update(updates)
          .eq("id", id)
          .select()
          .single()

        if (error) throw error
        return data as Promotion
      } catch (err) {
        console.warn("Supabase updatePromotion failed, falling back to mock data.", err)
      }
    }
    MockDatabase.promotions = MockDatabase.promotions.map(p => p.id === id ? { ...p, ...updates } : p)
    return MockDatabase.promotions.find(p => p.id === id)
  }

  static async deletePromotion(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { error } = await supabase
          .from("promotions")
          .delete()
          .eq("id", id)

        if (error) throw error
        return true
      } catch (err) {
        console.warn("Supabase deletePromotion failed, falling back to mock data.", err)
      }
    }
    MockDatabase.promotions = MockDatabase.promotions.filter(p => p.id !== id)
    return true
  }
}
