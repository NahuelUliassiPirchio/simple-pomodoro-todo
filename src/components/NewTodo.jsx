'use client'

import { useRef, useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { toast } from 'sonner'
import { addData } from '@/services/dbService'
import { useAuthContext } from '@/contexts/AuthContext'
import { useGlobalStore, useProjectsStore, useSignInStore } from '@/stores/globalStore'

const PLACEHOLDERS = [
  'What needs to be done?',
  'Add a new task...',
  "What's on your mind?",
  'e.g. Buy groceries, Call dentist...'
]

export default function NewTodo () {
  const todoRef = useRef()
  const [placeholderIndex, setPlaceholderIndex] = useState(() => Math.floor(Math.random() * PLACEHOLDERS.length))
  const [selectedProject, setSelectedProject] = useState('')
  const [showProjectSelect, setShowProjectSelect] = useState(false)

  const rotatePlaceholder = () => {
    setPlaceholderIndex(i => (i + 1) % PLACEHOLDERS.length)
  }

  const { user, loading } = useAuthContext()
  const { setNewTodo } = useGlobalStore()
  const { setShowSignInModal } = useSignInStore()
  const availableProjects = useProjectsStore(state => state.availableProjects)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading || !todoRef.current.value) return

    if (!user) return setShowSignInModal(true)

    try {
      const newTodo = {
        text: todoRef.current.value,
        completed: false,
        crucial: false,
        project: selectedProject.trim() || null
      }

      const newTodoDocument = await addData(`users/${user.uid}/todos`, newTodo)
      newTodo.id = newTodoDocument.id
      setNewTodo(newTodo)

      todoRef.current.value = ''
      setSelectedProject('')
      setShowProjectSelect(false)
      rotatePlaceholder()
    } catch (error) {
      toast.error('Failed to create todo, please try again.')
    }
  }

  return (
    <Form className='container mt-3 mb-3' onSubmit={handleSubmit}>
      <div className='d-flex gap-2'>
        <Form.Control
          type='text'
          placeholder={PLACEHOLDERS[placeholderIndex]}
          ref={todoRef}
          style={{ flex: 1 }}
          onFocus={() => availableProjects.length > 0 && setShowProjectSelect(true)}
        />
        {showProjectSelect && (
          <Form.Select
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            style={{ width: 180, flexShrink: 0 }}
          >
            <option value=''>No project</option>
            {availableProjects.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </Form.Select>
        )}
        <Button variant='primary' type='submit' style={{ flexShrink: 0 }}>
          {loading
            ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />
            : 'Add'}
        </Button>
      </div>
    </Form>
  )
}
