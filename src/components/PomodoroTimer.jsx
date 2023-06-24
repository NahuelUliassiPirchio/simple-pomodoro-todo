'use client'

import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import Timer from './Timer'
import TodoListItem from './TodoListItem'
import useActivePomodoro from '@/hooks/useActivePomodoro'
import { useWorkedPomsStore } from '@/stores/globalStore'

const intialTimePeriods = {
  work: 25 * 60,
  rest: 5 * 60
}
export default function PomodoroTimer () {
  const [remainingTime, setRemainingTime] = useState(intialTimePeriods.work)
  const [isResting, setIsResting] = useState(false)
  const [startRunningAt, setStartRunningAt] = useState(null)

  const { activePomodoro, editActivePomodoro, increaseDailyPomodoro } = useActivePomodoro() // TODO: SHOW ERROR
  const { increaseWorkedPoms } = useWorkedPomsStore()

  const handleTimeUp = async () => {
    setRemainingTime(!isResting ? intialTimePeriods.rest : intialTimePeriods.work)

    setIsResting(!isResting)

    if (!isResting) {
      await Promise.all([
        activePomodoro && editActivePomodoro({
          ...activePomodoro,
          pomodoros: !isNaN(activePomodoro.pomodoros) ? activePomodoro.pomodoros + 1 : 1
        }),
        increaseDailyPomodoro()
      ])
      increaseWorkedPoms()
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

    if (lastTime) {
      const [minutes, seconds] = lastTime.split(':')
      const timeInS = parseInt(minutes) * 60 + parseInt(seconds)

      setIsResting(itWasResting)
      setRemainingTime(itWasResting ? intialTimePeriods.rest : intialTimePeriods.work)
      setStartRunningAt(timeInS)

      localStorage.removeItem('time')
      localStorage.removeItem('isResting')
    }
  }, [])

  return (
    <Container as='section' className='d-flex flex-column justify-content-center mb-3 text-center'>
      {
        activePomodoro && (
          <div className='text-start m-3 mb-1'>
            <TodoListItem initialTodo={activePomodoro} pomodoro />
          </div>
        )
      }
      <h1>{isResting ? 'Resting' : 'Working'}</h1>
      <Timer initialTimeInS={remainingTime} onTimeUp={handleTimeUp} isResting={isResting} startRunningAt={startRunningAt} />
    </Container>
  )
}
