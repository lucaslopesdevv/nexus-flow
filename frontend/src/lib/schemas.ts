import { z } from 'zod'

// Task Schemas
export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().datetime().optional().transform((val) => val ? new Date(val) : null),
  createdAt: z.string().datetime().transform((val) => new Date(val)),
  updatedAt: z.string().datetime().transform((val) => new Date(val)),
})

export const createTaskSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  dueDate: z.string().datetime().optional(),
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
  date: z.string().datetime().transform((val) => new Date(val)),
  createdAt: z.string().datetime().transform((val) => new Date(val)),
  updatedAt: z.string().datetime().transform((val) => new Date(val)),
})

export const createFinanceSchema = financeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  date: z.date(),
})

export const updateFinanceSchema = createFinanceSchema.partial()

// Focus Schemas
export const focusSchema = z.object({
  id: z.string().uuid(),
  duration: z.number().int().min(1),
  startTime: z.string().datetime().transform((val) => new Date(val)),
  endTime: z.string().datetime().optional().transform((val) => val ? new Date(val) : null),
  type: z.enum(['focus', 'break']),
  completed: z.boolean().default(false),
  createdAt: z.string().datetime().transform((val) => new Date(val)),
  updatedAt: z.string().datetime().transform((val) => new Date(val)),
})

export const createFocusSchema = focusSchema.omit({
  id: true,
  endTime: true,
  completed: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  startTime: z.date(),
})

export const updateFocusSchema = focusSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  startTime: z.date().optional(),
})

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