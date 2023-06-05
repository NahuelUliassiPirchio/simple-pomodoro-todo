import NavBar from '@/components/NavBar'
import TodoList from '@/components/TodoList'
import { AuthProvider } from '@/contexts/authContext'
import NewTodo from '@/components/NewTodo'

export default function Home () {
  return (
    <>
      <AuthProvider>
        <NavBar />
        <main className='container'>
          <NewTodo />
          <TodoList />
        </main>
      </AuthProvider>
    </>
  )
}
