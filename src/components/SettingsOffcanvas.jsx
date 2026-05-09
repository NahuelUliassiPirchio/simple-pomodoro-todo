'use client'
import { Offcanvas, Form } from 'react-bootstrap'
import { useSettingsStore } from '@/stores/globalStore'
import { formatCounterDigit } from '@/utils/counterFormatter'
import styles from './SettingsOffcanvas.module.css'

function TimerSetting ({ label, color, value, min, max, onChange }) {
  const minutes = formatCounterDigit(value)
  const seconds = '00'

  return (
    <div className='bg-body-secondary rounded-3 p-3 mb-3'>
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <span className='text-muted small text-uppercase fw-semibold ls-wide'>{label}</span>
        <span className={`${styles.timeDisplay} text-${color}`}>{minutes}:{seconds}</span>
      </div>
      <Form.Range
        className={styles.slider}
        min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      <div className='d-flex justify-content-between align-items-center mt-2'>
        <small className='text-muted'>{min} min</small>
        <div className='d-flex align-items-center gap-1'>
          <Form.Control
            type='number'
            className={styles.numberInput}
            size='sm'
            min={min} max={max} value={value}
            onChange={e => {
              const val = Math.min(max, Math.max(min, Number(e.target.value)))
              if (!isNaN(val)) onChange(val)
            }}
          />
          <small className='text-muted'>min</small>
        </div>
        <small className='text-muted'>{max} min</small>
      </div>
    </div>
  )
}

export default function SettingsOffcanvas ({ show, onHide }) {
  const { workTime, restTime, setWorkTime, setRestTime, autoAdvance, toggleAutoAdvance } = useSettingsStore()

  return (
    <Offcanvas show={show} onHide={onHide} placement='end'>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Settings</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <p className='text-muted small text-uppercase fw-semibold mb-3'>⏱ Timer</p>

        <TimerSetting
          label='Work duration'
          color='primary'
          value={workTime}
          min={1} max={99}
          onChange={setWorkTime}
        />
        <TimerSetting
          label='Rest duration'
          color='success'
          value={restTime}
          min={1} max={30}
          onChange={setRestTime}
        />

        <p className='text-muted small mt-2'>
          Changes take effect on the next session start.
        </p>

        <hr />
        <p className='text-muted small text-uppercase fw-semibold mb-3'>⚙️ Behavior</p>
        <Form.Check
          type='switch'
          id='auto-advance-switch'
          label='Auto-advance between phases'
          checked={autoAdvance}
          onChange={toggleAutoAdvance}
          className='user-select-none'
        />
      </Offcanvas.Body>
    </Offcanvas>
  )
}
