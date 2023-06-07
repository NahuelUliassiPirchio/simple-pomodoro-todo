'use client'

import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import { getData } from '@/services/dbService'
import TodoListItem from './TodoListItem'
import { useAuthContext } from '@/contexts/authContext'
import { useDataContext } from '@/contexts/dataContext'

export default function TodoList () {
  const [todos, setTodos] = useState([])
  const [error, setError] = useState(null)
  const { user, loading } = useAuthContext()
  const { data } = useDataContext()

  useEffect(() => {
    if (!user || loading) {
      return
    }

    getData(`users/${user.uid}/todos`, user.uid)
      .then(data => {
        // order by createDate
        // data.sort((a, b) => a.createDate - b.createDate)

        // order by completed
        // data.sort((a, b) => {
        //   if (a.completed && !b.completed) {
        //     return 1
        //   }
        //   if (!a.completed && b.completed) {
        //     return -1
        //   }
        //   return 0
        // })
        setTodos(data)
      })
      .catch(error => {
        setError(error)
      })
  }, [loading, user])

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
