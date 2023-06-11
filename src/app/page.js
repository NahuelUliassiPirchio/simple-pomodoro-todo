import { AuthProvider } from '@/contexts/authContext'
import { DataProvider } from '@/contexts/dataContext'

import NavBar from '@/components/NavBar'
import TodoList from '@/components/TodoList'
import NewTodo from '@/components/NewTodo'
import Filters from '@/components/Filters'
import { FiltersProvider } from '@/contexts/filtersContext'
import PomodoroTimer from '@/components/PomodoroTimer'

export default function Home () {
  return (
    <>
      <AuthProvider>
        <NavBar />
        <DataProvider>
          <main className='container'>
            <NewTodo />
            <FiltersProvider>
              <Filters />
              <PomodoroTimer />
              <TodoList />
            </FiltersProvider>
          </main>
        </DataProvider>
      </AuthProvider>
    </>
  )
}
