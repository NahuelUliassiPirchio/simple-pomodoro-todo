'use client'

import { useId } from 'react'
import { Button, Form, ListGroupItem } from 'react-bootstrap'
import useTodo from '@/hooks/useTodo'

export default function TodoListItem ({ initialTodo }) {
  const checkboxId = useId()
  const [todo, error, showEdit, handleEdit, handleDelete, handleSave, handleCheck] = useTodo(initialTodo)

  if (!todo) return null

  return (
    <ListGroupItem as='li'>
      <Form.Check type='checkbox' id={checkboxId}>
        <Form.Check.Input type='checkbox' className='cursor-pointer' isValid checked={todo.completed} onChange={handleCheck} />
        {
            showEdit
              ? <Form.Control type='text' defaultValue={todo.text} onKeyDown={handleSave} />

              : <Form.Check.Label className={todo.completed && 'text-decoration-line-through'}>{todo.text}</Form.Check.Label>
          }
        <Form.Control.Feedback type='valid'>
          {todo.completed && 'You did it!'}
        </Form.Control.Feedback>
      </Form.Check>
      <Button variant='danger' className='float-end' onClick={handleDelete}>Delete</Button>
      <Button variant='primary' className='float-end me-2' onClick={handleEdit}>Edit</Button>
      {error &&
      (
        <div class='alert alert-danger' role='alert'>
          There was an error: {error.message}
        </div>
      )}
    </ListGroupItem>
  )
}
