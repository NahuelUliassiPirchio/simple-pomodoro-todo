import { useEffect, useRef, useState } from 'react'
import { useTimerStore } from '@/stores/globalStore'
import { calculateMinutes, calculateResidualSeconds } from '@/utils/counterFormatter'

export default function useCountdown (initialTimeS = 0, onTimeUp = () => {}) {
  const remainingMsRef = useRef(initialTimeS * 1000)
  const [remainingMs, setRemainingMs] = useState(initialTimeS * 1000)
  const endTimeRef = useRef(null)
  const intervalRef = useRef(null)
  const onTimeUpRef = useRef(onTimeUp)

  const isRunning = useTimerStore(state => state.isRunning)
  const updateIsRunning = useTimerStore(state => state.updateIsRunning)

  useEffect(() => { onTimeUpRef.current = onTimeUp }, [onTimeUp])

  const setRemaining = (ms) => {
    remainingMsRef.current = ms
    setRemainingMs(ms)
  }

  const fireTimeUp = () => {
    clearInterval(intervalRef.current)
    endTimeRef.current = null
    setRemaining(0)
    updateIsRunning(false)
    onTimeUpRef.current()
  }

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      if (!endTimeRef.current) return
      const remaining = Math.max(0, endTimeRef.current - Date.now())
      setRemaining(remaining)
      if (remaining <= 0) fireTimeUp()
    }, 500)

    return () => clearInterval(intervalRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden || !isRunning || !endTimeRef.current) return
      const remaining = Math.max(0, endTimeRef.current - Date.now())
      setRemaining(remaining)
      if (remaining <= 0) fireTimeUp()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning])

  useEffect(() => {
    resetTimer(initialTimeS)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTimeS])

  const pauseTimer = () => {
    if (endTimeRef.current) {
      setRemaining(Math.max(0, endTimeRef.current - Date.now()))
      endTimeRef.current = null
    }
    updateIsRunning(false)
  }

  const resetTimer = (time) => {
    endTimeRef.current = null
    updateIsRunning(false)
    setRemaining(time * 1000)
  }

  const startTimer = () => {
    endTimeRef.current = Date.now() + remainingMsRef.current
    updateIsRunning(true)
  }

  const totalSeconds = Math.ceil(remainingMs / 1000)
  const minutes = calculateMinutes(totalSeconds)
  const seconds = calculateResidualSeconds(totalSeconds)

  return { minutes, seconds, isRunning, pauseTimer, resetTimer, startTimer }
}
