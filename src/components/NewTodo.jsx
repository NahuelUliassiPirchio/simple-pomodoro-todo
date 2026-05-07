'use client'

import { useRef } from 'react'
import { Button, Form, Row, Spinner } from 'react-bootstrap'
import { toast } from 'sonner'
import { addData } from '@/services/dbService'
import { useAuthContext } from '@/contexts/AuthContext'
import { useGlobalStore, useSignInStore } from '@/stores/globalStore'

export default function NewTodo () {
  const todoRef = useRef()

  const { user, loading } = useAuthContext()
  const { setNewTodo } = useGlobalStore()
  const { setShowSignInModal } = useSignInStore()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading || !todoRef.current.value) return

    if (!user) return setShowSignInModal(true)

    try {
      const newTodo = {
        text: todoRef.current.value,
        completed: false,
        crucial: false
      }

      const newTodoDocument = await addData(`users/${user.uid}/todos`, newTodo)
      newTodo.id = newTodoDocument.id
      setNewTodo(newTodo)

      todoRef.current.value = ''
    } catch (error) {
      toast.error('Failed to create todo, please try again.')
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
                  'Add todo'
                )
          }
        </Button>
      </Row>
    </Form>
  )
}
