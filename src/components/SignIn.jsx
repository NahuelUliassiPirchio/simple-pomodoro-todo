import { signIn } from '@/services/authService'
import Image from 'next/image'
import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

import googleIcon from '@/../public/icons/google.svg'
import anonymousIcon from '@/../public/icons/anonymous.svg'

import { PROVIDER_ANONYMOUS, PROVIDER_GOOGLE } from '@/constants/auth'

export default function SignIn () {
  const [showSignInModal, setShowSignInModal] = useState(false)

  const handleSignIn = async (providerName) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    await signIn(providerName, isMobile)
  }

  return (
    <>
      <Button variant='light' className='ms-auto' size='sm' onClick={() => setShowSignInModal(true)}>Sign In</Button>
      <Modal show={showSignInModal} onHide={() => setShowSignInModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex flex-column align-items-center justify-content-around gap-3 mt-4 mb-5'>
          <Button onClick={() => handleSignIn(PROVIDER_GOOGLE)}>
            <Image src={googleIcon} alt='Google icon' width='30' height='30' /> Sign In using Google
          </Button>
          or
          <Button variant='secondary' onClick={() => handleSignIn(PROVIDER_ANONYMOUS)}>
            <Image src={anonymousIcon} alt='Anonymous icon' width='30' height='30' /> Keep it anonymously for now
          </Button>
        </Modal.Body>
      </Modal>
    </>
  )
}
