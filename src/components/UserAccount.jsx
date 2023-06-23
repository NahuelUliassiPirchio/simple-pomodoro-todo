import Image from 'next/image'
import Button from 'react-bootstrap/Button'

import anonymousIcon from '@/../public/icons/anonymous.svg'
import { mergeAccount, signOut } from '@/services/authService'
import { PROVIDER_GOOGLE } from '@/constants/auth'

export default function UserAccount ({ user }) {
  const handleLogOut = async () => {
    if (user.isAnonymous) console.log('are you sure? If you dont merge, youre going to lose all your data')
    await signOut()
  }

  const handleMergeData = async () => {
    await mergeAccount(PROVIDER_GOOGLE)
  }

  return (
    <nav className='d-flex justify-content-between align-items-center'>
      {
        user.isAnonymous
          ? (
            <div className='text-white d-flex'>
              <Image src={anonymousIcon} alt='Anonymous icon' width='30' height='30' /> Anonymous account
              <Button variant='primary' onClick={handleMergeData}>Merge data</Button>
            </div>
            )
          : (
            <div className='d-flex align-items-center'>
              <Image src={user.photoURL} alt='user' width={40} height={40} className='rounded-circle' />
              <div className='ms-3 pe-3'>
                <h6 className='mb-0 text-light'>{user.displayName}</h6>
                <p className='mb-0 text-white-50'>{user.email}</p>
              </div>
            </div>
            )
      }
      <Button variant='outline-light' className='ms-auto' size='sm' onClick={handleLogOut}>Log Out</Button>
    </nav>
  )
}
