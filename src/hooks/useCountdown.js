import { useEffect, useState } from 'react'

export default function useCountdown (initialTimeS = 0, onTimeUp = () => {}) {
  const [minutes, setMinutes] = useState(Math.floor(initialTimeS / 60))
  const [seconds, setSeconds] = useState(Math.floor((initialTimeS % 60)))
  const [isRunning, setIsRunning] = useState(false)

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
          onTimeUp()
          clearInterval(interval)
        } else {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [seconds, minutes, isRunning, onTimeUp])

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setMinutes(Math.floor(initialTimeS / 60))
    setSeconds(Math.floor(initialTimeS % 60))
  }

  const startTimer = () => {
    setIsRunning(true)
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
