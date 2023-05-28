'use client'

import { useState } from 'react'
import { Form, ListGroupItem } from 'react-bootstrap'

export default function TodoListItem ({ text, completed }) { // TODO: apply reducer pattern
  const [checked, setChecked] = useState(completed)
  // TODO: better styling

  return (
    <ListGroupItem>
      <div className='mb-3'>
        <Form.Check type='checkbox' id='check-api-checkbox'>
          <Form.Check.Input type='checkbox' isValid checked={checked} onChange={() => setChecked(!checked)} />
          <Form.Check.Label>{text}</Form.Check.Label>
          <Form.Control.Feedback type='valid'>
            {checked && 'You did it!'}
          </Form.Control.Feedback>
        </Form.Check>
      </div>
    </ListGroupItem>
  )
}
