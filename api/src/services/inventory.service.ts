import { AppError } from '../middleware/errorHandler'
import { prisma } from '../config/database'

export class InventoryService {
  async findAll() {
    try {
      return await prisma.inventory.findMany()
    } catch (error) {
      console.error('Error in findAll:', error)
      throw new AppError(500, 'Failed to fetch inventory items', 'FETCH_ERROR')
    }
  }

  async findById(id: string) {
    try {
      const item = await prisma.inventory.findUnique({
        where: { id }
      })
      if (!item) {
        throw new AppError(404, 'Inventory item not found', 'NOT_FOUND')
      }
      return item
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in findById:', error)
      throw new AppError(500, 'Failed to fetch inventory item', 'FETCH_ERROR')
    }
  }

  async create(data: {
    name: string
    description?: string
    quantity: number
    minQuantity: number
    price: number
    category: string
    location: string
  }) {
    try {
      console.log('Creating inventory item with data:', data)
      return await prisma.inventory.create({
        data
      })
    } catch (error) {
      console.error('Error in create:', error)
      throw new AppError(500, 'Failed to create inventory item', 'CREATE_ERROR')
    }
  }

  async update(id: string, data: {
    name?: string
    description?: string
    quantity?: number
    minQuantity?: number
    price?: number
    category?: string
    location?: string
  }) {
    try {
      const item = await this.findById(id)
      
      // Validate quantity cannot be negative
      if (data.quantity !== undefined && data.quantity < 0) {
        throw new AppError(400, 'Quantity cannot be negative', 'VALIDATION_ERROR')
      }

      // Validate price cannot be negative
      if (data.price !== undefined && data.price < 0) {
        throw new AppError(400, 'Price cannot be negative', 'VALIDATION_ERROR')
      }

      // Validate minQuantity cannot be negative
      if (data.minQuantity !== undefined && data.minQuantity < 0) {
        throw new AppError(400, 'Minimum quantity cannot be negative', 'VALIDATION_ERROR')
      }

      // Ensure empty strings are handled properly
      const updatedData = {
        ...data,
        location: data.location === '' ? item.location : data.location ?? item.location,
        category: data.category === '' ? item.category : data.category ?? item.category
      }

      console.log('Updating inventory item:', { id, data: updatedData })
      
      return await prisma.inventory.update({
        where: { id },
        data: updatedData
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in update:', error)
      throw new AppError(500, 'Failed to update inventory item', 'UPDATE_ERROR')
    }
  }

  async delete(id: string) {
    try {
      await this.findById(id)
      await prisma.inventory.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in delete:', error)
      throw new AppError(500, 'Failed to delete inventory item', 'DELETE_ERROR')
    }
  }

  async bulkCreate(data: Array<{
    name: string
    description?: string
    quantity: number
    minQuantity: number
    price: number
    category: string
    location: string
  }>) {
    try {
      console.log('Creating multiple inventory items:', data)
      return await prisma.inventory.createMany({
        data
      })
    } catch (error) {
      console.error('Error in bulkCreate:', error)
      throw new AppError(500, 'Failed to create inventory items', 'BULK_CREATE_ERROR')
    }
  }

  async bulkUpdate(updates: Array<{
    id: string
    data: {
      name?: string
      description?: string
      quantity?: number
      minQuantity?: number
      price?: number
      category?: string
      location?: string
    }
  }>) {
    try {
      // First validate all items exist and data is valid
      await Promise.all(updates.map(async ({ id, data }) => {
        const item = await this.findById(id)
        
        if (data.quantity !== undefined && data.quantity < 0) {
          throw new AppError(400, `Quantity cannot be negative for item ${id}`, 'VALIDATION_ERROR')
        }
        if (data.price !== undefined && data.price < 0) {
          throw new AppError(400, `Price cannot be negative for item ${id}`, 'VALIDATION_ERROR')
        }
        if (data.minQuantity !== undefined && data.minQuantity < 0) {
          throw new AppError(400, `Minimum quantity cannot be negative for item ${id}`, 'VALIDATION_ERROR')
        }

        return { item, data }
      }))

      // Perform all updates in a transaction
      console.log('Updating multiple inventory items:', updates)
      const results = []
      for (const update of updates) {
        const result = await this.update(update.id, update.data)
        results.push(result)
      }
      return results
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in bulkUpdate:', error)
      throw new AppError(500, 'Failed to update inventory items', 'BULK_UPDATE_ERROR')
    }
  }

  async bulkDelete(ids: string[]) {
    try {
      // First validate all items exist
      await Promise.all(ids.map(id => this.findById(id)))

      // Perform all deletes in a transaction
      console.log('Deleting multiple inventory items:', ids)
      return await prisma.inventory.deleteMany({
        where: {
          id: {
            in: ids
          }
        }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in bulkDelete:', error)
      throw new AppError(500, 'Failed to delete inventory items', 'BULK_DELETE_ERROR')
    }
  }
} 