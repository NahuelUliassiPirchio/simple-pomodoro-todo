import NavBar from '@/components/NavBar'
import TodoList from '@/components/TodoList'
import { AuthProvider } from '@/contexts/authContext'
import NewTodo from '@/components/NewTodo'
import { DataProvider } from '@/contexts/dataContext'

export default function Home () {
  return (
    <>
      <AuthProvider>
        <NavBar />
        <DataProvider>
          <main className='container'>
            <NewTodo />
            <TodoList />
          </main>
        </DataProvider>
      </AuthProvider>
    </>
  )
}
