import { createClient } from "@/lib/supabase"
import { MockDatabase, mockBarbershop } from "@/lib/mock-data"
import { Product, InventoryMovement } from "@/types"

const isSupabaseConfigured = () => {
  return typeof window !== 'undefined'
    ? !!process.env.NEXT_PUBLIC_SUPABASE_URL
    : !!process.env.NEXT_PUBLIC_SUPABASE_URL
}

export class ProductsService {
  static async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("products")
          .select("*, categories(*)")
          .order("name", { ascending: true })

        if (error) throw error
        return data as Product[]
      } catch (err) {
        console.warn("Supabase getProducts failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.getProducts()
  }

  static async addProduct(prod: Omit<Product, "id" | "created_at">): Promise<Product> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("products")
          .insert(prod)
          .select()
          .single()

        if (error) throw error
        return data as Product
      } catch (err) {
        console.warn("Supabase addProduct failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.addProduct(prod)
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("products")
          .update(updates)
          .eq("id", id)
          .select()
          .single()

        if (error) throw error
        return data as Product
      } catch (err) {
        console.warn("Supabase updateProduct failed, falling back to mock data.", err)
      }
    }
    MockDatabase.products = MockDatabase.products.map(p => p.id === id ? { ...p, ...updates } : p)
    return MockDatabase.products.find(p => p.id === id)
  }

  static async logMovement(
    productId: string, 
    quantity: number, 
    type: InventoryMovement["type"], 
    reason: string
  ): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        
        // 1. Get current stock
        const { data: prod } = await supabase
          .from("products")
          .select("stock")
          .eq("id", productId)
          .single()

        const currentStock = prod ? prod.stock : 0
        const newStock = currentStock + quantity

        // 2. Update product stock
        const { error: updateError } = await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", productId)

        if (updateError) throw updateError

        // 3. Log movement
        const { error: moveError } = await supabase
          .from("inventory_movements")
          .insert({
            product_id: productId,
            barbershop_id: mockBarbershop.id,
            type,
            quantity,
            reason
          })

        if (moveError) throw moveError
        return true
      } catch (err) {
        console.warn("Supabase logMovement failed, falling back to mock data.", err)
      }
    }

    // Mock fallback
    await MockDatabase.updateProductStock(productId, quantity, type, reason)
    return true
  }

  static async getInventoryMovements(): Promise<InventoryMovement[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("inventory_movements")
          .select("*, products(*)")
          .order("created_at", { ascending: false })

        if (error) throw error
        return data as InventoryMovement[]
      } catch (err) {
        console.warn("Supabase getInventoryMovements failed, falling back to mock data.", err)
      }
    }
    return MockDatabase.inventoryMovements
  }
}
