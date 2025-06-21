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
  Task,
  CreateTask,
  UpdateTask,
  Inventory,
  CreateInventory,
  UpdateInventory,
  FocusSession,
  CreateFocusSession,
  UpdateFocusSession,
  FocusStats,
  Transaction,
  CreateTransaction,
  UpdateTransaction,
  FinanceStats,
  FocusPreset,
  CreateFocusPreset,
  UpdateFocusPreset
} from './schemas'

export const api = axios.create({
  baseURL: 'http://localhost:3001/api',
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
export const TaskAPI = {
  getAll: () => api.get<Task[]>('/tasks').then(res => res.data),
  getById: (id: string) => api.get<Task>(`/tasks/${id}`).then(res => res.data),
  create: (task: CreateTask) => api.post<Task>('/tasks', task).then(res => res.data),
  update: (id: string, task: UpdateTask) => api.put<Task>(`/tasks/${id}`, task).then(res => res.data),
  delete: (id: string) => api.delete(`/tasks/${id}`).then(res => res.data)
}

// Inventory API
export const InventoryAPI = {
  getAll: () => api.get<Inventory[]>('/inventory').then(res => res.data),
  getById: (id: string) => api.get<Inventory>(`/inventory/${id}`).then(res => res.data),
  create: (item: CreateInventory) => api.post<Inventory>('/inventory', item).then(res => res.data),
  update: (id: string, item: UpdateInventory) => api.put<Inventory>(`/inventory/${id}`, item).then(res => res.data),
  delete: (id: string) => api.delete(`/inventory/${id}`).then(res => res.data)
}

// Finance API
export const FinanceAPI = {
  getAll: () => api.get<Transaction[]>('/finance').then(res => res.data),
  getById: (id: string) => api.get<Transaction>(`/finance/${id}`).then(res => res.data),
  create: (transaction: CreateTransaction) => api.post<Transaction>('/finance', transaction).then(res => res.data),
  update: (id: string, transaction: UpdateTransaction) => api.put<Transaction>(`/finance/${id}`, transaction).then(res => res.data),
  delete: (id: string) => api.delete(`/finance/${id}`).then(res => res.data),
  getStats: (startDate: Date, endDate: Date) => api.post<FinanceStats>('/finance/stats', {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  }).then(res => res.data)
}

// Focus API
export const FocusAPI = {
  getAll: () => api.get<FocusSession[]>('/focus').then(res => res.data),
  getById: (id: string) => api.get<FocusSession>(`/focus/${id}`).then(res => res.data),
  create: (session: CreateFocusSession) => api.post<FocusSession>('/focus', session).then(res => res.data),
  update: (id: string, session: UpdateFocusSession) => api.put<FocusSession>(`/focus/${id}`, session).then(res => res.data),
  delete: (id: string) => api.delete(`/focus/${id}`).then(res => res.data),
  complete: (id: string) => api.post<FocusSession>(`/focus/${id}/complete`).then(res => res.data),
  getStats: (startDate: Date, endDate: Date) => api.post<FocusStats>('/focus/stats', {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  }).then(res => res.data),
  // Preset methods
  getAllPresets: () => api.get<FocusPreset[]>('/focus/presets').then(res => res.data),
  getPresetById: (id: string) => api.get<FocusPreset>(`/focus/presets/${id}`).then(res => res.data),
  createPreset: (preset: CreateFocusPreset) => api.post<FocusPreset>('/focus/presets', preset).then(res => res.data),
  updatePreset: (id: string, preset: UpdateFocusPreset) => api.put<FocusPreset>(`/focus/presets/${id}`, preset).then(res => res.data),
  deletePreset: (id: string) => api.delete(`/focus/presets/${id}`).then(res => res.data)
} 