import { AppError } from '@/middleware/errorHandler'
import { prisma } from '@/config/database'
import { FocusType } from '@prisma/client'

export class FocusService {
  async findAll() {
    try {
      return await prisma.focusSession.findMany({
        orderBy: { startTime: 'desc' }
      })
    } catch (error) {
      console.error('Error in findAll:', error)
      throw new AppError(500, 'Failed to fetch focus sessions', 'FETCH_ERROR')
    }
  }

  async findById(id: string) {
    try {
      const session = await prisma.focusSession.findUnique({
        where: { id }
      })
      if (!session) {
        throw new AppError(404, 'Focus session not found', 'NOT_FOUND')
      }
      return session
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in findById:', error)
      throw new AppError(500, 'Failed to fetch focus session', 'FETCH_ERROR')
    }
  }

  async create(data: {
    duration: number
    startTime: string
    endTime?: string
    type: FocusType
  }) {
    try {
      return await prisma.focusSession.create({
        data: {
          ...data,
          startTime: new Date(data.startTime),
          endTime: data.endTime ? new Date(data.endTime) : undefined,
          completed: !!data.endTime
        }
      })
    } catch (error) {
      console.error('Error in create:', error)
      throw new AppError(500, 'Failed to create focus session', 'CREATE_ERROR')
    }
  }

  async update(id: string, data: {
    duration?: number
    startTime?: string
    endTime?: string
    type?: FocusType
    completed?: boolean
  }) {
    try {
      await this.findById(id)
      return await prisma.focusSession.update({
        where: { id },
        data: {
          ...data,
          startTime: data.startTime ? new Date(data.startTime) : undefined,
          endTime: data.endTime ? new Date(data.endTime) : undefined
        }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in update:', error)
      throw new AppError(500, 'Failed to update focus session', 'UPDATE_ERROR')
    }
  }

  async delete(id: string) {
    try {
      await this.findById(id)
      await prisma.focusSession.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in delete:', error)
      throw new AppError(500, 'Failed to delete focus session', 'DELETE_ERROR')
    }
  }

  async completeSession(id: string) {
    try {
      const session = await this.findById(id)
      return await prisma.focusSession.update({
        where: { id },
        data: {
          completed: true,
          endTime: new Date()
        }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in completeSession:', error)
      throw new AppError(500, 'Failed to complete focus session', 'UPDATE_ERROR')
    }
  }

  async getStats(startDate: Date, endDate: Date) {
    try {
      const sessions = await prisma.focusSession.findMany({
        where: {
          startTime: {
            gte: startDate,
            lte: endDate
          },
          completed: true
        }
      })

      const totalFocusTime = sessions
        .filter(s => s.type === 'focus')
        .reduce((acc, curr) => acc + curr.duration, 0)

      const totalBreakTime = sessions
        .filter(s => s.type === 'break')
        .reduce((acc, curr) => acc + curr.duration, 0)

      return {
        totalSessions: sessions.length,
        totalFocusTime,
        totalBreakTime,
        completedSessions: sessions.filter(s => s.completed).length
      }
    } catch (error) {
      console.error('Error in getStats:', error)
      throw new AppError(500, 'Failed to get focus stats', 'FETCH_ERROR')
    }
  }

  async getAllPresets() {
    try {
      return await prisma.focusPreset.findMany({
        orderBy: { name: 'asc' }
      })
    } catch (error) {
      console.error('Error in getAllPresets:', error)
      throw new AppError(500, 'Failed to fetch focus presets', 'FETCH_ERROR')
    }
  }

  async getPresetById(id: string) {
    try {
      const preset = await prisma.focusPreset.findUnique({
        where: { id }
      })
      if (!preset) {
        throw new AppError(404, 'Focus preset not found', 'NOT_FOUND')
      }
      return preset
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in getPresetById:', error)
      throw new AppError(500, 'Failed to fetch focus preset', 'FETCH_ERROR')
    }
  }

  async createPreset(data: {
    name: string
    description?: string
    duration: number
    type: FocusType
  }) {
    try {
      return await prisma.focusPreset.create({
        data
      })
    } catch (error) {
      console.error('Error in createPreset:', error)
      throw new AppError(500, 'Failed to create focus preset', 'CREATE_ERROR')
    }
  }

  async updatePreset(id: string, data: {
    name?: string
    description?: string
    duration?: number
    type?: FocusType
  }) {
    try {
      await this.getPresetById(id)
      return await prisma.focusPreset.update({
        where: { id },
        data
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in updatePreset:', error)
      throw new AppError(500, 'Failed to update focus preset', 'UPDATE_ERROR')
    }
  }

  async deletePreset(id: string) {
    try {
      await this.getPresetById(id)
      await prisma.focusPreset.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in deletePreset:', error)
      throw new AppError(500, 'Failed to delete focus preset', 'DELETE_ERROR')
    }
  }
} 