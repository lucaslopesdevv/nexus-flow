import { prisma } from '../config/database'
import type { Task, CreateTask, UpdateTask } from '../schemas/task.schema'
import { AppError } from '../middleware/errorHandler'

export class TaskService {
  async findAll(): Promise<Task[]> {
    const tasks = await prisma.task.findMany()
    return tasks.map(task => ({
      ...task,
      status: task.status as Task['status'],
      priority: task.priority as Task['priority'],
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      dueDate: task.dueDate?.toISOString(),
      description: task.description || undefined
    }))
  }

  async findById(id: string): Promise<Task> {
    const task = await prisma.task.findUnique({
      where: { id }
    })
    if (!task) {
      throw new AppError(404, 'Task not found', 'TASK_NOT_FOUND')
    }
    return {
      ...task,
      status: task.status as Task['status'],
      priority: task.priority as Task['priority'],
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      dueDate: task.dueDate?.toISOString(),
      description: task.description || undefined
    }
  }

  async create(data: CreateTask): Promise<Task> {
    const task = await prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null
      }
    })
    return {
      ...task,
      status: task.status as Task['status'],
      priority: task.priority as Task['priority'],
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      dueDate: task.dueDate?.toISOString(),
      description: task.description || undefined
    }
  }

  async update(id: string, data: UpdateTask): Promise<Task> {
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined
      }
    })
    return {
      ...task,
      status: task.status as Task['status'],
      priority: task.priority as Task['priority'],
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      dueDate: task.dueDate?.toISOString(),
      description: task.description || undefined
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.task.delete({
      where: { id }
    })
  }
} 