import { AppError } from '@/middleware/errorHandler'
import { prisma } from '@/config/database'
import { TaskPriority, TaskStatus } from '@prisma/client'

export class TaskService {
  async findAll() {
    try {
      return await prisma.task.findMany({
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      console.error('Error in findAll:', error)
      throw new AppError(500, 'Failed to fetch tasks', 'FETCH_ERROR')
    }
  }

  async findById(id: string) {
    try {
      const task = await prisma.task.findUnique({
        where: { id }
      })
      if (!task) {
        throw new AppError(404, 'Task not found', 'NOT_FOUND')
      }
      return task
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in findById:', error)
      throw new AppError(500, 'Failed to fetch task', 'FETCH_ERROR')
    }
  }

  async create(data: {
    title: string
    description?: string
    dueDate?: string
    priority: TaskPriority
    status: TaskStatus
  }) {
    try {
      return await prisma.task.create({
        data: {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined
        }
      })
    } catch (error) {
      console.error('Error in create:', error)
      throw new AppError(500, 'Failed to create task', 'CREATE_ERROR')
    }
  }

  async update(id: string, data: {
    title?: string
    description?: string
    dueDate?: string
    priority?: TaskPriority
    status?: TaskStatus
  }) {
    try {
      await this.findById(id)
      return await prisma.task.update({
        where: { id },
        data: {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined
        }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in update:', error)
      throw new AppError(500, 'Failed to update task', 'UPDATE_ERROR')
    }
  }

  async delete(id: string) {
    try {
      await this.findById(id)
      await prisma.task.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in delete:', error)
      throw new AppError(500, 'Failed to delete task', 'DELETE_ERROR')
    }
  }
} 