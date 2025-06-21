import { create } from 'zustand'
import { TaskAPI } from '../lib/api'
import type { Task, CreateTask, UpdateTask } from '../lib/schemas'
import { useNotificationStore } from './useNotificationStore'

interface TaskStore {
  tasks: Task[]
  filteredTasks: Task[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  setSearchQuery: (query: string) => void
  fetchTasks: () => Promise<void>
  createTask: (task: CreateTask) => Promise<void>
  updateTask: (id: string, task: UpdateTask) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  setSearchQuery: (query) => {
    set({ searchQuery: query })
    const tasks = get().tasks
    const filtered = query
      ? tasks.filter(task => 
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description?.toLowerCase().includes(query.toLowerCase())
        )
      : tasks
    set({ filteredTasks: filtered })
  },

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null })
      const tasks = await TaskAPI.getAll()
      set({ 
        tasks, 
        filteredTasks: tasks,
        isLoading: false 
      })
      // Check for notifications after fetching tasks
      useNotificationStore.getState().checkTaskNotifications(tasks)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      set({ error: 'Failed to fetch tasks', isLoading: false })
    }
  },

  createTask: async (task) => {
    try {
      set({ error: null })
      const newTask = await TaskAPI.create(task)
      const updatedTasks = [...get().tasks, newTask]
      set((state) => ({ 
        tasks: updatedTasks,
        filteredTasks: state.searchQuery 
          ? updatedTasks.filter(task => 
              task.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
              task.description?.toLowerCase().includes(state.searchQuery.toLowerCase())
            )
          : updatedTasks
      }))
      // Check for notifications after adding a task
      useNotificationStore.getState().checkTaskNotifications(get().tasks)
    } catch (error) {
      console.error('Failed to add task:', error)
      set({ error: 'Failed to create task' })
      throw error
    }
  },

  updateTask: async (id, task) => {
    try {
      set({ error: null })
      const updatedTask = await TaskAPI.update(id, task)
      const updatedTasks = get().tasks.map((t) => (t.id === id ? updatedTask : t))
      set((state) => ({
        tasks: updatedTasks,
        filteredTasks: state.searchQuery
          ? updatedTasks.filter(task => 
              task.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
              task.description?.toLowerCase().includes(state.searchQuery.toLowerCase())
            )
          : updatedTasks
      }))
      // Check for notifications after updating a task
      useNotificationStore.getState().checkTaskNotifications(get().tasks)
    } catch (error) {
      console.error('Failed to update task:', error)
      set({ error: 'Failed to update task' })
      throw error
    }
  },

  deleteTask: async (id) => {
    try {
      set({ error: null })
      await TaskAPI.delete(id)
      const updatedTasks = get().tasks.filter(t => t.id !== id)
      set((state) => ({ 
        tasks: updatedTasks,
        filteredTasks: state.searchQuery
          ? updatedTasks.filter(task => 
              task.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
              task.description?.toLowerCase().includes(state.searchQuery.toLowerCase())
            )
          : updatedTasks
      }))
      // Check for notifications after deleting a task
      useNotificationStore.getState().checkTaskNotifications(get().tasks)
    } catch (error) {
      console.error('Failed to delete task:', error)
      set({ error: 'Failed to delete task' })
      throw error
    }
  }
}))