import { z } from 'zod'

// Task Schemas
export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createTaskSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateTaskSchema = createTaskSchema.partial()

// Inventory Schemas
export const INVENTORY_CATEGORIES = [
  'electronics',
  'office_supplies',
  'furniture',
  'kitchen',
  'cleaning',
  'tools',
  'storage',
  'safety',
  'other'
] as const;

export type InventoryCategory = typeof INVENTORY_CATEGORIES[number];

export const inventorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  quantity: z.number().int().min(0),
  minQuantity: z.number().int().min(0).default(0),
  price: z.number().min(0),
  category: z.enum(INVENTORY_CATEGORIES),
  location: z.string().max(100),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createInventorySchema = inventorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateInventorySchema = createInventorySchema.partial()

// Finance Schemas
export const financeSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['income', 'expense']),
  amount: z.number().min(0),
  category: z.enum([
    'salary',
    'investment',
    'other_income',
    'food',
    'transportation',
    'utilities',
    'entertainment',
    'shopping',
    'healthcare',
    'other_expense',
  ]),
  description: z.string().max(500).optional(),
  date: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createFinanceSchema = financeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateFinanceSchema = createFinanceSchema.partial()

// Focus Schemas
export const focusSchema = z.object({
  id: z.string().uuid(),
  duration: z.number().int().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  type: z.enum(['focus', 'break']),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const createFocusSchema = z.object({
  duration: z.number().int().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  type: z.enum(['focus', 'break'])
})

export const updateFocusSchema = createFocusSchema.partial()

export const focusPresetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  duration: z.number().int().positive(),
  type: z.enum(['focus', 'break']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const createFocusPresetSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  duration: z.number().int().positive(),
  type: z.enum(['focus', 'break'])
})

export const updateFocusPresetSchema = createFocusPresetSchema.partial()

// Types
export type Task = z.infer<typeof taskSchema>
export type CreateTask = z.infer<typeof createTaskSchema>
export type UpdateTask = z.infer<typeof updateTaskSchema>

export type Inventory = z.infer<typeof inventorySchema>
export type CreateInventory = z.infer<typeof createInventorySchema>
export type UpdateInventory = z.infer<typeof updateInventorySchema>

export type Finance = z.infer<typeof financeSchema>
export type CreateFinance = z.infer<typeof createFinanceSchema>
export type UpdateFinance = z.infer<typeof updateFinanceSchema>

export type Focus = z.infer<typeof focusSchema>
export type CreateFocus = z.infer<typeof createFocusSchema>
export type UpdateFocus = z.infer<typeof updateFocusSchema>
export type FocusPreset = z.infer<typeof focusPresetSchema>
export type CreateFocusPreset = z.infer<typeof createFocusPresetSchema>
export type UpdateFocusPreset = z.infer<typeof updateFocusPresetSchema>

// Focus Time Types
export type FocusType = 'focus' | 'break'

export interface FocusSession {
  id: string
  duration: number
  startTime: string
  endTime?: string
  type: FocusType
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateFocusSession {
  duration: number
  startTime: string
  endTime?: string
  type: FocusType
}

export interface UpdateFocusSession {
  duration?: number
  startTime?: string
  endTime?: string
  type?: FocusType
  completed?: boolean
}

export interface FocusStats {
  totalSessions: number
  totalFocusTime: number
  totalBreakTime: number
  completedSessions: number
}

// Finance Types
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

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: TransactionCategory
  description?: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransaction {
  type: TransactionType
  amount: number
  category: TransactionCategory
  description?: string
  date: string
}

export interface UpdateTransaction {
  type?: TransactionType
  amount?: number
  category?: TransactionCategory
  description?: string
  date?: string
}

export interface FinanceStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  byCategory: Record<TransactionCategory, number>
}

// Constants
export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  'salary',
  'investment',
  'other_income',
  'food',
  'transportation',
  'utilities',
  'entertainment',
  'shopping',
  'healthcare',
  'other_expense'
]

export const FOCUS_TYPES: FocusType[] = ['focus', 'break'] 