'use client'
import { Toast } from 'react-bootstrap'

export default function ToastWarning ({ message, onClose }) {
  return (
    <Toast className='fixed-bottom fixed-start mb-3 ms-3 z-3' onClose={onClose} show delay={4500} autohide>
      <Toast.Header>
        <strong className='me-auto'>Simple Pomodoro To-do 🍅</strong>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  )
}
