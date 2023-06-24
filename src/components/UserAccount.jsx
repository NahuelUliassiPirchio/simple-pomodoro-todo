import { Button, Container } from 'react-bootstrap'
import Image from 'next/image'
import { useState } from 'react'

import anonymousIcon from '@/../public/icons/anonymous.svg'
import { mergeAccount, signOut } from '@/services/authService'
import { PROVIDER_GOOGLE } from '@/constants/auth'

import ConfirmationModal from './ConfirmationModal'
import ToastWarning from './Toast'

export default function UserAccount ({ user }) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [error, setError] = useState(null)

  const handleLogOut = async () => {
    try {
      await signOut()
    } catch (error) {
      setError('There was an error logging out')
    }
  }

  const handleMergeData = async () => {
    try {
      await mergeAccount(PROVIDER_GOOGLE)
    } catch (error) {
      setError('There was an error mergin your account')
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
            title='Delete To-do from Pomodoro?'
            message={'Hey! You\'re going to lose the pomodoro progress. Are you sure?'}
            onCancel={() => setShowConfirmationModal(false)}
            onConfirm={handleLogOut}
            confirmationMessage='Delete'
          />
        )
      }

      {
        error && <ToastWarning message={error} onClose={() => setError(null)} />
      }
    </nav>
  )
}
