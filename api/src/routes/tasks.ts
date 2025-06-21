import { FastifyInstance } from 'fastify'
import { Type } from '@sinclair/typebox'
import { TaskService } from '@/services/task.service'
import { TaskPriority, TaskStatus } from '@prisma/client'

const taskService = new TaskService()

const TaskSchema = Type.Object({
  title: Type.String(),
  description: Type.Optional(Type.String()),
  dueDate: Type.Optional(Type.String({ format: 'date-time' })),
  priority: Type.Union([
    Type.Literal('LOW'),
    Type.Literal('MEDIUM'),
    Type.Literal('HIGH')
  ]),
  status: Type.Union([
    Type.Literal('TODO'),
    Type.Literal('IN_PROGRESS'),
    Type.Literal('DONE')
  ])
})

export const taskRoutes = async function(app: FastifyInstance) {
  // Get all tasks
  app.get('/', async () => {
    return await taskService.findAll()
  })

  // Get task by id
  app.get('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      })
    }
  }, async (request) => {
    const { id } = request.params as { id: string }
    return await taskService.findById(id)
  })

  // Create task
  app.post('/', {
    schema: {
      body: TaskSchema
    }
  }, async (request) => {
    const data = request.body as {
      title: string
      description?: string
      dueDate?: string
      priority: TaskPriority
      status: TaskStatus
    }

    return await taskService.create(data)
  })

  // Update task
  app.put('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      body: Type.Partial(TaskSchema)
    }
  }, async (request) => {
    const { id } = request.params as { id: string }
    const data = request.body as Partial<{
      title: string
      description?: string
      dueDate?: string
      priority: TaskPriority
      status: TaskStatus
    }>

    return await taskService.update(id, data)
  })

  // Delete task
  app.delete('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      })
    }
  }, async (request) => {
    const { id } = request.params as { id: string }
    await taskService.delete(id)
    return { success: true }
  })
} 