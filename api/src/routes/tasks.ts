import { FastifyInstance } from 'fastify'
import { TaskService } from '../services/task.service'
import { Type } from '@sinclair/typebox'

const taskService = new TaskService()

const TaskSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  title: Type.String({ minLength: 1, maxLength: 100 }),
  description: Type.Optional(Type.String({ maxLength: 500 })),
  status: Type.Union([
    Type.Literal('TODO'),
    Type.Literal('IN_PROGRESS'),
    Type.Literal('DONE')
  ]),
  priority: Type.Union([
    Type.Literal('LOW'),
    Type.Literal('MEDIUM'),
    Type.Literal('HIGH')
  ]),
  dueDate: Type.Optional(Type.String({ format: 'date-time' })),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
})

const CreateTaskSchema = Type.Omit(TaskSchema, ['id', 'createdAt', 'updatedAt'])
const UpdateTaskSchema = Type.Partial(CreateTaskSchema)

export async function taskRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Tasks'],
        response: {
          200: Type.Array(TaskSchema),
        },
      },
    },
    async () => {
      return taskService.findAll()
    }
  )

  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['Tasks'],
        params: Type.Object({
          id: Type.String({ format: 'uuid' }),
        }),
        response: {
          200: TaskSchema,
        },
      },
    },
    async (request) => {
      const { id } = request.params as { id: string }
      return taskService.findById(id)
    }
  )

  fastify.post(
    '/',
    {
      schema: {
        tags: ['Tasks'],
        body: CreateTaskSchema,
        response: {
          201: TaskSchema,
        },
      },
    },
    async (request, reply) => {
      const task = await taskService.create(request.body as any)
      return reply.status(201).send(task)
    }
  )

  fastify.patch(
    '/:id',
    {
      schema: {
        tags: ['Tasks'],
        params: Type.Object({
          id: Type.String({ format: 'uuid' }),
        }),
        body: UpdateTaskSchema,
        response: {
          200: TaskSchema,
        },
      },
    },
    async (request) => {
      const { id } = request.params as { id: string }
      return taskService.update(id, request.body as any)
    }
  )

  fastify.delete(
    '/:id',
    {
      schema: {
        tags: ['Tasks'],
        params: Type.Object({
          id: Type.String({ format: 'uuid' }),
        }),
        response: {
          204: Type.Null(),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      await taskService.delete(id)
      reply.status(204).send()
    }
  )
} 