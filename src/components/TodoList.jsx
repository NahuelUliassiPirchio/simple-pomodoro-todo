'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'

import { getData, updateData } from '@/services/dbService'
import TodoListItem from './TodoListItem'
import { useAuthContext } from '@/contexts/AuthContext'
import { useActivePomodoroTodoStore, useFiltersStore, useGlobalStore } from '@/stores/globalStore'
import { filterEmptyMessages, draggableFilters } from '@/utils/filters'

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

export default function TodoList () {
  const [todos, setTodos] = useState([])

  const { user, loading } = useAuthContext()
  const newTodo = useGlobalStore(state => state.newTodo)
  const filter = useFiltersStore(state => state.filter)

  const updateActivePomodoro = useActivePomodoroTodoStore(state => state.updateActivePomodoroTodo)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    if (!user || loading) {
      return
    }

    const getTodos = async () => {
      try {
        const todos = await getData(`users/${user.uid}/todos`, filter)

        const activePomodoroIndexIndex = todos.findIndex(todo => todo.id === 'activePomodoro')
        if (activePomodoroIndexIndex !== -1) {
          const activePomodoroId = todos.splice(activePomodoroIndexIndex, 1)[0].text
          const activePomodoroIndex = todos.findIndex(todo => todo.id === activePomodoroId)
          const activePomodoro = activePomodoroIndex !== -1 && todos.splice(activePomodoroIndex, 1)[0]
          updateActivePomodoro(activePomodoro)
        }

        if (draggableFilters.has(filter)) {
          todos.sort((a, b) => {
            if (a.order === undefined && b.order === undefined) return 0
            if (a.order === undefined) return 1
            if (b.order === undefined) return -1
            return a.order - b.order
          })
        }

        setTodos(todos)
      } catch (error) {
        toast.error('Failed to load todos, please try again.')
      }
    }

    getTodos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, filter])

  useEffect(() => {
    if (!newTodo) {
      return
    }
    setTodos(prevTodos => {
      return [...prevTodos, newTodo]
    })
  }, [newTodo])

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return

    const oldIndex = todos.findIndex(t => t.id === active.id)
    const newIndex = todos.findIndex(t => t.id === over.id)
    const reordered = arrayMove(todos, oldIndex, newIndex)

    setTodos(reordered)

    try {
      await Promise.all(
        reordered.map((todo, index) =>
          updateData(`users/${user.uid}/todos`, todo.id, { order: index })
        )
      )
    } catch (error) {
      toast.error('Failed to save order, please try again.')
    }
  }

  if (loading) return <div>Loading...</div>

  if (!user && !loading) {
    return <EmptyState icon='🔒' title='Sign in to see your todos' description='Your tasks are waiting for you — sign in to get started.' />
  }

  const emptyState = filterEmptyMessages[filter] ?? {
    icon: '📝',
    title: 'No todos yet!',
    description: 'Type your first task above and press Enter to add it.'
  }

  return (
    (todos.length === 0 && !loading)
      ? <EmptyState {...emptyState} />
      : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <ul className='list-group'>
              {todos && todos.map(todo => (
                <TodoListItem
                  key={todo.id}
                  initialTodo={todo}
                  draggable={draggableFilters.has(filter)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
        )
  )
}
