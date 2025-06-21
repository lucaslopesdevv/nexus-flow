import { FastifyInstance } from 'fastify'
import { Type } from '@sinclair/typebox'
import { InventoryService } from '@/services/inventory.service'

const inventoryService = new InventoryService()

const InventorySchema = Type.Object({
  name: Type.String(),
  description: Type.Optional(Type.String()),
  quantity: Type.Number(),
  minQuantity: Type.Number(),
  price: Type.Number(),
  category: Type.String(),
  location: Type.String()
})

export const inventoryRoutes = async function(app: FastifyInstance) {
  // Get all inventory items
  app.get('/', async () => {
    return await inventoryService.findAll()
  })

  // Get inventory item by id
  app.get('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      })
    }
  }, async (request) => {
    const { id } = request.params as { id: string }
    return await inventoryService.findById(id)
  })

  // Create inventory item
  app.post('/', {
    schema: {
      body: InventorySchema
    }
  }, async (request) => {
    return await inventoryService.create(request.body as any)
  })

  // Update inventory item
  app.put('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      body: Type.Partial(InventorySchema)
    }
  }, async (request) => {
    const { id } = request.params as { id: string }
    return await inventoryService.update(id, request.body as any)
  })

  // Delete inventory item
  app.delete('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      })
    }
  }, async (request) => {
    const { id } = request.params as { id: string }
    await inventoryService.delete(id)
    return { success: true }
  })

  // Bulk operations
  app.post('/bulk', {
    schema: {
      body: Type.Object({
        items: Type.Array(InventorySchema)
      })
    }
  }, async (request) => {
    const { items } = request.body as { items: any[] }
    return await inventoryService.bulkCreate(items)
  })

  app.put('/bulk', {
    schema: {
      body: Type.Array(Type.Object({
        id: Type.String(),
        data: Type.Partial(InventorySchema)
      }))
    }
  }, async (request) => {
    const updates = request.body as Array<{ id: string, data: any }>
    return await inventoryService.bulkUpdate(updates)
  })

  app.delete('/bulk', {
    schema: {
      body: Type.Object({
        ids: Type.Array(Type.String())
      })
    }
  }, async (request) => {
    const { ids } = request.body as { ids: string[] }
    return await inventoryService.bulkDelete(ids)
  })
} 