import { Button, Container } from 'react-bootstrap'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import anonymousIcon from '@/../public/icons/anonymous.svg'
import { mergeAccount, signOut } from '@/services/authService'
import { PROVIDER_GOOGLE } from '@/constants/auth'

import ConfirmationModal from './ConfirmationModal'

export default function UserAccount ({ user }) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const handleLogOut = async () => {
    try {
      await signOut()
    } catch (error) {
      toast.error('There was an error logging out')
    }
  }

  const handleMergeData = async () => {
    try {
      await mergeAccount(PROVIDER_GOOGLE)
    } catch (error) {
      toast.error('There was an error merging your account')
    }
  }

  return (
    <nav className='d-flex justify-content-between align-items-center'>
      {
        user.isAnonymous
          ? (
            <Container className='text-white d-flex'>
              <Image src={anonymousIcon} alt='Anonymous icon' width='30' height='30' /> Anonymous account
              <Button variant='primary' onClick={handleMergeData}>Merge data</Button>
            </Container>
            )
          : (
            <Container className='d-flex align-items-center'>
              <Image src={user.photoURL} alt='User avatar' width={40} height={40} className='rounded-circle' />
              <div className='m-3 pe-3'>
                <h6 className='mb-0 text-light'>{user.displayName}</h6>
                <p className='mb-0 text-white-50'>{user.email}</p>
              </div>
            </Container>
            )
      }
      <Button
        variant='outline-light' className='ms-auto' size='sm' onClick={() => {
          if (user.isAnonymous) return setShowConfirmationModal(true)
          handleLogOut()
        }}
      >Log Out
      </Button>

      {
        showConfirmationModal && (
          <ConfirmationModal
            title='Log out?'
            message="You're browsing as a guest. Your data will be lost if you log out without linking your account. Are you sure?"
            onCancel={() => setShowConfirmationModal(false)}
            onConfirm={handleLogOut}
            confirmationMessage='Log Out'
          />
        )
      }
    </nav>
  )
}
