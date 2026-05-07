'use client'

import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { toast } from 'sonner'
import Timer from './Timer'
import useActivePomodoro from '@/hooks/useActivePomodoro'
import { useSettingsStore, useWorkedPomsStore } from '@/stores/globalStore'

export default function PomodoroTimer () {
  const { workTime, restTime } = useSettingsStore()

  const [remainingTime, setRemainingTime] = useState(workTime * 60)
  const [isResting, setIsResting] = useState(false)
  const [startRunningAt, setStartRunningAt] = useState(null)

  const { activePomodoro, editActivePomodoro, increaseDailyPomodoro } = useActivePomodoro()
  const { increaseWorkedPoms } = useWorkedPomsStore()

  useEffect(() => {
    setIsResting(false)
    setRemainingTime(workTime * 60)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workTime, restTime])

  const handleTimeUp = async () => {
    const nextIsResting = !isResting
    setIsResting(nextIsResting)
    setRemainingTime(nextIsResting ? restTime * 60 : workTime * 60)

    if (!isResting) {
      try {
        await Promise.all([
          activePomodoro && editActivePomodoro({
            ...activePomodoro,
            pomodoros: !isNaN(activePomodoro.pomodoros) ? activePomodoro.pomodoros + 1 : 1
          }),
          increaseDailyPomodoro()
        ])
        increaseWorkedPoms()
      } catch (error) {
        toast.error('Failed to save pomodoro progress.')
      }
    }

    const doneAudio = new Audio('/audio/done_audio.mp3')
    doneAudio.play()

    if (Notification.permission === 'granted') {
      const notification = new Notification(`${isResting ? 'Resting' : 'Working'} time!`)
      setTimeout(() => {
        notification.close()
      }, 2000)
    }
  }

  useEffect(() => {
    const lastTime = localStorage.getItem('time')
    const itWasResting = localStorage.getItem('isResting') === 'true'
    const savedAt = localStorage.getItem('timerSavedAt')

    if (lastTime) {
      const [mins, secs] = lastTime.split(':')
      let timeInS = parseInt(mins) * 60 + parseInt(secs)

      if (savedAt) {
        const elapsed = Math.floor((Date.now() - parseInt(savedAt)) / 1000)
        timeInS = Math.max(1, timeInS - elapsed)
      }

      setIsResting(itWasResting)
      setRemainingTime(itWasResting ? restTime * 60 : workTime * 60)
      setStartRunningAt(timeInS)

      localStorage.removeItem('time')
      localStorage.removeItem('isResting')
      localStorage.removeItem('timerSavedAt')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container as='section' className='d-flex flex-column justify-content-center mb-3 text-center'>
      <h1>{isResting ? 'Resting' : 'Working'}</h1>
      <Timer initialTimeInS={remainingTime} onTimeUp={handleTimeUp} isResting={isResting} startRunningAt={startRunningAt} />
    </Container>
  )
}
