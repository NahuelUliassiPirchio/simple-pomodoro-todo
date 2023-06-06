'use client'

import { useRef } from 'react'
import { Button, Form, Row } from 'react-bootstrap'
import { addData } from '@/services/dbService'
import { useAuthContext } from '@/contexts/authContext'
import { useDataContext } from '@/contexts/dataContext'

export default function NewTodo () {
  const noteRef = useRef()

  const { user } = useAuthContext()
  const { updateData } = useDataContext()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      return
    }

    try {
      const newNote = {
        text: noteRef.current.value,
        completed: false
      }

      const newNoteDocument = await addData(`users/${user.uid}/todos`, newNote)
      newNote.id = newNoteDocument.id
      updateData(newNote)

      noteRef.current.value = ''
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form className='container mt-3 mb-3'>
      <Row>
        <Form.Control type='text' autoCapitalize='on' className='form-control me-3 col col-lg-11"' placeholder='Todo' ref={noteRef} />
        <Button variant='primary' className='col col-lg-1' type='submit' onClick={handleSubmit}>
          Submit
        </Button>
      </Row>
    </Form>

  )
}
