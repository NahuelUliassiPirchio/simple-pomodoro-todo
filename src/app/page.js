import NavBar from '@/components/NavBar'
import TodoList from '@/components/TodoList'
import styles from './page.module.css'
import { AuthProvider } from '@/contexts/authContext'
import NewTodo from '@/components/NewTodo'

export default function Home () {
  return (
    <>
      <AuthProvider>
        <NavBar />
      </AuthProvider>
      <main className={styles.main}>
        <NewTodo />
        <TodoList />
      </main>
    </>
  )
}
