import { useEffect, useRef, useState } from 'react'
import { deleteData, updateData } from '@/services/dbService'
import { useAuthContext } from '@/contexts/authContext'

export default function useTodo (initialTodo) {
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

  const handleSave = async (e) => {
    if (e.key !== 'Enter') return
    setTodo({
      ...todo,
      text: e.target.value
    })

    setShowEdit(false)
  }

  const handleEdit = () => {
    setShowEdit(true)
  }

  const handleCheck = () => {
    setTodo({
      ...todo,
      completed: !todo.completed
    })
  }

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const updateTodo = async () => {
      try {
        await updateData(`users/${user.uid}/todos`, todo.id, {
          text: todo.text,
          completed: todo.completed
        })
      } catch (error) {
        setError(error)
      }
    }
    updateTodo()
  }, [todo, user])

  return [todo, error, showEdit, handleEdit, handleDelete, handleSave, handleCheck]
}
