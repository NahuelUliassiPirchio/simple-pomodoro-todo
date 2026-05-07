'use client'

import { useState } from 'react'
import { Badge } from 'react-bootstrap'
import { useProjectsStore } from '@/stores/globalStore'
import useProjectsList from '@/hooks/useProjectsList'
import ConfirmationModal from './ConfirmationModal'

export default function ProjectFilter () {
  const availableProjects = useProjectsStore(state => state.availableProjects)
  const selectedProjects = useProjectsStore(state => state.selectedProjects)
  const toggleProject = useProjectsStore(state => state.toggleProject)
  const clearSelectedProjects = useProjectsStore(state => state.clearSelectedProjects)

  const { deleteProject } = useProjectsList()

  const [hoveredProject, setHoveredProject] = useState(null)
  const [projectToDelete, setProjectToDelete] = useState(null)

  const allSelected = selectedProjects.length === 0

  const handleConfirmDelete = async () => {
    await deleteProject(projectToDelete)
    setProjectToDelete(null)
  }

  if (availableProjects.length === 0) return null

  return (
    <section className='mb-2'>
      <div className='d-flex flex-wrap align-items-center gap-2'>
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
          <div
            key={project.id}
            className='d-inline-flex'
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <Badge
              as='button'
              pill
              bg={selectedProjects.includes(project.name) ? 'primary' : 'secondary'}
              onClick={() => toggleProject(project.name)}
              style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              {project.name}
              <span
                role='button'
                onClick={e => { e.stopPropagation(); setProjectToDelete(project) }}
                title={`Delete ${project.name}`}
                style={{
                  opacity: hoveredProject === project.id ? 1 : 0,
                  transition: 'opacity 0.15s',
                  lineHeight: 1,
                  fontSize: '1em'
                }}
              >
                ×
              </span>
            </Badge>
          </div>
        ))}
      </div>

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
