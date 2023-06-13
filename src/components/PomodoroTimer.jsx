'use client'

import { useState } from 'react'
import Timer from './Timer'
import { Container } from 'react-bootstrap'

const timePeriods = {
  work: 5,
  rest: 3
}
export default function PomodoroTimer () {
  const [time, setTime] = useState(timePeriods.work)
  const [isResting, setIsResting] = useState(false)

  const handleTimeUp = () => {
    setTime(!isResting ? timePeriods.rest : timePeriods.work)
    setIsResting(!isResting)
  }

  return (
    <Container as='section' className='d-inline text-center'>
      <Container className='d-flex flex-column justify-content-center'>
        <h1>{isResting ? 'Resting' : 'Working'}</h1>
        <Timer initialTimeInS={time} onTimeUp={handleTimeUp} />
      </Container>
    </Container>
  )
}
