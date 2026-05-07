'use client'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { useSettingsStore } from '@/stores/globalStore'

import NavBar from '@/components/NavBar'
import TodoList from '@/components/TodoList'
import NewTodo from '@/components/NewTodo'
import Filters from '@/components/Filters'
import ProjectFilter from '@/components/ProjectFilter'
import PomodoroTimer from '@/components/PomodoroTimer'
import ErrorBoundary from '@/utils/ErrorBoundary'
import ThemeProvider from '@/components/ThemeProvider'

function AppContent () {
  const isDark = useSettingsStore(state => state.isDark)

  return (
    <>
      <AuthProvider>
        <NavBar />
        <main className='container'>
          <ErrorBoundary>
            <NewTodo />
            <Filters />
            <ProjectFilter />
            <PomodoroTimer />
            <TodoList />
          </ErrorBoundary>
        </main>
      </AuthProvider>
      <Toaster richColors position='bottom-left' theme={isDark ? 'dark' : 'light'} />
    </>
  )
}

export default function ClientApp () {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
