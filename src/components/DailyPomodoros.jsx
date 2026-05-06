import { getDataById } from '@/services/dbService'
import { useWorkedPomsStore } from '@/stores/globalStore'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function DailyPomodoros ({ user }) {
  const { workedPoms, setWorkedPoms } = useWorkedPomsStore()

  useEffect(() => {
    if (!user) return
    const todayString = new Date().toDateString()
    getDataById(`/users/${user.uid}/dailyPomodoros`, todayString)
      .then(data => {
        setWorkedPoms(data.data()?.pomodoros || 0)
      })
      .catch(() => {
        toast.error('Failed to load daily pomodoro count.')
      })
  }, [user, setWorkedPoms])

  return (
    <div className='me-2 text-white text-end'>
      Today you've worked {workedPoms} 🍅!
    </div>
  )
}
