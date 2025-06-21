import { create } from "zustand";
import { FocusAPI } from "../lib/api";
import type { Focus, CreateFocus, UpdateFocus, FocusSession, FocusStats, CreateFocusSession, UpdateFocusSession, FocusPreset, CreateFocusPreset, UpdateFocusPreset } from '../lib/schemas';
import { useNotificationStore } from './useNotificationStore';
import { format } from 'date-fns';

interface FocusStore {
  sessions: FocusSession[]
  presets: FocusPreset[]
  isLoading: boolean
  error: string | null
  isActive: boolean
  timeLeft: number
  currentSession: FocusSession | null
  currentFocus: Focus | null
  focusHistory: Focus[]
  checkInterval?: number
  stats: FocusStats | null
  fetchSessions: () => Promise<void>
  fetchPresets: () => Promise<void>
  addSession: (session: CreateFocus) => Promise<void>
  updateSession: (id: string, session: UpdateFocusSession) => Promise<void>
  deleteSession: (id: string) => Promise<void>
  addPreset: (preset: CreateFocusPreset) => Promise<void>
  updatePreset: (id: string, updates: UpdateFocusPreset) => Promise<void>
  deletePreset: (id: string) => Promise<void>
  startSession: (duration: number, type: "focus" | "break") => void
  pauseSession: () => void
  resumeSession: () => void
  stopSession: () => void
  tick: () => void
  startFocus: (focus: Omit<Focus, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) => Promise<void>
  completeFocus: () => Promise<void>
  fetchHistory: () => Promise<void>
  createSession: (session: CreateFocusSession) => Promise<void>
  completeSession: (id: string) => Promise<void>
  fetchStats: (startDate: Date, endDate: Date) => Promise<void>
  createPreset: (preset: CreateFocusPreset) => Promise<void>
  setCurrentSession: (session: FocusSession | null) => void
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
  stats: null,

  fetchSessions: async () => {
    try {
      set({ isLoading: true, error: null });
      const sessions = await FocusAPI.getAll();
      set({ sessions, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch focus sessions";
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchPresets: async () => {
    try {
      set({ isLoading: true, error: null });
      const presets = await FocusAPI.getAllPresets();
      set({ presets, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch presets";
      set({ error: errorMessage, isLoading: false });
    }
  },

  addSession: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const newSession = await FocusAPI.create({
        ...data,
        startTime: format(data.startTime, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
      });
      set((state) => ({
        sessions: [...state.sessions, newSession],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create focus session";
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateSession: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const updatedSession = await FocusAPI.update(id, data);
      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === id ? updatedSession : session
        ),
        currentSession: state.currentSession?.id === id ? updatedSession : state.currentSession,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update focus session";
      set({ error: errorMessage, isLoading: false });
    }
  },

  deleteSession: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await FocusAPI.delete(id);
      set((state) => ({
        sessions: state.sessions.filter((session) => session.id !== id),
        currentSession: state.currentSession?.id === id ? null : state.currentSession,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete focus session";
      set({ error: errorMessage, isLoading: false });
    }
  },

  addPreset: async (presetData) => {
    try {
      set({ isLoading: true, error: null });
      const newPreset = await FocusAPI.createPreset(presetData);
      set((state) => ({
        presets: [...state.presets, newPreset],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add preset";
      set({ error: errorMessage, isLoading: false });
    }
  },

  updatePreset: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const updatedPreset = await FocusAPI.updatePreset(id, updates);
      set((state) => ({
        presets: state.presets.map((preset) =>
          preset.id === id ? updatedPreset : preset
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update preset";
      set({ error: errorMessage, isLoading: false });
    }
  },

  deletePreset: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await FocusAPI.deletePreset(id);
      set((state) => ({
        presets: state.presets.filter((preset) => preset.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete preset";
      set({ error: errorMessage, isLoading: false });
    }
  },

  startSession: (duration: number, type: "focus" | "break") => {
    const startTime = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    const data: CreateFocusSession = {
      duration,
      type,
      startTime,
    };
    get().createSession(data);
  },

  pauseSession: () => {
    set({ isActive: false });
  },

  resumeSession: () => {
    set({ isActive: true });
  },

  stopSession: () => {
    set({
      isActive: false,
      timeLeft: 0,
      currentSession: null,
    });
  },

  tick: () => {
    const { timeLeft, isActive } = get();
    if (isActive && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    }
  },

  startFocus: async (focus) => {
    try {
      set({ isLoading: true, error: null });
      const newFocus = await FocusAPI.create(focus);
      set((state) => ({
        currentFocus: newFocus,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to start focus";
      set({ error: errorMessage, isLoading: false });
    }
  },

  completeFocus: async () => {
    const { currentFocus } = get();
    if (!currentFocus) return;
    try {
      set({ isLoading: true, error: null });
      await FocusAPI.complete(currentFocus.id);
      set({ currentFocus: null, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to complete focus";
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchHistory: async () => {
    try {
      set({ isLoading: true, error: null });
      const history = await FocusAPI.getAll();
      set((state) => ({
        ...state,
        focusHistory: history,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch focus history";
      set({ error: errorMessage, isLoading: false });
    }
  },

  createSession: async (session: CreateFocusSession) => {
    try {
      set({ isLoading: true, error: null });
      const newSession = await FocusAPI.create(session);
      set((state) => ({
        sessions: [newSession, ...state.sessions],
        currentSession: newSession,
        isActive: true,
        timeLeft: newSession.duration * 60,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create session";
      set({ error: errorMessage, isLoading: false });
    }
  },

  completeSession: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const completedSession = await FocusAPI.complete(id);
      set((state) => ({
        sessions: state.sessions.map(session => 
          session.id === id ? completedSession : session
        ),
        currentSession: null,
        isActive: false,
        timeLeft: 0,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to complete session";
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchStats: async (startDate, endDate) => {
    try {
      set({ isLoading: true, error: null });
      const stats = await FocusAPI.getStats(startDate, endDate);
      set({ stats, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch stats";
      set({ error: errorMessage, isLoading: false });
    }
  },

  createPreset: async (preset) => {
    try {
      set({ isLoading: true, error: null });
      const newPreset = await FocusAPI.createPreset(preset);
      set((state) => ({
        presets: [...state.presets, newPreset],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create preset";
      set({ error: errorMessage, isLoading: false });
    }
  },

  setCurrentSession: (session) => {
    set({ currentSession: session });
  },
}));
