'use client'

import { useRef, useState } from 'react'
import { Badge, Button, Form } from 'react-bootstrap'
import { useProjectsStore } from '@/stores/globalStore'
import useProjectsList from '@/hooks/useProjectsList'
import ConfirmationModal from './ConfirmationModal'

export default function ProjectFilter () {
  const availableProjects = useProjectsStore(state => state.availableProjects)
  const selectedProjects = useProjectsStore(state => state.selectedProjects)
  const toggleProject = useProjectsStore(state => state.toggleProject)
  const clearSelectedProjects = useProjectsStore(state => state.clearSelectedProjects)

  const { createProject, deleteProject } = useProjectsList()

  const [showInput, setShowInput] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const inputRef = useRef()

  const allSelected = selectedProjects.length === 0

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    const name = inputRef.current?.value
    if (!name?.trim()) return
    const created = await createProject(name)
    if (created) {
      inputRef.current.value = ''
      setShowInput(false)
    }
  }

  const handleConfirmDelete = async () => {
    await deleteProject(projectToDelete)
    setProjectToDelete(null)
  }

  return (
    <section className='mb-2'>
      {availableProjects.length > 0 && (
        <div className='d-flex flex-wrap align-items-center gap-2 mb-2'>
          <Badge
            as='button'
            pill
            bg={allSelected ? 'primary' : 'secondary'}
            onClick={clearSelectedProjects}
            style={{ cursor: 'pointer', border: 'none' }}
          >
            All
          </Badge>

          {availableProjects.map(project => (
            <div key={project.id} className='d-inline-flex align-items-center gap-1'>
              <Badge
                as='button'
                pill
                bg={selectedProjects.includes(project.name) ? 'primary' : 'secondary'}
                onClick={() => toggleProject(project.name)}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                {project.name}
              </Badge>
              <button
                onClick={() => setProjectToDelete(project)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0 2px',
                  cursor: 'pointer',
                  color: 'var(--bs-secondary)',
                  fontSize: '0.8rem',
                  lineHeight: 1
                }}
                title={`Delete ${project.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {showInput
        ? (
          <Form onSubmit={handleCreateSubmit} className='d-inline-flex gap-1'>
            <Form.Control
              ref={inputRef}
              size='sm'
              placeholder='Project name'
              autoFocus
              onKeyDown={e => { if (e.key === 'Escape') setShowInput(false) }}
              style={{ width: 160 }}
            />
            <Button type='submit' size='sm' variant='primary'>Create</Button>
            <Button size='sm' variant='outline-secondary' onClick={() => setShowInput(false)}>✕</Button>
          </Form>
          )
        : (
          <button
            onClick={() => setShowInput(true)}
            className='btn btn-sm btn-outline-secondary'
            style={{ fontSize: '0.78rem' }}
          >
            + New project
          </button>
          )}

      {projectToDelete && (
        <ConfirmationModal
          title='Delete project'
          message={`Delete "${projectToDelete.name}"? Tasks assigned to it will become unassigned.`}
          confirmationMessage='Delete'
          onConfirm={handleConfirmDelete}
          onCancel={() => setProjectToDelete(null)}
        />
      )}
    </section>
  )
}
