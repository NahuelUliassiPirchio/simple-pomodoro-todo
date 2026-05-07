'use client'

import { useState } from 'react'
import { Button, Container, Navbar } from 'react-bootstrap'

import { useAuthContext } from '@/contexts/AuthContext'
import { useSettingsStore } from '@/stores/globalStore'
import UserAccount from './UserAccount'
import DailyPomodoros from './DailyPomodoros'
import SignIn from './SignIn'
import SettingsOffcanvas from './SettingsOffcanvas'
import Link from 'next/link'
import { ChartIcon, GearIcon, MoonIcon, SunIcon } from './Icons'
import styles from './NavBar.module.css'

export default function NavBar () {
  const expand = 'sm'
  const [showSettings, setShowSettings] = useState(false)

  const { user, loading } = useAuthContext()
  const { isDark, toggleDark } = useSettingsStore()

  return (
    <>
      <Navbar as='header' bg='dark' variant='dark' expand={expand} className='mb-3'>
        <Container fluid>
          <Navbar.Brand href='/'>
            Simpl Todo + Pomodoro 🍅
          </Navbar.Brand>

          <DailyPomodoros user={user} />

          <div className='d-flex gap-2 align-items-center'>
            <button className={styles.iconBtn} onClick={toggleDark} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>
            <Link href='/stats' className={styles.iconBtn} title='Productivity stats'>
              <ChartIcon size={18} />
            </Link>
            <button className={styles.iconBtn} onClick={() => setShowSettings(true)} title='Settings'>
              <GearIcon size={18} />
            </button>
            {
              loading
                ? (
                  <Button variant='outline-light' disabled>
                    <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true' />
                    <span className='visually-hidden'>Loading...</span>
                  </Button>
                  )
                : (
                    user
                      ? (
                        <UserAccount user={user} />
                        )
                      : (
                        <SignIn />
                        )
                  )
            }
          </div>
        </Container>
      </Navbar>

      <SettingsOffcanvas show={showSettings} onHide={() => setShowSettings(false)} />
    </>
  )
}
