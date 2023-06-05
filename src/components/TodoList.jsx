'use client'

import { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { getData } from '@/services/dbService'
import TodoListItem from './TodoListItem'
import { useAuthContext } from '@/contexts/authContext'

export default function TodoList () {
  const [todos, setTodos] = useState([])
  const { user, loading } = useAuthContext()

  useEffect(() => {
    if (!user || loading) {
      return
    }
    const response = getData('todos', user.uid)
    response.then(data => {
      setTodos(data)
    })
  }, [loading, user])

  if (!user && !loading) {
    return (
      <Alert variant='danger'>
        You need to sign in to see your todos
      </Alert>
    )
  }

  return (
    <ul className='list-group'>
      {
        todos &&
        todos.map(todo => <TodoListItem key={todo.id} initialTodo={todo} />)
      }
    </ul>
  )
}
