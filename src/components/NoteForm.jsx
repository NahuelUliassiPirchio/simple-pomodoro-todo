'use client'

import { useRef } from 'react'
import { Button, Form, Row } from 'react-bootstrap'
import { addData } from '@/services/dbService'

export default function NoteForm () {
  const noteRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('submit')

    try {
      const response = await addData('todos', {
        text: noteRef.current.value,
        completed: false
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form className='container mt-3 mb-3'>
      <Row>
        <Form.Control type='text' className='form-control col col-lg-11"' placeholder='Note' ref={noteRef} />
        <Button variant='primary' className='col col-lg-1' type='submit' onClick={handleSubmit}>
          Submit
        </Button>
      </Row>
    </Form>

  )
}
