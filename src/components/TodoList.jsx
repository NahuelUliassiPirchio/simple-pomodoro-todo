'use client'

import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'

import { getData } from '@/services/dbService'
import TodoListItem from './TodoListItem'
import { useAuthContext } from '@/contexts/authContext'
import { useActivePomodoroTodoStore, useFiltersStore, useGlobalStore } from '@/stores/globalStore'

export default function TodoList () {
  const [todos, setTodos] = useState([])
  const [error, setError] = useState(null)

  const { user, loading } = useAuthContext()
  const newTodo = useGlobalStore(state => state.newTodo)
  const filter = useFiltersStore(state => state.filter)

  const setActivePomodoro = useActivePomodoroTodoStore(state => state.updateActivePomodoroTodo)

  useEffect(() => {
    if (!user || loading) {
      return
    }

    const getTodos = async () => {
      try {
        const todos = await getData(`users/${user.uid}/todos`, filter)
        console.log('todos', todos)

        const activePomodoroIndexIndex = todos.findIndex(todo => todo.id === 'activePomodoro')
        if (activePomodoroIndexIndex !== -1) {
          const activePomodoroId = todos.splice(activePomodoroIndexIndex, 1)[0].text
          const activePomodoroIndex = todos.findIndex(todo => todo.id === activePomodoroId)
          const activePomodoro = activePomodoroIndex !== -1 && todos.splice(activePomodoroIndex, 1)[0]
          setActivePomodoro(activePomodoro)
        }

        setTodos(todos)
      } catch (error) {
        setError(error)
      }
    }

    getTodos()
  }, [loading, user, filter])

  useEffect(() => {
    if (!newTodo) {
      return
    }
    setTodos(prevTodos => {
      const newTodos = new Set([...prevTodos, newTodo])
      return [...newTodos]
    }
    )
  }, [newTodo])

  if (!user && !loading) {
    return (
      <Alert variant='danger'>
        You need to sign in to see your todos
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert variant='danger'>
        {error.message}
      </Alert>
    )
  }

  return (
    (todos.length === 0 && !loading)
      ? <Alert variant='info'>You have no todos</Alert>
      : (
        <ul className='list-group'>
          {
        todos &&
        todos.map(todo => <TodoListItem key={todo.id} initialTodo={todo} />)
      }
        </ul>)
  )
}
