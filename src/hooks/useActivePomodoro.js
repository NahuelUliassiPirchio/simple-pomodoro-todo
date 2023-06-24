import React from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { setData, updateData } from '@/services/dbService'
import { useActivePomodoroTodoStore } from '@/stores/globalStore'
import { increment } from 'firebase/firestore/lite'

export default function useActivePomodoro () {
  const activePomodoroGlobal = useActivePomodoroTodoStore(state => state.activePomodoroTodo)
  const setActivePomodoro = useActivePomodoroTodoStore(state => state.updateActivePomodoroTodo)

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const { user } = useAuthContext()

  const updateActivePomodoro = async (activePomodoro, updateFunction) => {
    setLoading(true)
    try {
      await updateFunction()
      setActivePomodoro(activePomodoro)
    } catch (error) {
      setError(error)
    }
    setLoading(false)
  }

  const removeActivePomodoro = () => updateActivePomodoro(null, () => setData(`/users/${user.uid}/todos`, 'activePomodoro', null))

  const createActivePomodoro = (todo) => {
    const initialData = {
      text: todo.id,
      completed: false,
      crucial: false
    }
    return updateActivePomodoro(todo, async () => {
      await setData(`/users/${user.uid}/todos`, 'activePomodoro', initialData, true)
    })
  }

  const editActivePomodoro = (todo) => updateActivePomodoro(todo, async () => {
    await updateData(`/users/${user.uid}/todos`, todo.id, todo)
  })

  const increaseDailyPomodoro = async () => {
    const todayString = new Date().toDateString()

    try {
      await setData(`/users/${user.uid}/dailyPomodoros`, todayString,
        { pomodoros: increment(1) },
        true)
    } catch (error) {
      setError(error)
    }
  }

  return {
    activePomodoro: activePomodoroGlobal,
    loading,
    error,
    createActivePomodoro,
    editActivePomodoro,
    removeActivePomodoro,
    increaseDailyPomodoro
  }
}
