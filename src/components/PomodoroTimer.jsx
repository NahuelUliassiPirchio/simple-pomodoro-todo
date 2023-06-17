'use client'

import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import Timer from './Timer'
import TodoListItem from './TodoListItem'
import { useActivePomodoroTodoStore } from '@/stores/globalStore'

const timePeriods = {
  work: 25 * 60,
  rest: 3 * 60
}
export default function PomodoroTimer () {
  const [time, setTime] = useState(timePeriods.work)
  const [isResting, setIsResting] = useState(false)
  const [startRunningAt, setStartRunningAt] = useState(null)

  const activePomodoroTodo = useActivePomodoroTodoStore(state => state.activePomodoroTodo)

  const handleTimeUp = () => {
    setTime(!isResting ? timePeriods.rest : timePeriods.work)

    setIsResting(!isResting)

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
    console.log(activePomodoroTodo)
  }
  , [activePomodoroTodo])

  useEffect(() => {
    const lastTime = localStorage.getItem('time')
    const itWasResting = localStorage.getItem('isResting') === 'true'

    if (lastTime) {
      const [minutes, seconds] = lastTime.split(':')
      const timeInS = parseInt(minutes) * 60 + parseInt(seconds)

      setIsResting(itWasResting)
      setTime(itWasResting ? timePeriods.rest : timePeriods.work)
      setStartRunningAt(timeInS)

      localStorage.removeItem('time')
      localStorage.removeItem('isResting')
    }
  }, [])

  return (
    <Container as='section' className='d-flex flex-column justify-content-center mb-3 text-center'>
      {
        activePomodoroTodo && (
          <div className='text-start m-3 mb-1'>
            <TodoListItem initialTodo={activePomodoroTodo} pomodoro />
          </div>
        )
      }
      <h1>{isResting ? 'Resting' : 'Working'}</h1>
      <Timer initialTimeInS={time} onTimeUp={handleTimeUp} isResting={isResting} startRunningAt={startRunningAt} />
    </Container>
  )
}
