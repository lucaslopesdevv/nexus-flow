import { create } from 'zustand'
import { FinanceAPI } from '../lib/api'
import type { Transaction, CreateTransaction, UpdateTransaction, FinanceStats } from '../lib/schemas'
import { useNotificationStore } from './useNotificationStore'

export type TransactionType = 'income' | 'expense'
export type TransactionCategory =
  | 'salary'
  | 'investment'
  | 'other_income'
  | 'food'
  | 'transportation'
  | 'utilities'
  | 'entertainment'
  | 'shopping'
  | 'healthcare'
  | 'other_expense'

interface FinanceStore {
  transactions: Transaction[]
  filteredTransactions: Transaction[]
  searchQuery: string
  stats: FinanceStats | null
  isLoading: boolean
  error: string | null
  fetchTransactions: () => Promise<void>
  createTransaction: (transaction: CreateTransaction) => Promise<void>
  updateTransaction: (id: string, transaction: UpdateTransaction) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  fetchStats: (startDate: Date, endDate: Date) => Promise<void>
  getBalance: () => number
  getIncomeTotal: () => number
  getExpenseTotal: () => number
  setSearchQuery: (query: string) => void
}

const initialState = {
  transactions: [],
  filteredTransactions: [],
  searchQuery: '',
  stats: null,
  isLoading: false,
  error: null,
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  ...initialState,

  setSearchQuery: (query: string) => {
    const searchQuery = query.toLowerCase()
    const transactions = get().transactions
    const filteredTransactions = searchQuery
      ? transactions.filter(
          (transaction) =>
            transaction.description?.toLowerCase().includes(searchQuery) ||
            transaction.category.toLowerCase().includes(searchQuery) ||
            transaction.type.toLowerCase().includes(searchQuery) ||
            transaction.amount.toString().includes(searchQuery)
        )
      : transactions
    set({ searchQuery, filteredTransactions })
  },

  fetchTransactions: async () => {
    try {
      set({ isLoading: true, error: null })
      const transactions = await FinanceAPI.getAll()
      set({ 
        transactions, 
        filteredTransactions: transactions,
        isLoading: false,
        error: null
      })
      // Check for notifications after fetching transactions
      try {
        useNotificationStore.getState().checkFinanceNotifications(transactions)
      } catch (notificationError) {
        console.error('Error checking finance notifications:', notificationError)
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      set({ 
        ...initialState,
        error: `Failed to fetch transactions: ${error.response?.data?.message || error.message}`, 
        isLoading: false,
      })
    }
  },

  createTransaction: async (transaction: CreateTransaction) => {
    try {
      set({ isLoading: true, error: null })
      console.log('Creating transaction:', transaction)
      const newTransaction = await FinanceAPI.create(transaction)
      console.log('Transaction created:', newTransaction)
      set((state) => {
        const transactions = [newTransaction, ...state.transactions]
        return {
          transactions,
          filteredTransactions: state.searchQuery ? state.filteredTransactions : transactions,
          isLoading: false,
          error: null
        }
      })
      // Check for notifications after adding a transaction
      try {
        useNotificationStore.getState().checkFinanceNotifications(get().transactions)
      } catch (notificationError) {
        console.error('Error checking finance notifications:', notificationError)
      }
    } catch (error: any) {
      console.error('Error creating transaction:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      set({ 
        error: `Failed to create transaction: ${error.response?.data?.message || error.message}`, 
        isLoading: false 
      })
      throw error
    }
  },

  updateTransaction: async (id: string, transaction: UpdateTransaction) => {
    try {
      set({ isLoading: true, error: null })
      console.log('Updating transaction:', { id, transaction })
      const updatedTransaction = await FinanceAPI.update(id, transaction)
      console.log('Transaction updated:', updatedTransaction)
      set((state) => {
        const transactions = state.transactions.map((t) => 
          t.id === id ? updatedTransaction : t
        )
        const filteredTransactions = state.filteredTransactions.map((t) =>
          t.id === id ? updatedTransaction : t
        )
        return { transactions, filteredTransactions, isLoading: false, error: null }
      })
      // Check for notifications after updating a transaction
      try {
        useNotificationStore.getState().checkFinanceNotifications(get().transactions)
      } catch (notificationError) {
        console.error('Error checking finance notifications:', notificationError)
      }
    } catch (error: any) {
      console.error('Error updating transaction:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      set({ 
        error: `Failed to update transaction: ${error.response?.data?.message || error.message}`, 
        isLoading: false 
      })
      throw error
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      console.log('Deleting transaction:', id)
      await FinanceAPI.delete(id)
      console.log('Transaction deleted:', id)
      set((state) => {
        const transactions = state.transactions.filter((t) => t.id !== id)
        const filteredTransactions = state.filteredTransactions.filter((t) => t.id !== id)
        return { transactions, filteredTransactions, isLoading: false, error: null }
      })
      // Check for notifications after deleting a transaction
      try {
        useNotificationStore.getState().checkFinanceNotifications(get().transactions)
      } catch (notificationError) {
        console.error('Error checking finance notifications:', notificationError)
      }
    } catch (error: any) {
      console.error('Error deleting transaction:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      set({ 
        error: `Failed to delete transaction: ${error.response?.data?.message || error.message}`, 
        isLoading: false 
      })
      throw error
    }
  },

  fetchStats: async (startDate: Date, endDate: Date) => {
    try {
      set({ isLoading: true, error: null })
      const stats = await FinanceAPI.getStats(startDate, endDate)
      set({ stats, isLoading: false, error: null })
    } catch (error: any) {
      console.error('Error fetching finance stats:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      set({ 
        error: `Failed to fetch finance stats: ${error.response?.data?.message || error.message}`, 
        isLoading: false,
        stats: null
      })
    }
  },

  getBalance: () => {
    const { transactions } = get()
    return transactions.reduce((total, transaction) => {
      const amount = transaction.amount
      return transaction.type === 'income' ? total + amount : total - amount
    }, 0)
  },

  getIncomeTotal: () => {
    const { transactions } = get()
    return transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0)
  },

  getExpenseTotal: () => {
    const { transactions } = get()
    return transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0)
  },
})) 