import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap'

export default function NavBar () {
  const expand = 'sm'
  return (
    <Navbar as='header' bg='dark' variant='dark' expand={expand} className='mb-3'>
      <Container fluid>
        <Navbar.Brand href='#'>Navbar Offcanvas</Navbar.Brand>
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
          <Offcanvas.Body>
            <Nav className='justify-content-center flex-grow-1 pe-3'>
              <Nav.Link href='#action1'>Home</Nav.Link>
              <Nav.Link href='#action2'>Link</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}
