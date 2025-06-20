/// <reference types="node" />

declare namespace NodeJS {
  interface Timeout {
    ref(): Timeout
    unref(): Timeout
  }
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  createdAt: string
  updatedAt: string
}

export interface InventoryItem {
  id: string
  name: string
  description?: string
  quantity: number
  minQuantity: number
  unit: string
  price: number
  category: string
  location: string
  createdAt: string
  updatedAt: string
} 