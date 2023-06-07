import { AuthProvider } from '@/contexts/authContext'
import { DataProvider } from '@/contexts/dataContext'

import NavBar from '@/components/NavBar'
import TodoList from '@/components/TodoList'
import NewTodo from '@/components/NewTodo'

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
