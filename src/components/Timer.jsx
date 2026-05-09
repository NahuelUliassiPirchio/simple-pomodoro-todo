'use client'

import useCountdown from '@/hooks/useCountdown'
import { formatCounterDigit } from '@/utils/counterFormatter'
import { useEffect, useRef } from 'react'
import { Button, Container } from 'react-bootstrap'

export default function Timer ({ initialTimeInS = 0, onTimeUp = () => {}, isResting, startRunningAt, onSkip, autoStartTrigger }) {
  const justFinishedRef = useRef(false)
  const onTimeUpRef = useRef(onTimeUp)
  useEffect(() => { onTimeUpRef.current = onTimeUp }, [onTimeUp])

  const { minutes, seconds, isRunning, pauseTimer, resetTimer, startTimer } = useCountdown(
    initialTimeInS,
    () => { justFinishedRef.current = true; onTimeUpRef.current() }
  )

  useEffect(() => {
    if (startRunningAt) {
      resetTimer(startRunningAt)
      startTimer()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startRunningAt])

  useEffect(() => {
    if (!autoStartTrigger) return
    startTimer()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStartTrigger])

  useEffect(() => {
    const saveState = () => {
      localStorage.setItem('isResting', isResting)
      localStorage.setItem('time', `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
      localStorage.setItem('timerSavedAt', String(Date.now()))
    }

    if (isRunning) {
      window.addEventListener('beforeunload', saveState)
    } else {
      window.removeEventListener('beforeunload', saveState)
    }

    return () => {
      window.removeEventListener('beforeunload', saveState)
      if (isRunning && !justFinishedRef.current) saveState()
      justFinishedRef.current = false
    }
  }, [isRunning, seconds, minutes, isResting])

  useEffect(() => {
    const phase = isResting ? 'Resting' : 'Working'
    document.title = `${formatCounterDigit(minutes)}:${formatCounterDigit(seconds)} | ${phase}`
    return () => { document.title = 'Pomodoro' }
  }, [minutes, seconds, isResting])

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
        {isResting && <Button variant='' className='border-0 bg-transparent text-body fs-3 p-1 lh-1 btn-skip' title='Skip rest' onClick={onSkip}>⏭</Button>}
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
