import { create } from 'zustand'
import { useLocation } from 'react-router-dom'

interface SearchStore {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
})) 