import { create } from 'zustand'
import { inventoryApi } from '../lib/api'
import type { Inventory, CreateInventory, UpdateInventory } from '../lib/schemas'

interface InventoryStore {
  inventory: Inventory[]
  filteredInventory: Inventory[]
  searchQuery: string
  isLoading: boolean
  error: string | null
  fetchInventory: () => Promise<void>
  createInventory: (data: CreateInventory) => Promise<void>
  updateInventory: (id: string, data: UpdateInventory) => Promise<void>
  deleteInventory: (id: string) => Promise<void>
  setSearchQuery: (query: string) => void
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventory: [],
  filteredInventory: [],
  searchQuery: '',
  isLoading: false,
  error: null,

  setSearchQuery: (query: string) => {
    const searchQuery = query.toLowerCase()
    const inventory = get().inventory
    const filteredInventory = searchQuery
      ? inventory.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery) ||
            item.description?.toLowerCase().includes(searchQuery) ||
            item.category.toLowerCase().includes(searchQuery) ||
            item.location.toLowerCase().includes(searchQuery)
        )
      : inventory
    set({ searchQuery, filteredInventory })
  },

  fetchInventory: async () => {
    try {
      set({ isLoading: true, error: null })
      const inventory = await inventoryApi.getAll()
      set({ inventory, filteredInventory: inventory, isLoading: false })
    } catch (error: any) {
      console.error('Error fetching inventory:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      set({ 
        error: `Failed to fetch inventory: ${error.response?.data?.message || error.message}`,
        isLoading: false,
        inventory: []
      })
    }
  },

  createInventory: async (data) => {
    try {
      set({ isLoading: true, error: null })
      console.log('Creating inventory item:', data)
      const newItem = await inventoryApi.create(data)
      console.log('Item created:', newItem)
      set((state) => {
        const inventory = [...state.inventory, newItem]
        return {
          inventory,
          filteredInventory: state.searchQuery ? state.filteredInventory : inventory,
          isLoading: false,
        }
      })
    } catch (error: any) {
      console.error('Error creating inventory item:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      set({ 
        error: `Failed to create inventory item: ${error.response?.data?.message || error.message}`,
        isLoading: false
      })
      throw error
    }
  },

  updateInventory: async (id, data) => {
    try {
      set({ isLoading: true, error: null })
      console.log('Updating inventory item:', { id, data })
      const updatedItem = await inventoryApi.update(id, data)
      console.log('Item updated:', updatedItem)
      set((state) => {
        const inventory = state.inventory.map((item) => (item.id === id ? updatedItem : item))
        const filteredInventory = state.filteredInventory.map((item) =>
          item.id === id ? updatedItem : item
        )
        return { inventory, filteredInventory, isLoading: false }
      })
    } catch (error: any) {
      console.error('Error updating inventory item:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      set({ 
        error: `Failed to update inventory item: ${error.response?.data?.message || error.message}`,
        isLoading: false
      })
      throw error
    }
  },

  deleteInventory: async (id) => {
    try {
      set({ isLoading: true, error: null })
      console.log('Deleting inventory item:', id)
      await inventoryApi.delete(id)
      console.log('Item deleted:', id)
      set((state) => {
        const inventory = state.inventory.filter((item) => item.id !== id)
        const filteredInventory = state.filteredInventory.filter((item) => item.id !== id)
        return { inventory, filteredInventory, isLoading: false }
      })
    } catch (error: any) {
      console.error('Error deleting inventory item:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      set({ 
        error: `Failed to delete inventory item: ${error.response?.data?.message || error.message}`,
        isLoading: false
      })
      throw error
    }
  },
})) 