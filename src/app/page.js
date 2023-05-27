'use client'

import NavBar from '@/components/NavBar'
import styles from './page.module.css'
import TodoListItem from '@/components/TodoListItem'

export default function Home () {
  return (
    <>
      <NavBar />
      <main className={styles.main}>
        <TodoListItem />
      </main>
    </>
  )
}
