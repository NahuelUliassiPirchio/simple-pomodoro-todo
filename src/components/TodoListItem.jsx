'use client'

import { deleteData, updateData } from '@/services/dbService'
import { reload } from 'firebase/auth'
import { useEffect, useId, useState } from 'react'
import { Button, Form, ListGroupItem } from 'react-bootstrap'

export default function TodoListItem ({ todo }) { // TODO: apply reducer pattern
  const [checked, setChecked] = useState(todo.completed)
  const [showEdit, setShowEdit] = useState(false)
  const checkboxId = useId()
  // TODO: better styling
  // TODO: apply custom hook
  const handleDelete = async () => {
    try {
      await deleteData('todos', todo.id)
      window.location.href = '/'
    } catch (error) {
      alert(error.message)
    }
  }

  const handleEdit = async (e) => {
    if (e.key !== 'Enter') return
    todo.text = e.target.value

    setShowEdit(false)
  }

  useEffect(() => {
    const updateTodo = async () => {
      try {
        const response = await updateData('todos', todo.id, {
          text: todo.text,
          completed: checked
        })
        console.log(response)
      } catch (error) {
        alert(error.message)
        console.log('error' + error)
      }
    }
    updateTodo()
  }, [checked, todo.id, todo.text])

  return (
    <ListGroupItem>
      <div className='mb-3'>
        <Form.Check type='checkbox' id={checkboxId}>
          <Form.Check.Input type='checkbox' isValid checked={checked} onChange={() => setChecked(!checked)} />
          {
            showEdit
              ? <Form.Control type='text' defaultValue={todo.text} onKeyDown={handleEdit} />

              : <Form.Check.Label className={checked && 'text-decoration-line-through'}>{todo.text}</Form.Check.Label>
          }
          <Form.Control.Feedback type='valid'>
            {checked && 'You did it!'}
          </Form.Control.Feedback>
        </Form.Check>
        <Button variant='danger' className='float-end' onClick={handleDelete}>Delete</Button>
        <Button variant='primary' className='float-end me-2' onClick={() => setShowEdit(true)}>Edit</Button>
      </div>
    </ListGroupItem>
  )
}
