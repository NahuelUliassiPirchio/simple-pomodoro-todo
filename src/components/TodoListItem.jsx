'use client'

import { useId } from 'react'
import Image from 'next/image'
import { Alert, Button, Form, ListGroupItem } from 'react-bootstrap'
import useTodo from '@/hooks/useTodo'

import crucialIcon from '../../public/icons/crucial.svg'
import crucialActiveIcon from '../../public/icons/crucial-active.svg'

export default function TodoListItem ({ initialTodo }) {
  const checkboxId = useId()
  const [todo, error, showEdit, handleEdit, handleDelete, handleSave] = useTodo(initialTodo)

  const handleDoubleClick = () => {
    handleEdit()
  }

  if (!todo) return null

  return (
    <ListGroupItem as='li' onDoubleClick={handleDoubleClick}>
      <Form.Check className='d-inline-block' type='checkbox' id={checkboxId}>
        <Form.Check.Input
          type='checkbox' className='cursor-pointer'
          isValid
          checked={todo.completed}
          onChange={() => handleSave({ completed: !todo.completed })}
        />
        {
            showEdit
              ? <Form.Control
                  type='text' autoFocus defaultValue={todo.text}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSave({
                        text: e.target.value
                      })
                    }
                  }}
                />

              : <Form.Check.Label className={todo.completed && 'text-decoration-line-through'}>{todo.text}</Form.Check.Label>
          }
        <Form.Control.Feedback type='valid'>
          {todo.completed && 'You did it!'}
        </Form.Control.Feedback>
      </Form.Check>

      <div className='d-flex float-end gap-2 mt-1'>
        <button
          className='align-self-center border-0 bg-transparent cursor-pointer p-0'
          title=''
          onClick={() => handleSave({ crucial: !todo.crucial })}
        >
          <Image
            src={todo.crucial ? crucialActiveIcon : crucialIcon}
            alt='Make todo important'
            width={30}
            height={30}
          />
        </button>
        <Button variant='primary' onClick={handleEdit}>Edit</Button>
        <Button variant='danger' className='me-2' onClick={handleDelete}>Delete</Button>
      </div>

      {error &&
      (
        <Alert variant='danger'>
          There was an error: {error.message}
        </Alert>
      )}
    </ListGroupItem>
  )
}
