'use client'

import { Button, Container, Navbar, Offcanvas } from 'react-bootstrap'

import { useAuthContext } from '@/contexts/authContext'
import { signIn, signOut } from '@/services/authService'
import UserAccount from './UserAccount'
import DailyPomodoros from './DailyPomodoros'

export default function NavBar () {
  const expand = 'sm'

  const { user, loading } = useAuthContext()

  const handleLogOut = async () => {
    await signOut()
  }

  const handleSignIn = async () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    await signIn(isMobile)
  }

  return (
    <Navbar as='header' bg='dark' variant='dark' expand={expand} className='mb-3'>
      <Container fluid>
        <Navbar.Brand href=''>
          Simpl Todo + Pomodoro 🍅
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement='end'
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              Offcanvas
            </Offcanvas.Title>
          </Offcanvas.Header>
          {/* <Offcanvas.Body>
            <Nav className='justify-content-center flex-grow-1 pe-3'>
              <Nav.Link href='#action1'>Home</Nav.Link>
              <Nav.Link href='#action2'>Link</Nav.Link>
            </Nav>
          </Offcanvas.Body> */}
          <DailyPomodoros user={user} />
        </Navbar.Offcanvas>
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
                    <UserAccount user={user} handleLogOut={handleLogOut} />
                    )
                  : (
                    <Button variant='light' className='ms-auto' size='sm' onClick={handleSignIn}>Sign In</Button>
                    )
              )
        }
      </Container>
    </Navbar>
  )
}
