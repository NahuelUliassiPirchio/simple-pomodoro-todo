'use client'

import styles from './page.module.css'
import authService from '@/services/authService'

export default function Home () {
  authService()
  return (
    <main className={styles.main} />
  )
}
