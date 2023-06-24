'use client'

import { useRef, useState } from 'react'
import { Alert, Button, Form, Row, Spinner } from 'react-bootstrap'
import { addData } from '@/services/dbService'
import { useAuthContext } from '@/contexts/AuthContext'
import { useGlobalStore, useSignInStore } from '@/stores/globalStore'

export default function NewTodo () {
  const todoRef = useRef()

  const { user, loading } = useAuthContext()
  const { setNewTodo } = useGlobalStore()
  const [error, setError] = useState(null)
  const { setShowSignInModal } = useSignInStore()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading || !todoRef.current.value) return

    if (!user) return setShowSignInModal(true)

    setError(false)

    try {
      const newTodo = {
        text: todoRef.current.value,
        completed: false,
        crucial: false
      }

      const newTtodoDocuent = await addData(`users/${user.uid}/todos`, newTodo)
      newTodo.id = newTtodoDocuent.id
      setNewTodo(newTodo)

      todoRef.current.value = ''
    } catch (error) {
      setError('There was an error creating the todo item, please try again.')
    }
  }

  return (
    <Form className='container mt-3 mb-3'>
      <Row>
        <Form.Control type='text' className='form-control me-3 col col-lg-11"' placeholder='Todo' ref={todoRef} />
        <Button variant='primary' className='col col-lg-1' type='submit' onClick={handleSubmit}>
          {
            loading
              ? (
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
                )
              : (
                  'Add to-do'
                )
          }
        </Button>
      </Row>
      {error && <Alert variant='danger'>{error}</Alert>}
    </Form>
  )
}
