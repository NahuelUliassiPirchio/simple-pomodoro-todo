'use client'

import useCountdown from '@/hooks/useCountdown'
import { formatCounterDigit } from '@/utils/counterFormatter'
import { useEffect } from 'react'
import { Button, Container } from 'react-bootstrap'

export default function Timer ({ initialTimeInS = 0, onTimeUp = () => {}, isResting, startRunningAt }) {
  const { minutes, seconds, isRunning, pauseTimer, resetTimer, startTimer } = useCountdown(initialTimeInS, onTimeUp)

  useEffect(() => {
    if (startRunningAt) {
      resetTimer(startRunningAt)
      startTimer()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startRunningAt])

  useEffect(() => {
    const handleExit = (e) => {
      localStorage.setItem('isResting', isResting)
      localStorage.setItem('time', `${minutes}:${seconds}`)
    }

    if (isRunning) {
      window.addEventListener('beforeunload', handleExit)
    } else {
      window.removeEventListener('beforeunload', handleExit)
    }

    return () => window.removeEventListener('beforeunload', handleExit)
  }, [isRunning, seconds, minutes, isResting])

  const handleStart = (e) => {
    notifyMe()
    startTimer()
  }

  const handleReset = () => {
    resetTimer(initialTimeInS)
  }

  return (
    <section>
      <h1>{formatCounterDigit(minutes)}:{formatCounterDigit(seconds)}</h1>
      <Container className='d-flex flex-row justify-content-center gap-2'>
        <Button onClick={isRunning ? pauseTimer : handleStart}>{isRunning ? 'Pause' : 'Start'}</Button>
        <Button onClick={handleReset}>Reset</Button>
      </Container>
    </section>
  )
}

function notifyMe () {
  if (('Notification' in window)) { return }

  if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        const notification = new Notification('Hi there!')
        setTimeout(() => {
          notification.close()
        }, 1000)
      }
    })
  }
}
