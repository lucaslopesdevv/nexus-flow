import { create } from 'zustand'
import type { Task, Finance, Focus } from '../lib/schemas'

export type NotificationType = 'info' | 'warning' | 'critical'

export interface Notification {
  id: string
  key: string // Unique key to prevent duplicates
  title: string
  message: string
  type: NotificationType
  timestamp: Date
  read: boolean
  category: 'task' | 'finance' | 'inventory' | 'focus'
  link?: string
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  // Task Notifications
  checkTaskNotifications: (tasks: Task[]) => void
  // Finance Notifications
  checkFinanceNotifications: (transactions: Finance[]) => void
  // Focus Notifications
  checkFocusNotifications: (focus: Focus | null) => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = crypto.randomUUID()
    const existingNotification = get().notifications.find(n => n.key === notification.key)
    
    // If a notification with the same key exists and is unread, don't add a new one
    if (existingNotification && !existingNotification.read) {
      return
    }

    // If a notification with the same key exists and is read, remove it
    if (existingNotification) {
      set((state) => ({
        notifications: state.notifications.filter(n => n.key !== notification.key)
      }))
    }

    set((state) => ({
      notifications: [
        {
          ...notification,
          id,
          timestamp: new Date(),
          read: false,
        },
        ...state.notifications,
      ],
    }))

    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/vite.svg', // Update with your app icon
      })
    }
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }))
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }))
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clearAll: () => {
    set({ notifications: [] })
  },

  checkTaskNotifications: (tasks) => {
    const { addNotification } = get()
    const now = new Date()

    tasks.forEach((task) => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate)
        const timeDiff = dueDate.getTime() - now.getTime()
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

        // Critical: Task is overdue
        if (timeDiff < 0 && task.status !== 'DONE') {
          addNotification({
            key: `task-overdue-${task.id}`,
            title: 'Task Overdue',
            message: `The task "${task.title}" is overdue by ${Math.abs(daysDiff)} days`,
            type: 'critical',
            category: 'task',
            link: '/tasks',
          })
        }
        // Warning: Task is due in 2 days or less
        else if (daysDiff <= 2 && daysDiff > 0 && task.status !== 'DONE') {
          addNotification({
            key: `task-due-soon-${task.id}`,
            title: 'Task Due Soon',
            message: `The task "${task.title}" is due in ${daysDiff} days`,
            type: 'warning',
            category: 'task',
            link: '/tasks',
          })
        }
      }
    })
  },

  checkFinanceNotifications: (transactions) => {
    const { addNotification } = get()
    
    // Calculate total income and expenses for the current month
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const monthKey = `${currentYear}-${currentMonth}`
    
    const currentMonthTransactions = transactions.filter(
      (t) => {
        const date = new Date(t.date)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
      }
    )

    const income = currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenseRatio = expenses / income

    // Critical: Expenses are over 90% of income
    if (expenseRatio > 0.9 && income > 0) {
      addNotification({
        key: `finance-critical-${monthKey}`,
        title: 'Critical Financial Alert',
        message: `Your expenses (${expenses.toFixed(2)}) are ${(expenseRatio * 100).toFixed(0)}% of your income (${income.toFixed(2)})`,
        type: 'critical',
        category: 'finance',
        link: '/finances',
      })
    }
    // Warning: Expenses are over 75% of income
    else if (expenseRatio > 0.75 && income > 0) {
      addNotification({
        key: `finance-warning-${monthKey}`,
        title: 'Financial Warning',
        message: `Your expenses are reaching ${(expenseRatio * 100).toFixed(0)}% of your income`,
        type: 'warning',
        category: 'finance',
        link: '/finances',
      })
    }

    // Info: New large expense
    const largeExpenses = currentMonthTransactions
      .filter((t) => t.type === 'expense' && t.amount > income * 0.1)
      .slice(-1)[0]

    if (largeExpenses) {
      addNotification({
        key: `finance-large-expense-${largeExpenses.id}`,
        title: 'Large Expense Added',
        message: `A large expense of ${largeExpenses.amount.toFixed(2)} was added for ${largeExpenses.category}`,
        type: 'info',
        category: 'finance',
        link: '/finances',
      })
    }
  },

  checkFocusNotifications: (focus) => {
    const { addNotification } = get()

    if (focus && !focus.completed) {
      const startTime = new Date(focus.startTime)
      const now = new Date()
      const elapsed = now.getTime() - startTime.getTime()
      const remainingMinutes = Math.round((focus.duration * 60 * 1000 - elapsed) / (60 * 1000))

      // Warning: 5 minutes remaining
      if (remainingMinutes <= 5 && remainingMinutes > 0) {
        addNotification({
          key: `focus-ending-${focus.id}`,
          title: 'Focus Time Ending Soon',
          message: `Your ${focus.type} session will end in ${remainingMinutes} minutes`,
          type: 'warning',
          category: 'focus',
          link: '/focus',
        })
      }
    }
  },
})) 