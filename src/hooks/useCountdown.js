import { useEffect, useState } from 'react'
import { useTimerStore } from '@/stores/globalStore'
import { calculateMinutes, calculateResidualSeconds } from '@/utils/counterFormatter'

export default function useCountdown (initialTimeS = 0, onTimeUp = () => {}) {
  const [minutes, setMinutes] = useState(calculateMinutes(initialTimeS))
  const [seconds, setSeconds] = useState(calculateResidualSeconds(initialTimeS))
  const isRunning = useTimerStore(state => state.isRunning)
  const updateIsRunning = useTimerStore(state => state.updateIsRunning)

  useEffect(() => {
    if (!isRunning) {
      return
    }
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval)
          onTimeUp()
        } else {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [seconds, minutes, isRunning, onTimeUp])

  useEffect(() => {
    resetTimer(initialTimeS)
  }, [initialTimeS])

  const pauseTimer = () => {
    updateIsRunning(false)
  }

  const resetTimer = (time) => {
    setMinutes(calculateMinutes(time))
    setSeconds(calculateResidualSeconds(time))
  }

  const startTimer = () => {
    updateIsRunning(true)
  }

  return {
    minutes,
    seconds,
    isRunning,
    pauseTimer,
    resetTimer,
    startTimer
  }
}
