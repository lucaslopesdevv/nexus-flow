import { create } from "zustand";
import { api } from "../lib/api";
import type { Focus, CreateFocus, UpdateFocus } from "../lib/schemas";
import { useNotificationStore } from './useNotificationStore';

export interface FocusSession {
  id: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  completed: boolean;
  createdAt: Date;
}

export interface FocusSessionPreset {
  id: string;
  name: string;
  duration: number; // in minutes
  type: "focus" | "break";
  createdAt: Date;
}

interface FocusStore {
  sessions: Focus[];
  presets: FocusSessionPreset[];
  isLoading: boolean;
  error: string | null;
  isActive: boolean;
  timeLeft: number;
  currentSession: Focus | null;
  currentFocus: Focus | null;
  focusHistory: Focus[];
  checkInterval?: number;
  fetchSessions: () => Promise<void>;
  addSession: (session: CreateFocus) => Promise<void>;
  updateSession: (id: string, data: UpdateFocus) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  addPreset: (preset: Omit<FocusSessionPreset, "id" | "createdAt">) => void;
  updatePreset: (id: string, updates: Partial<FocusSessionPreset>) => void;
  deletePreset: (id: string) => void;
  startSession: (duration: number, type: "focus" | "break") => void;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => void;
  tick: () => void;
  startFocus: (focus: Omit<Focus, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  completeFocus: () => Promise<void>;
  fetchHistory: () => Promise<void>;
}

export const useFocusStore = create<FocusStore>((set, get) => ({
  sessions: [],
  presets: [],
  isLoading: false,
  error: null,
  isActive: false,
  timeLeft: 0,
  currentSession: null,
  currentFocus: null,
  focusHistory: [],
  checkInterval: undefined,

  fetchSessions: async () => {
    try {
      set({ isLoading: true, error: null });
      const sessions = await api.getAll();
      set({ sessions, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch focus sessions", isLoading: false });
      console.error("Error fetching focus sessions:", error);
    }
  },

  addSession: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const newSession = await api.create(data);
      set((state) => ({
        sessions: [...state.sessions, newSession],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to create focus session", isLoading: false });
      console.error("Error creating focus session:", error);
    }
  },

  updateSession: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const updatedSession = await api.update(id, data);
      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === id ? updatedSession : session
        ),
        currentSession: state.currentSession?.id === id ? updatedSession : state.currentSession,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update focus session", isLoading: false });
      console.error("Error updating focus session:", error);
    }
  },

  deleteSession: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(id);
      set((state) => ({
        sessions: state.sessions.filter((session) => session.id !== id),
        currentSession: state.currentSession?.id === id ? null : state.currentSession,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete focus session", isLoading: false });
      console.error("Error deleting focus session:", error);
    }
  },

  addPreset: (presetData) => {
    set({ isLoading: true, error: null });
    try {
      const newPreset = {
        ...presetData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      } as FocusSessionPreset;
      set((state) => ({
        presets: [...state.presets, newPreset],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to add preset", isLoading: false });
    }
  },

  updatePreset: (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      set((state) => ({
        presets: state.presets.map((preset) =>
          preset.id === id ? { ...preset, ...updates } : preset
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update preset", isLoading: false });
    }
  },

  deletePreset: (id) => {
    set({ isLoading: true, error: null });
    try {
      set((state) => ({
        presets: state.presets.filter((preset) => preset.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete preset", isLoading: false });
    }
  },

  startSession: (duration: number, type: "focus" | "break") => {
    const startTime = new Date();
    const data: CreateFocus = {
      duration,
      type,
      startTime,
    };
    get().addSession(data);
    set({
      isActive: true,
      timeLeft: duration * 60,
    });
  },

  pauseSession: () => {
    set({ isActive: false });
  },

  resumeSession: () => {
    set({ isActive: true });
  },

  stopSession: () => {
    const { currentSession, timeLeft } = get();
    if (currentSession) {
      get().updateSession(currentSession.id, {
        completed: timeLeft === 0,
      });
    }
    set({
      isActive: false,
      timeLeft: 0,
      currentSession: null,
    });
  },

  tick: () => {
    set((state) => {
      const newTimeLeft = state.timeLeft - 1;
      if (newTimeLeft === 0) {
        get().stopSession();
      }
      return { timeLeft: newTimeLeft };
    });
  },

  startFocus: async (focus) => {
    try {
      const response = await api.post<Focus>('/focus', {
        ...focus,
        completed: false,
        startTime: new Date(),
        endTime: null,
      });
      const newFocus = response.data;
      set({ currentFocus: newFocus });
      // Start checking for notifications
      const checkInterval = window.setInterval(() => {
        const currentFocus = get().currentFocus;
        if (currentFocus) {
          useNotificationStore.getState().checkFocusNotifications(currentFocus);
        }
      }, 30000); // Check every 30 seconds
      // Store the interval ID in the state
      set({ checkInterval });
    } catch (error) {
      console.error('Failed to start focus session:', error);
    }
  },

  completeFocus: async () => {
    try {
      const { currentFocus, checkInterval } = get();
      if (!currentFocus) return;

      const response = await api.patch<Focus>(`/focus/${currentFocus.id}`, {
        completed: true,
        endTime: new Date(),
      });
      const completedFocus = response.data;
      set((state) => ({
        currentFocus: null,
        focusHistory: [completedFocus, ...state.focusHistory],
      }));
      // Clear the notification check interval
      if (checkInterval) {
        window.clearInterval(checkInterval);
        set({ checkInterval: undefined });
      }
    } catch (error) {
      console.error('Failed to complete focus session:', error);
    }
  },

  fetchHistory: async () => {
    try {
      const response = await api.get<Focus[]>('/focus');
      const history = response.data;
      set({ focusHistory: history });
    } catch (error) {
      console.error('Failed to fetch focus history:', error);
    }
  },
}));
