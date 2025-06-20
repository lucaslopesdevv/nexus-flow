import { create } from 'zustand'
import { financeApi } from '../lib/api'
import type { Finance, CreateFinance, UpdateFinance } from '../lib/schemas'
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

export type Transaction = Finance

interface FinanceStore {
  transactions: Finance[]
  filteredTransactions: Finance[]
  searchQuery: string
  isLoading: boolean
  error: string | null
  fetchTransactions: () => Promise<void>
  createTransaction: (data: CreateFinance) => Promise<void>
  updateTransaction: (id: string, data: UpdateFinance) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  getBalance: () => number
  getIncomeTotal: () => number
  getExpenseTotal: () => number
  setSearchQuery: (query: string) => void
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  transactions: [],
  filteredTransactions: [],
  searchQuery: '',
  isLoading: false,
  error: null,

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
      const transactions = await financeApi.getAll()
      set({ transactions, filteredTransactions: transactions, isLoading: false })
      // Check for notifications after fetching transactions
      useNotificationStore.getState().checkFinanceNotifications(transactions)
    } catch (error: any) {
      console.error('Error fetching transactions:', error)
      set({ 
        error: 'Failed to fetch transactions', 
        isLoading: false,
        transactions: []
      })
    }
  },

  createTransaction: async (data) => {
    try {
      set({ isLoading: true, error: null })
      const newTransaction = await financeApi.create(data)
      set((state) => {
        const transactions = [...state.transactions, newTransaction]
        return {
          transactions,
          filteredTransactions: state.searchQuery ? state.filteredTransactions : transactions,
          isLoading: false,
        }
      })
      // Check for notifications after adding a transaction
      useNotificationStore.getState().checkFinanceNotifications(get().transactions)
    } catch (error: any) {
      console.error('Error creating transaction:', error)
      set({ error: 'Failed to create transaction', isLoading: false })
      throw error
    }
  },

  updateTransaction: async (id, data) => {
    try {
      set({ isLoading: true, error: null })
      const updatedTransaction = await financeApi.update(id, data)
      set((state) => {
        const transactions = state.transactions.map((t) => 
          t.id === id ? updatedTransaction : t
        )
        const filteredTransactions = state.filteredTransactions.map((t) =>
          t.id === id ? updatedTransaction : t
        )
        return { transactions, filteredTransactions, isLoading: false }
      })
      // Check for notifications after updating a transaction
      useNotificationStore.getState().checkFinanceNotifications(get().transactions)
    } catch (error: any) {
      console.error('Error updating transaction:', error)
      set({ error: 'Failed to update transaction', isLoading: false })
      throw error
    }
  },

  deleteTransaction: async (id) => {
    try {
      set({ isLoading: true, error: null })
      await financeApi.delete(id)
      set((state) => {
        const transactions = state.transactions.filter((t) => t.id !== id)
        const filteredTransactions = state.filteredTransactions.filter((t) => t.id !== id)
        return { transactions, filteredTransactions, isLoading: false }
      })
      // Check for notifications after deleting a transaction
      useNotificationStore.getState().checkFinanceNotifications(get().transactions)
    } catch (error: any) {
      console.error('Error deleting transaction:', error)
      set({ error: 'Failed to delete transaction', isLoading: false })
      throw error
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