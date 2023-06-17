'use client'

import { useId, useState } from 'react'
import { Alert, Button, CloseButton, Form, ListGroupItem, Modal } from 'react-bootstrap'
import useTodo from '@/hooks/useTodo'

import crucialIcon from '../../public/icons/crucial.svg'
import crucialActiveIcon from '../../public/icons/crucial-active.svg'
import IconButton from './IconButton'
import { useActivePomodoroTodoStore } from '@/stores/globalStore'
import useActivePomodoro from '@/hooks/useActivePomodoro'

export default function TodoListItem ({ initialTodo, pomodoro = false }) {
  const [todo, error, showEdit, handleEdit, handleDelete, handleSave] = useTodo(initialTodo)

  const { createActivePomodoro, removeActivePomodoro } = useActivePomodoro()

  const checkboxId = useId()
  const setActivePomodoro = useActivePomodoroTodoStore(state => state.updateActivePomodoroTodo)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleCloseModal = () => {
    setShowDeleteModal(false)
  }

  const handleDoubleClick = () => {
    if (todo.completed) return
    handleEdit()
  }

  const handlePomodoro = async () => {
    if (todo.completed) return
    await createActivePomodoro(todo)
  }

  const handleClosePomodoro = async () => {
    await removeActivePomodoro()
    setShowDeleteModal(false)
  }

  if (!todo) return null

  return (
    <ListGroupItem as='li' onDoubleClick={handleDoubleClick}>
      <Form.Check className='d-inline-block' type='checkbox' id={checkboxId}>
        <Form.Check.Input
          type='checkbox' className='cursor-pointer'
          isValid
          checked={todo.completed}
          onChange={() => {
            handleSave({ completed: !todo.completed })
            if (pomodoro) {
              setActivePomodoro(null)
            }
          }}
        />
        {
            showEdit
              ? <Form.Control
                  type='text' autoFocus defaultValue={todo.text}
                  onBlur={handleEdit}
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
        {
          !pomodoro
            ? (
              <>
                <IconButton srcIcon='/icons/pomodoro.svg' handleClick={handlePomodoro} info='Pomodoro this task' />
                <IconButton srcIcon={todo.crucial ? crucialActiveIcon : crucialIcon} info='Make todo crucial' handleClick={() => handleSave({ crucial: !todo.crucial })} />
                <Button variant='primary' onClick={handleEdit} disabled={todo.completed}>Edit</Button>
                <Button variant='danger' className='me-2' onClick={handleDelete}>Delete</Button>
              </>

              )
            : (
              <CloseButton onClick={() => setShowDeleteModal(true)} />
              )

        }
      </div>

      {error &&
      (
        <Alert variant='danger'>
          There was an error: {error.message}
        </Alert>
      )}

      <Modal show={showDeleteModal} onHide={handleCloseModal} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Delete To-do from Pomodoro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Hey! You're going to delete</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant='danger' onClick={handleClosePomodoro}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </ListGroupItem>
  )
}
