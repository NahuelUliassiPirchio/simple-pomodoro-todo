'use client'
import { useState } from 'react'
import { Container, Spinner } from 'react-bootstrap'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { useAuthContext } from '@/contexts/AuthContext'
import { useSettingsStore } from '@/stores/globalStore'
import ThemeProvider from '@/components/ThemeProvider'
import NavBar from '@/components/NavBar'
import ProductivityChart from '@/components/ProductivityChart'
import useDashboardData from '@/hooks/useDashboardData'
import { formatTime } from '@/utils/dashboardUtils'

const PERIODS = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '3 months', value: 90 }
]

function DashboardContent () {
  const [period, setPeriod] = useState(7)
  const { user } = useAuthContext()
  const workTime = useSettingsStore(state => state.workTime)
  const isDark = useSettingsStore(state => state.isDark)
  const { data, loading, error } = useDashboardData(period)

  const totals = data.reduce(
    (acc, d) => ({
      pomodoros: acc.pomodoros + d.pomodoros,
      minutesWorked: acc.minutesWorked + d.minutesWorked,
      tasksCompleted: acc.tasksCompleted + d.tasksCompleted
    }),
    { pomodoros: 0, minutesWorked: 0, tasksCompleted: 0 }
  )

  const maxDailyMinutes = data.length ? Math.max(...data.map(d => d.minutesWorked)) : 0
  const useHours = maxDailyMinutes > 60
  const timeTickFormatter = useHours ? min => `${Math.round(min / 60)}h` : undefined
  const timeValueFormatter = useHours ? formatTime : undefined

  if (!user) {
    return (
      <div className='text-center py-5 text-muted'>
        <p>Sign in to view your productivity stats.</p>
      </div>
    )
  }

  return (
    <>
      <div className='d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2'>
        <h2 className='mb-0 h4'>Productivity Dashboard</h2>
        <div className='btn-group' role='group' aria-label='Select period'>
          {PERIODS.map(({ label, value }) => (
            <button
              key={value}
              type='button'
              className={`btn btn-sm ${period === value ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setPeriod(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className='text-danger small'>{error}</p>}

      {loading
        ? (
          <div className='text-center py-5'>
            <Spinner animation='border' size='sm' role='status' />
          </div>
          )
        : (
          <>
            <div className='row g-3 mb-4'>
              <div className='col-4'>
                <div className='bg-body-secondary rounded-3 p-3 text-center'>
                  <div className='fs-4 fw-bold text-primary'>{totals.pomodoros}</div>
                  <div className='text-muted small'>Pomodoros</div>
                </div>
              </div>
              <div className='col-4'>
                <div className='bg-body-secondary rounded-3 p-3 text-center'>
                  <div className='fs-4 fw-bold text-success'>{formatTime(totals.minutesWorked)}</div>
                  <div className='text-muted small'>Time worked</div>
                </div>
              </div>
              <div className='col-4'>
                <div className='bg-body-secondary rounded-3 p-3 text-center'>
                  <div className='fs-4 fw-bold text-warning'>{totals.tasksCompleted}</div>
                  <div className='text-muted small'>Tasks done</div>
                </div>
              </div>
            </div>

            <ProductivityChart
              title='Pomodoros completed'
              data={data}
              dataKey='pomodoros'
              color='var(--bs-primary)'
              unit='🍅'
              period={period}
            />
            <ProductivityChart
              title='Time worked'
              data={data}
              dataKey='minutesWorked'
              color='var(--bs-success)'
              unit='min'
              period={period}
              tickFormatter={timeTickFormatter}
              valueFormatter={timeValueFormatter}
              footnote={`Based on your current work session duration (${workTime} min)`}
            />
            <ProductivityChart
              title='Tasks completed'
              data={data}
              dataKey='tasksCompleted'
              color='var(--bs-warning)'
              unit='tasks'
              period={period}
            />
          </>
          )}

      <Toaster richColors position='bottom-left' theme={isDark ? 'dark' : 'light'} />
    </>
  )
}

export default function StatsPage () {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavBar />
        <main className='container py-4'>
          <DashboardContent />
        </main>
      </AuthProvider>
    </ThemeProvider>
  )
}
