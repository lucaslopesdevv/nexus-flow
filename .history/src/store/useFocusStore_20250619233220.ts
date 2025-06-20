import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FocusSession {
  id: string
  duration: number
  startTime: Date
  endTime: Date
  completed: boolean
  createdAt: Date
}

export interface FocusSessionPreset {
  id: string
  name: string
  duration: number // in minutes
  type: 'focus' | 'break'
  createdAt: Date
}

interface FocusStore {
  sessions: FocusSession[]
  presets: FocusSessionPreset[]
  isLoading: boolean
  error: string | null
  isActive: boolean
  timeLeft: number
  currentSession: {
    duration: number
    startTime: Date | null
    type: 'focus' | 'break'
  } | null
  fetchSessions: () => void
  addSession: (session: Omit<FocusSession, 'id' | 'createdAt'>) => void
  addPreset: (preset: Omit<FocusSessionPreset, 'id' | 'createdAt'>) => void
  updatePreset: (id: string, updates: Partial<FocusSessionPreset>) => void
  deletePreset: (id: string) => void
  startSession: (duration: number, type: 'focus' | 'break') => void
  pauseSession: () => void
  resumeSession: () => void
  stopSession: () => void
  tick: () => void
}

export const useFocusStore = create<FocusStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      presets: [],
      isLoading: false,
      error: null,
      isActive: false,
      timeLeft: 0,
      currentSession: null,

      fetchSessions: () => {
        set({ isLoading: true, error: null })
        try {
          // Sessions are automatically loaded from localStorage by persist middleware
          set({ isLoading: false })
        } catch (error) {
          set({ error: 'Failed to fetch focus sessions', isLoading: false })
        }
      },

      addSession: (sessionData) => {
        set({ isLoading: true, error: null })
        try {
          const newSession = {
            ...sessionData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
          } as FocusSession
          set((state) => ({
            sessions: [newSession, ...state.sessions],
            isLoading: false,
          }))
        } catch (error) {
          set({ error: 'Failed to add focus session', isLoading: false })
        }
      },

      addPreset: (presetData) => {
        set({ isLoading: true, error: null })
        try {
          const newPreset = {
            ...presetData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
          } as FocusSessionPreset
          set((state) => ({
            presets: [newPreset, ...state.presets],
            isLoading: false,
          }))
        } catch (error) {
          set({ error: 'Failed to add focus session preset', isLoading: false })
        }
      },

      updatePreset: (id, updates) => {
        set({ isLoading: true, error: null })
        try {
          set((state) => {
            const presets = state.presets.map((preset) =>
              preset.id === id ? { ...preset, ...updates } : preset
            )
            return { presets, isLoading: false }
          })
        } catch (error) {
          set({ error: 'Failed to update focus session preset', isLoading: false })
        }
      },

      deletePreset: (id) => {
        set({ isLoading: true, error: null })
        try {
          set((state) => ({
            presets: state.presets.filter((preset) => preset.id !== id),
            isLoading: false,
          }))
        } catch (error) {
          set({ error: 'Failed to delete focus session preset', isLoading: false })
        }
      },

      startSession: (duration: number, type: 'focus' | 'break') => {
        set({
          isActive: true,
          timeLeft: duration * 60,
          currentSession: {
            duration: duration * 60,
            startTime: new Date(),
            type,
          },
        })
      },

      pauseSession: () => {
        set({ isActive: false })
      },

      resumeSession: () => {
        set({ isActive: true })
      },

      stopSession: () => {
        const { currentSession, timeLeft } = get()
        if (currentSession?.startTime && currentSession.type === 'focus') {
          const endTime = new Date()
          const duration = Math.round(
            (currentSession.duration - timeLeft) / 60
          )
          get().addSession({
            duration,
            startTime: currentSession.startTime,
            endTime,
            completed: timeLeft === 0,
          })
        }
        set({
          isActive: false,
          timeLeft: 0,
          currentSession: null,
        })
      },

      tick: () => {
        const { timeLeft, isActive } = get()
        if (isActive && timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 })
        } else if (isActive && timeLeft === 0) {
          get().stopSession()
        }
      },
    }),
    {
      name: 'focus-store',
    }
  )
)