import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useGlobalStore = create((set) => ({
  newTodo: null,
  setNewTodo: (todo) => set({ newTodo: todo })
}))

export const useFiltersStore = create(
  persist(
    (set) => ({
      filter: 'none',
      updateFilter: (filter) => set({ filter })
    }),
    {
      name: 'filter-storage'
    }
  )
)

export const useTimerStore = create(
  (set) => ({
    isRunning: false,
    updateIsRunning: (isRunning) => set({ isRunning })
  })
)
