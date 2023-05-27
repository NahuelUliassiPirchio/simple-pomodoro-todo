import { useState } from 'react'
import { Form } from 'react-bootstrap'

export default function TodoListItem () {
  const [checked, setChecked] = useState(false)
  return (
    <li>
      <div className='mb-3'>
        <Form.Check type='checkbox' id='check-api-checkbox'>
          <Form.Check.Input type='checkbox' isValid checked={checked} onClick={() => setChecked(!checked)} />
          <Form.Check.Label>Custom api checkbox</Form.Check.Label>
          <Form.Control.Feedback type='valid'>
            {checked && 'You did it!'}
          </Form.Control.Feedback>
        </Form.Check>
      </div>

    </li>
  )
}
