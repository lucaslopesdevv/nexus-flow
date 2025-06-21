import { AppError } from '@/middleware/errorHandler'
import { prisma } from '@/config/database'
import { TransactionType, TransactionCategory } from '@prisma/client'

export class FinanceService {
  async findAll() {
    try {
      return await prisma.transaction.findMany({
        orderBy: { date: 'desc' }
      })
    } catch (error) {
      console.error('Error in findAll:', error)
      throw new AppError(500, 'Failed to fetch transactions', 'FETCH_ERROR')
    }
  }

  async findById(id: string) {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id }
      })
      if (!transaction) {
        throw new AppError(404, 'Transaction not found', 'NOT_FOUND')
      }
      return transaction
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in findById:', error)
      throw new AppError(500, 'Failed to fetch transaction', 'FETCH_ERROR')
    }
  }

  async create(data: {
    type: TransactionType
    amount: number
    category: TransactionCategory
    description?: string
    date: string
  }) {
    try {
      return await prisma.transaction.create({
        data: {
          ...data,
          date: new Date(data.date)
        }
      })
    } catch (error) {
      console.error('Error in create:', error)
      throw new AppError(500, 'Failed to create transaction', 'CREATE_ERROR')
    }
  }

  async update(id: string, data: {
    type?: TransactionType
    amount?: number
    category?: TransactionCategory
    description?: string
    date?: string
  }) {
    try {
      await this.findById(id)
      return await prisma.transaction.update({
        where: { id },
        data: {
          ...data,
          date: data.date ? new Date(data.date) : undefined
        }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in update:', error)
      throw new AppError(500, 'Failed to update transaction', 'UPDATE_ERROR')
    }
  }

  async delete(id: string) {
    try {
      await this.findById(id)
      await prisma.transaction.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Error in delete:', error)
      throw new AppError(500, 'Failed to delete transaction', 'DELETE_ERROR')
    }
  }

  async getStats(startDate: Date, endDate: Date) {
    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      })

      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0)

      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0)

      const byCategory = transactions.reduce((acc, curr) => {
        const key = curr.category
        if (!acc[key]) {
          acc[key] = 0
        }
        acc[key] += curr.amount
        return acc
      }, {} as Record<TransactionCategory, number>)

      return {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        byCategory
      }
    } catch (error) {
      console.error('Error in getStats:', error)
      throw new AppError(500, 'Failed to get finance stats', 'FETCH_ERROR')
    }
  }
} 