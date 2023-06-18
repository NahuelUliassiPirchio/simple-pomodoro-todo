'use client'

import { useRef } from 'react'
import { Button, Form, Row, Spinner } from 'react-bootstrap'
import { addData } from '@/services/dbService'
import { useAuthContext } from '@/contexts/authContext'
import { useGlobalStore } from '@/stores/globalStore'

export default function NewTodo () {
  const todoRef = useRef()

  const { user, loading } = useAuthContext()
  const { setNewTodo } = useGlobalStore()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) return // TODO: handle no user logged in

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
      console.log(error)
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
    </Form>

  )
}
