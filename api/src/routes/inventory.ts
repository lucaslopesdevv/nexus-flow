import { FastifyInstance } from 'fastify'
import { InventoryService } from '../services/inventory.service'
import { z } from 'zod'

const inventorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  quantity: z.number().int().min(0),
  minQuantity: z.number().int().min(0),
  price: z.number().min(0),
  category: z.string().min(1).max(50),
  location: z.string().max(100)
})

export async function inventoryRoutes(app: FastifyInstance) {
  const inventoryService = new InventoryService()

  app.get('/', async () => {
    return await inventoryService.findAll()
  })

  app.get('/:id', async (request) => {
    const { id } = request.params as { id: string }
    return await inventoryService.findById(id)
  })

  app.post('/', async (request, reply) => {
    const data = inventorySchema.parse(request.body)
    const item = await inventoryService.create(data)
    return reply.status(201).send(item)
  })

  app.patch('/:id', async (request) => {
    const { id } = request.params as { id: string }
    const data = inventorySchema.partial().parse(request.body)
    return await inventoryService.update(id, data)
  })

  app.delete('/:id', async (request) => {
    const { id } = request.params as { id: string }
    await inventoryService.delete(id)
    return { success: true }
  })

  // Bulk Operations
  app.post('/bulk', async (request, reply) => {
    const data = z.array(z.object({
      name: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
      quantity: z.number().int().min(0),
      minQuantity: z.number().int().min(0),
      price: z.number().min(0),
      category: z.string().min(1).max(50),
      location: z.string().max(100)
    })).parse(request.body)
    const items = await inventoryService.bulkCreate(data)
    return reply.status(201).send(items)
  })

  app.patch('/bulk', async (request) => {
    const schema = z.array(z.object({
      id: z.string(),
      data: z.object({
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
        quantity: z.number().int().min(0).optional(),
        minQuantity: z.number().int().min(0).optional(),
        price: z.number().min(0).optional(),
        category: z.string().min(1).max(50).optional(),
        location: z.string().max(100).optional()
      })
    }))
    const updates = schema.parse(request.body)
    return await inventoryService.bulkUpdate(updates)
  })

  app.delete('/bulk', async (request) => {
    const schema = z.object({
      ids: z.array(z.string())
    })
    const { ids } = schema.parse(request.body)
    await inventoryService.bulkDelete(ids)
    return { success: true }
  })
} 