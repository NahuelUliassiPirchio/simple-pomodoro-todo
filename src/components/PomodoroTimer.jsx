'use client'

import { useState } from 'react'
import Timer from './Timer'
import { Button, Container } from 'react-bootstrap'

const timePeriods = {
  work: 5,
  rest: 3
}
export default function PomodoroTimer () {
  const [show, setShow] = useState(false)
  const [time, setTime] = useState(timePeriods.work)
  const [isResting, setIsResting] = useState(false)

  const handleTimeUp = () => {
    setIsResting(!isResting)
    setTime(isResting ? timePeriods.rest : timePeriods.work)
  }

  return (
    <Container as='section' className='d-inline text-center'>
      {!show && <Button onClick={() => setShow(!show)}>Pomodoro Timer</Button>}
      {show &&
        <Container className='d-flex flex-column justify-content-center'>
          <h1>{isResting ? 'Resting' : 'Working'}</h1>
          <Timer initialTimeInS={time} onTimeUp={handleTimeUp} />
        </Container>}
    </Container>

  )
}
