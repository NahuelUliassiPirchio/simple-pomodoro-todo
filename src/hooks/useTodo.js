import { useEffect, useRef, useState } from 'react'
import { deleteData, updateData } from '@/services/dbService'
import { useAuthContext } from '@/contexts/authContext'

export default function useTodo (initialTodo, pomodoro) {
  const [todo, setTodo] = useState(initialTodo)
  const [error, setError] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const { user } = useAuthContext()
  const mounted = useRef(false)

  const handleDelete = async () => {
    try {
      await deleteData(`users/${user.uid}/todos`, todo.id)
      setTodo(null)
    } catch (error) {
      setError(error)
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

    const updateTodo = async () => {
      try {
        await updateData(`users/${user.uid}/todos`, todo.id, {
          text: todo.text,
          completed: todo.completed,
          crucial: todo.crucial
        })
      } catch (error) {
        setError(error)
      }
    }
    updateTodo()
  }, [todo, user, initialTodo])

  return [todo, error, showEdit, handleEdit, handleDelete, handleSave]
}
