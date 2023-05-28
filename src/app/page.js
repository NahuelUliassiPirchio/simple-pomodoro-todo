import NavBar from '@/components/NavBar'
import styles from './page.module.css'
import TodoList from '@/components/TodoList'
import NoteForm from '@/components/NoteForm'

export default function Home () {
  return (
    <>
      <NavBar />
      <main className={styles.main}>
        <NoteForm />
        <TodoList />
      </main>
    </>
  )
}
