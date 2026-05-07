import { useEffect, useRef, useState } from 'react'
import { deleteData, updateData } from '@/services/dbService'
import { useAuthContext } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export default function useTodo (initialTodo, pomodoro) {
  const [todo, setTodo] = useState(initialTodo)
  const [showEdit, setShowEdit] = useState(false)
  const { user } = useAuthContext()
  const mounted = useRef(false)

  const handleDelete = async () => {
    try {
      await deleteData(`users/${user.uid}/todos`, todo.id)
      setTodo(null)
    } catch (error) {
      toast.error('Failed to delete todo, please try again.')
      console.error(error)
    }
  }

  const handleSave = async (todoChanges) => {
    setTodo({
      ...todo,
      ...todoChanges
    })

    setShowEdit(false)
  }

  const handleEdit = () => {
    setShowEdit(!showEdit)
  }

  useEffect(() => {
    if (!mounted.current && pomodoro) {
      mounted.current = true
      return
    }

    setTodo(initialTodo)
  }, [initialTodo, pomodoro])

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }

    if (!todo) return

    const updateTodo = async () => {
      try {
        await updateData(`users/${user.uid}/todos`, todo.id, {
          text: todo.text,
          completed: todo.completed,
          crucial: todo.crucial,
          ...(todo.completed && { completedAt: todo.completedAt || new Date().toISOString() })
        })
      } catch (error) {
        toast.error('Failed to update todo, please try again.')
        console.error(error)
      }
    }
    updateTodo()
  }, [todo, user, initialTodo])

  return [todo, showEdit, handleEdit, handleDelete, handleSave]
}
