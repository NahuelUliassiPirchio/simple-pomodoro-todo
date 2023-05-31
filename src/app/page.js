import NavBar from '@/components/NavBar'
import TodoList from '@/components/TodoList'
import NoteForm from '@/components/NoteForm'
import styles from './page.module.css'
import { AuthProvider } from '@/contexts/authContext'

export default function Home () {
  return (
    <>
      <AuthProvider>
        <NavBar />
      </AuthProvider>
      <main className={styles.main}>
        <NoteForm />
        <TodoList />
      </main>
    </>
  )
}
