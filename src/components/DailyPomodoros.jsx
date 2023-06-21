import { getDataById } from '@/services/dbService'
import { useWorkedPomsStore } from '@/stores/globalStore'
import { useEffect } from 'react'

export default function DailyPomodoros ({ user }) {
  const { workedPoms, setWorkedPoms } = useWorkedPomsStore()

  useEffect(() => {
    if (!user) return
    const todayString = new Date().toDateString()
    getDataById(`/users/${user.uid}/dailyPomodoros`, todayString)
      .then(data => setWorkedPoms(data.data().pomodoros))
  }, [user])

  return (
    <div className='me-2 text-white text-end'>
      Today you've worked {workedPoms} 🍅!
    </div>
  )
}