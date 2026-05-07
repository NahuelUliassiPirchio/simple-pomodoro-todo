'use client'

import { useId, useRef, useState } from 'react'
import { Badge, Button, CloseButton, Form, ListGroupItem } from 'react-bootstrap'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import useTodo from '@/hooks/useTodo'

import IconButton from './IconButton'
import useActivePomodoro from '@/hooks/useActivePomodoro'
import { useGlobalStore, useProjectsStore } from '@/stores/globalStore'
import ConfirmationModal from './ConfirmationModal'
import { DragHandleIcon, PomodoroIcon, CrucialIcon, CrucialActiveIcon } from './Icons'

export default function TodoListItem ({ initialTodo, pomodoro = false, draggable = true, onTodoChange }) {
  const [todo, showEdit, handleEdit, handleDelete, handleSave] = useTodo(initialTodo, pomodoro)

  const { createActivePomodoro, removeActivePomodoro } = useActivePomodoro()
  const { setNewTodo } = useGlobalStore()
  const availableProjects = useProjectsStore(state => state.availableProjects)

  const checkboxId = useId()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isActivePomodo, setIsActivePomodoro] = useState(false)
  const textEditRef = useRef()
  const projectEditRef = useRef()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: initialTodo.id, disabled: !draggable })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1 : 'auto'
  }

  const handleCloseModal = () => setShowDeleteModal(false)

  const handleDoubleClick = () => {
    if (todo.completed) return
    handleEdit()
  }

  const handlePomodoro = async () => {
    if (todo.completed) return
    await createActivePomodoro(todo)
    setIsActivePomodoro(true)
  }

  const handleClosePomodoro = async () => {
    await removeActivePomodoro()
    setShowDeleteModal(false)
    setNewTodo(todo)
  }

  const saveEdit = () => {
    const changes = {
      text: textEditRef.current.value,
      project: projectEditRef.current?.value || null
    }
    handleSave(changes)
    onTodoChange?.({ ...todo, ...changes })
  }

  if (!todo || isActivePomodo) return null

  return (
    <ListGroupItem as='li' ref={setNodeRef} style={style} onDoubleClick={handleDoubleClick} className='d-flex align-items-center gap-2'>
      {!pomodoro && draggable && (
        <span
          {...attributes}
          {...listeners}
          style={{ cursor: isDragging ? 'grabbing' : 'grab', color: 'var(--bs-secondary)', flexShrink: 0 }}
        >
          <DragHandleIcon size={18} />
        </span>
      )}

      <div className='flex-grow-1'>
        <Form.Check className='d-inline-block' type='checkbox' id={checkboxId}>
          <Form.Check.Input
            type='checkbox' className='cursor-pointer'
            isValid
            checked={todo.completed}
            onChange={async () => {
              handleSave({ completed: !todo.completed })
              if (pomodoro) handleClosePomodoro()
            }}
          />
          {showEdit
            ? (
              <Form.Control
                ref={textEditRef}
                type='text'
                autoFocus
                defaultValue={todo.text}
                onKeyDown={e => {
                  if (e.key === 'Enter') saveEdit()
                  if (e.key === 'Escape') handleEdit()
                }}
              />
              )
            : (
              <Form.Check.Label className={todo.completed && 'text-decoration-line-through'}>
                {todo.text}
              </Form.Check.Label>
              )}
          <Form.Control.Feedback type='valid'>
            {todo.completed && 'You did it!'}
          </Form.Control.Feedback>
        </Form.Check>
        {showEdit && (
          <Form.Select
            ref={projectEditRef}
            defaultValue={todo.project || ''}
            size='sm'
            className='mt-1'
          >
            <option value=''>No project</option>
            {availableProjects.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </Form.Select>
        )}
      </div>

      <div className='d-flex gap-2 align-items-center flex-shrink-0'>
        {todo.pomodoros && (
          <span>
            <Badge bg='success'>{`${todo.pomodoros} Pomodoro${todo.pomodoros > 1 ? 's' : ''} completed`}</Badge>
          </span>
        )}
        {!pomodoro
          ? showEdit
            ? (
              <>
                <Button variant='success' size='sm' onClick={saveEdit}>Save</Button>
                <Button variant='secondary' size='sm' className='me-2' onClick={handleEdit}>Cancel</Button>
              </>
              )
            : (
              <>
                <IconButton icon={<PomodoroIcon />} handleClick={handlePomodoro} info='Pomodoro this task' />
                <IconButton icon={todo.crucial ? <CrucialActiveIcon /> : <CrucialIcon />} info='Make todo crucial' handleClick={() => handleSave({ crucial: !todo.crucial })} />
                <Button variant='primary' onClick={handleEdit} disabled={todo.completed}>Edit</Button>
                <Button variant='danger' className='me-2' onClick={handleDelete}>Delete</Button>
              </>
              )
          : (
            <CloseButton onClick={() => setShowDeleteModal(true)} />
            )}
      </div>

      {showDeleteModal && (
        <ConfirmationModal
          title='Delete Todo from Pomodoro?'
          message="Hey! You're going to lose the pomodoro progress. Are you sure?"
          onCancel={handleCloseModal}
          onConfirm={handleClosePomodoro}
          confirmationMessage='Delete'
        />
      )}
    </ListGroupItem>
  )
}
