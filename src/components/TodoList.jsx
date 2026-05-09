'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'

import { getData, updateData } from '@/services/dbService'
import TodoListItem from './TodoListItem'
import { useAuthContext } from '@/contexts/AuthContext'
import { useActivePomodoroTodoStore, useFiltersStore, useGlobalStore, useProjectsStore } from '@/stores/globalStore'
import { filterEmptyMessages, draggableFilters } from '@/utils/filters'
import { ChevronDownIcon, ChevronRightIcon } from './Icons'

function EmptyState ({ icon, title, description }) {
  return (
    <div className='text-center py-5 px-4 rounded-4' style={{ border: '1px dashed var(--bs-border-color)' }}>
      <div
        className='d-inline-flex align-items-center justify-content-center rounded-circle mb-3'
        style={{ width: 64, height: 64, background: 'var(--bs-primary-bg-subtle)', fontSize: '1.75rem' }}
      >
        {icon}
      </div>
      <h5 className='fw-semibold mb-2'>{title}</h5>
      <p className='text-muted mb-0 mx-auto' style={{ maxWidth: '26ch', fontSize: '0.875rem', lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  )
}

function ProjectGroup ({ name, todos, onReorder, draggable, collapsed, onToggleCollapse, onTodoChange }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const allCompleted = todos.length > 0 && todos.every(t => t.completed)

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const oldIndex = todos.findIndex(t => t.id === active.id)
    const newIndex = todos.findIndex(t => t.id === over.id)
    onReorder(name, arrayMove(todos, oldIndex, newIndex))
  }

  return (
    <div className='mb-3'>
      <button
        onClick={onToggleCollapse}
        className='d-flex align-items-center gap-2 w-100 text-start px-1 py-1 mb-1'
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: allCompleted ? 'var(--bs-secondary)' : 'var(--bs-body-color)',
          borderRadius: 4
        }}
      >
        <span style={{ flexShrink: 0, opacity: 0.5 }}>
          {collapsed ? <ChevronRightIcon size={12} /> : <ChevronDownIcon size={12} />}
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            textDecoration: allCompleted ? 'line-through' : 'none',
            opacity: allCompleted ? 0.6 : 1
          }}
        >
          {name ?? 'No project'}
        </span>
        <span
          className='badge rounded-pill bg-secondary'
          style={{ fontSize: '0.65rem' }}
        >
          {todos.length}
        </span>
      </button>

      {!collapsed && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <ul className='list-group'>
              {todos.map(todo => (
                <TodoListItem
                  key={todo.id}
                  initialTodo={todo}
                  draggable={draggable}
                  onTodoChange={onTodoChange}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

function buildGroupedMap (todos, projectNameSet) {
  const map = new Map()
  todos.forEach(todo => {
    const key = (todo.project && projectNameSet.has(todo.project)) ? todo.project : null
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(todo)
  })
  return map
}

function sortGroupEntries (entries) {
  return entries.sort(([keyA, groupA], [keyB, groupB]) => {
    const doneA = groupA.every(t => t.completed)
    const doneB = groupB.every(t => t.completed)
    if (doneA !== doneB) return doneA ? 1 : -1
    if (keyA === null) return 1
    if (keyB === null) return -1
    return keyA.localeCompare(keyB)
  })
}

export default function TodoList () {
  const [todos, setTodos] = useState([])
  const [collapsedGroups, setCollapsedGroups] = useState(new Set())
  const [expandedCompletedGroups, setExpandedCompletedGroups] = useState(new Set())

  const { user, loading } = useAuthContext()
  const newTodo = useGlobalStore(state => state.newTodo)
  const filter = useFiltersStore(state => state.filter)

  const updateActivePomodoro = useActivePomodoroTodoStore(state => state.updateActivePomodoroTodo)

  const availableProjects = useProjectsStore(state => state.availableProjects)
  const selectedProjects = useProjectsStore(state => state.selectedProjects)

  const projectNameSet = new Set(availableProjects.map(p => p.name))

  useEffect(() => {
    if (!user || loading) return

    const getTodos = async () => {
      try {
        const fetched = await getData(`users/${user.uid}/todos`, filter)

        const activePomodoroIndex = fetched.findIndex(todo => todo.id === 'activePomodoro')
        if (activePomodoroIndex !== -1) {
          const activePomodoroId = fetched.splice(activePomodoroIndex, 1)[0].text
          const activePomodoro = fetched.find(todo => todo.id === activePomodoroId) ?? null
          updateActivePomodoro(activePomodoro)
        }

        if (draggableFilters.has(filter)) {
          fetched.sort((a, b) => {
            if (a.order === undefined && b.order === undefined) return 0
            if (a.order === undefined) return 1
            if (b.order === undefined) return -1
            return a.order - b.order
          })
        }

        setTodos(fetched)
      } catch (error) {
        toast.error('Failed to load todos, please try again.')
      }
    }

    getTodos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, filter])

  useEffect(() => {
    if (!newTodo) return
    setTodos(prev => [...prev, newTodo])
  }, [newTodo])

  const handleTodoChange = (updatedTodo) => {
    setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t))
  }

  const toggleGroupCollapse = (projectKey, allCompleted) => {
    const storeKey = projectKey ?? '__none__'
    if (allCompleted) {
      setExpandedCompletedGroups(prev => {
        const next = new Set(prev)
        next.has(storeKey) ? next.delete(storeKey) : next.add(storeKey)
        return next
      })
    } else {
      setCollapsedGroups(prev => {
        const next = new Set(prev)
        next.has(storeKey) ? next.delete(storeKey) : next.add(storeKey)
        return next
      })
    }
  }

  const handleGroupReorder = async (projectKey, reorderedGroup) => {
    const grouped = buildGroupedMap(todos, projectNameSet)
    grouped.set(projectKey, reorderedGroup)

    const newTodos = sortGroupEntries([...grouped.entries()]).flatMap(([, group]) => group)
    setTodos(newTodos)

    try {
      await Promise.all(
        newTodos.map((todo, index) => updateData(`users/${user.uid}/todos`, todo.id, { order: index }))
      )
    } catch (error) {
      toast.error('Failed to save order, please try again.')
    }
  }

  if (loading) return <div>Loading...</div>

  if (!user && !loading) {
    return <EmptyState icon='🔒' title='Sign in to see your todos' description='Your tasks are waiting for you — sign in to get started.' />
  }

  const grouped = buildGroupedMap(todos, projectNameSet)

  const visibleEntries = sortGroupEntries([...grouped.entries()])
    .filter(([key]) => selectedProjects.length === 0 || selectedProjects.includes(key))

  if (visibleEntries.length === 0 && !loading) {
    const emptyState = filterEmptyMessages[filter] ?? {
      icon: '📝',
      title: 'No todos yet!',
      description: 'Type your first task above and press Enter to add it.'
    }
    return <EmptyState {...emptyState} />
  }

  return (
    <div>
      {visibleEntries.map(([key, groupTodos]) => {
        const storeKey = key ?? '__none__'
        const allCompleted = groupTodos.length > 0 && groupTodos.every(t => t.completed)
        const collapsed = allCompleted
          ? !expandedCompletedGroups.has(storeKey)
          : collapsedGroups.has(storeKey)
        return (
          <ProjectGroup
            key={storeKey}
            name={key}
            todos={groupTodos}
            onReorder={handleGroupReorder}
            draggable={draggableFilters.has(filter)}
            collapsed={collapsed}
            onToggleCollapse={() => toggleGroupCollapse(key, allCompleted)}
            onTodoChange={handleTodoChange}
          />
        )
      })}
    </div>
  )
}
