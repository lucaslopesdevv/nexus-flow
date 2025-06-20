import axios, { AxiosRequestConfig } from 'axios'
import { z } from 'zod'
import {
  taskSchema,
  createTaskSchema,
  updateTaskSchema,
  inventorySchema,
  createInventorySchema,
  updateInventorySchema,
  financeSchema,
  createFinanceSchema,
  updateFinanceSchema,
  focusSchema,
  createFocusSchema,
  updateFocusSchema,
} from './schemas'

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Task API
export const taskApi = {
  getAll: async () => {
    const response = await api.get('/tasks')
    return taskSchema.array().parse(response.data)
  },

  getById: async (id: string) => {
    const response = await api.get(`/tasks/${id}`)
    return taskSchema.parse(response.data)
  },

  create: async (data: z.infer<typeof createTaskSchema>) => {
    const response = await api.post('/tasks', data)
    return taskSchema.parse(response.data)
  },

  update: async (id: string, data: z.infer<typeof updateTaskSchema>) => {
    const response = await api.patch(`/tasks/${id}`, data)
    return taskSchema.parse(response.data)
  },

  delete: async (id: string) => {
    await api.delete(`/tasks/${id}`)
  },
}

// Inventory API
export const inventoryApi = {
  getAll: async () => {
    const response = await api.get('/inventory')
    return inventorySchema.array().parse(response.data)
  },

  getById: async (id: string) => {
    const response = await api.get(`/inventory/${id}`)
    return inventorySchema.parse(response.data)
  },

  create: async (data: z.infer<typeof createInventorySchema>) => {
    const response = await api.post('/inventory', data)
    return inventorySchema.parse(response.data)
  },

  update: async (id: string, data: z.infer<typeof updateInventorySchema>) => {
    const response = await api.patch(`/inventory/${id}`, data)
    return inventorySchema.parse(response.data)
  },

  delete: async (id: string) => {
    await api.delete(`/inventory/${id}`)
  },
}

// Finance API
export const financeApi = {
  getAll: async () => {
    const response = await api.get('/finances')
    return financeSchema.array().parse(response.data)
  },

  getById: async (id: string) => {
    const response = await api.get(`/finances/${id}`)
    return financeSchema.parse(response.data)
  },

  create: async (data: z.infer<typeof createFinanceSchema>) => {
    const response = await api.post('/finances', data)
    return financeSchema.parse(response.data)
  },

  update: async (id: string, data: z.infer<typeof updateFinanceSchema>) => {
    const response = await api.patch(`/finances/${id}`, data)
    return financeSchema.parse(response.data)
  },

  delete: async (id: string) => {
    await api.delete(`/finances/${id}`)
  },
}

// Focus API
export const focusApi = {
  getAll: async () => {
    const response = await api.get('/focus')
    return focusSchema.array().parse(response.data)
  },

  getById: async (id: string) => {
    const response = await api.get(`/focus/${id}`)
    return focusSchema.parse(response.data)
  },

  create: async (data: z.infer<typeof createFocusSchema>) => {
    const response = await api.post('/focus', data)
    return focusSchema.parse(response.data)
  },

  update: async (id: string, data: z.infer<typeof updateFocusSchema>) => {
    const response = await api.patch(`/focus/${id}`, data)
    return focusSchema.parse(response.data)
  },

  delete: async (id: string) => {
    await api.delete(`/focus/${id}`)
  },
} 