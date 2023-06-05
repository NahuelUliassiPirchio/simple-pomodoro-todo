import Image from 'next/image'
import { Button } from 'react-bootstrap'

export default function UserAccount ({ user, handleLogOut }) {
  return (
    <nav className='d-flex justify-content-between align-items-center'>
      <div className='d-flex align-items-center'>
        <Image src={user.photoURL} alt='user' width={50} height={50} className='rounded-circle' />
        <div className='ms-3 pe-3'>
          <h6 className='mb-0 text-light'>{user.displayName}</h6>
          <p className='mb-0 text-muted'>{user.email}</p>
        </div>
      </div>
      <Button variant='outline-light' className='ms-auto' size='sm' onClick={handleLogOut}>Log Out</Button>
    </nav>
  )
}
