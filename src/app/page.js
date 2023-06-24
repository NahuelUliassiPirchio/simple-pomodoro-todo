import { AuthProvider } from '@/contexts/AuthContext'

import NavBar from '@/components/NavBar'
import TodoList from '@/components/TodoList'
import NewTodo from '@/components/NewTodo'
import Filters from '@/components/Filters'
import PomodoroTimer from '@/components/PomodoroTimer'
import ErrorBoundary from '@/utils/ErrorBoundary'

export default function Home () {
  return (
    <>
      <AuthProvider>
        <NavBar />
        <main className='container'>
          <ErrorBoundary>
            <NewTodo />
            <Filters />
            <PomodoroTimer />
            <TodoList />
          </ErrorBoundary>
        </main>
      </AuthProvider>
    </>
  )
}
