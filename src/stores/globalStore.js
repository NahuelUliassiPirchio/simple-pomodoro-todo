import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// TODO: improve this
export const useGlobalStore = create((set) => ({
  newTodo: null,
  setNewTodo: (todo) => set({ newTodo: todo })
}))

export const useWorkedPomsStore = create((set) => ({
  workedPoms: 0,
  setWorkedPoms: (amount) => set({ workedPoms: amount }),
  increaseWorkedPoms: () => set(state => ({ workedPoms: state.workedPoms + 1 }))
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

export const useActivePomodoroTodoStore = create((set) => ({
  activePomodoroTodo: null,
  updateActivePomodoroTodo: (pomodoro) => set({ activePomodoroTodo: pomodoro })
})
)

export const useTimerStore = create(
  (set) => ({
    isRunning: false,
    updateIsRunning: (isRunning) => set({ isRunning })
  })
)
