'use client'

import { Button, Container, Navbar } from 'react-bootstrap'

import { useAuthContext } from '@/contexts/AuthContext'
import UserAccount from './UserAccount'
import DailyPomodoros from './DailyPomodoros'
import SignIn from './SignIn'

export default function NavBar () {
  const expand = 'sm'

  const { user, loading } = useAuthContext()

  return (
    <Navbar as='header' bg='dark' variant='dark' expand={expand} className='mb-3'>
      <Container fluid>
        <Navbar.Brand href=''>
          Simpl Todo + Pomodoro 🍅
        </Navbar.Brand>

        <DailyPomodoros user={user} />
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
      </Container>
    </Navbar>
  )
}
