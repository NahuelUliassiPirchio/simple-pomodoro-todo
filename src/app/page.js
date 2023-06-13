import { AuthProvider } from '@/contexts/authContext'

import NavBar from '@/components/NavBar'
import TodoList from '@/components/TodoList'
import NewTodo from '@/components/NewTodo'
import Filters from '@/components/Filters'
import PomodoroTimer from '@/components/PomodoroTimer'

export default function Home () {
  return (
    <>
      <AuthProvider>
        <NavBar />
        <main className='container'>
          <NewTodo />
          <Filters />
          <PomodoroTimer />
          <TodoList />
        </main>
      </AuthProvider>
    </>
  )
}
