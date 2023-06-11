'use client'

import useCountdown from '@/hooks/useCountdown'
import formatCounter from '@/utils/counterFormatter'
import { useEffect } from 'react'
import { Button, Container } from 'react-bootstrap'

export default function Timer ({ initialTimeInS = 0, onTimeUp = () => {} }) {
  const { minutes, seconds, isRunning, pauseTimer, resetTimer, startTimer } = useCountdown(initialTimeInS, onTimeUp)

  useEffect(() => {
    resetTimer()
  }, [initialTimeInS])

  return (
    <section>
      <h1>{formatCounter(minutes)}:{formatCounter(seconds)}</h1>
      <Container className='d-flex flex-row justify-content-center gap-2'>
        <Button onClick={isRunning ? pauseTimer : startTimer}>{isRunning ? 'Pause' : 'Start'}</Button>
        <Button onClick={resetTimer}>Reset</Button>
      </Container>
    </section>
  )
}
