import { useAuthContext } from '@/contexts/AuthContext'
import { setData, updateData } from '@/services/dbService'
import { useActivePomodoroTodoStore } from '@/stores/globalStore'
import { increment } from 'firebase/firestore/lite'
import { toast } from 'sonner'

export default function useActivePomodoro () {
  const activePomodoroGlobal = useActivePomodoroTodoStore(state => state.activePomodoroTodo)
  const setActivePomodoro = useActivePomodoroTodoStore(state => state.updateActivePomodoroTodo)

  const { user } = useAuthContext()

  const updateActivePomodoro = async (activePomodoro, updateFunction) => {
    try {
      await updateFunction()
      setActivePomodoro(activePomodoro)
    } catch (error) {
      toast.error('Failed to update pomodoro, please try again.')
    }
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
      toast.error('Failed to save daily pomodoro count.')
    }
  }

  return {
    activePomodoro: activePomodoroGlobal,
    createActivePomodoro,
    editActivePomodoro,
    removeActivePomodoro,
    increaseDailyPomodoro
  }
}
