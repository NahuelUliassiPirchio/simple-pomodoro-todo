import { useEffect } from 'react'
import { toast } from 'sonner'
import { addData, deleteData, getData } from '@/services/dbService'
import { useAuthContext } from '@/contexts/AuthContext'
import { useProjectsStore } from '@/stores/globalStore'

export default function useProjectsList () {
  const { user, loading } = useAuthContext()
  const availableProjects = useProjectsStore(state => state.availableProjects)
  const setAvailableProjects = useProjectsStore(state => state.setAvailableProjects)
  const removeProjectFromSelected = useProjectsStore(state => state.removeProjectFromSelected)

  useEffect(() => {
    if (!user || loading) return
    const fetch = async () => {
      try {
        const projects = await getData(`users/${user.uid}/projects`)
        setAvailableProjects(projects.sort((a, b) => a.name.localeCompare(b.name)))
      } catch {
        toast.error('Failed to load projects.')
      }
    }
    fetch()
  }, [user, loading, setAvailableProjects])

  const createProject = async (name) => {
    const trimmed = name.trim()
    if (!trimmed) return null
    if (availableProjects.some(p => p.name === trimmed)) {
      toast.error('A project with that name already exists.')
      return null
    }
    try {
      const doc = await addData(`users/${user.uid}/projects`, { name: trimmed })
      const newProject = { id: doc.id, name: trimmed }
      setAvailableProjects(
        [...availableProjects, newProject].sort((a, b) => a.name.localeCompare(b.name))
      )
      return newProject
    } catch {
      toast.error('Failed to create project.')
      return null
    }
  }

  const deleteProject = async (project) => {
    try {
      await deleteData(`users/${user.uid}/projects`, project.id)
      setAvailableProjects(availableProjects.filter(p => p.id !== project.id))
      removeProjectFromSelected(project.name)
    } catch {
      toast.error('Failed to delete project.')
    }
  }

  return { createProject, deleteProject }
}
