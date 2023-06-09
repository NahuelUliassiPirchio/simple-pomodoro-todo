'use client'

import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'

import { getData } from '@/services/dbService'
import TodoListItem from './TodoListItem'
import { useAuthContext } from '@/contexts/authContext'
import { useDataContext } from '@/contexts/dataContext'
import { useFilterContext } from '@/contexts/filtersContext'

export default function TodoList () {
  const [todos, setTodos] = useState([])
  const [error, setError] = useState(null)

  const { user, loading } = useAuthContext()
  const { data } = useDataContext()
  const { activeFilter } = useFilterContext()

  useEffect(() => {
    if (!user || loading) {
      return
    }

    const getTodos = async () => {
      try {
        const todos = await getData(`users/${user.uid}/todos`, activeFilter)
        setTodos(todos)
      } catch (error) {
        setError(error)
      }
    }

    getTodos()
  }, [loading, user, activeFilter])

  useEffect(() => {
    if (!data) {
      return
    }
    setTodos(prevTodos => {
      const newTodos = new Set([...prevTodos, data])
      return [...newTodos]
    }
    )
  }, [data])

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
