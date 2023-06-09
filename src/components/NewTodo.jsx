'use client'

import { useRef } from 'react'
import { Button, Form, Row } from 'react-bootstrap'
import { addData } from '@/services/dbService'
import { useAuthContext } from '@/contexts/authContext'
import { useDataContext } from '@/contexts/dataContext'

export default function NewTodo () {
  const todoRef = useRef()

  const { user } = useAuthContext()
  const { updateData } = useDataContext()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      return
    }

    try {
      const newTtodo = {
        text: todoRef.current.value,
        completed: false,
        crucial: false
      }

      const newTtodoDocument = await addData(`users/${user.uid}/todos`, newTtodo)
      newTtodo.id = newTtodoDocument.id
      updateData(newTtodo)

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
          Submit
        </Button>
      </Row>
    </Form>

  )
}
