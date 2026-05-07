import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore/lite'
import { db } from '@/firebase/firebaseInit'
import { getDataById } from '@/services/dbService'
import { useAuthContext } from '@/contexts/AuthContext'
import { useSettingsStore } from '@/stores/globalStore'
import { generateDateRange, mergeDailyData } from '@/utils/dashboardUtils'

export default function useDashboardData (period) {
  const { user } = useAuthContext()
  const workTime = useSettingsStore(state => state.workTime)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const dateRange = generateDateRange(period)

        const [pomodoroResults, todosSnapshot] = await Promise.all([
          Promise.allSettled(
            dateRange.map(d => getDataById(`users/${user.uid}/dailyPomodoros`, d.dateString))
          ),
          getDocs(collection(db, `users/${user.uid}/todos`))
        ])

        const pomodoroMap = new Map()
        pomodoroResults.forEach((result, i) => {
          const count = result.status === 'fulfilled' && result.value.exists()
            ? result.value.data().pomodoros
            : 0
          pomodoroMap.set(dateRange[i].dateString, count)
        })

        const completionMap = new Map()
        todosSnapshot.docs.forEach(doc => {
          const { completedAt } = doc.data()
          if (completedAt) {
            const dateStr = new Date(completedAt).toDateString()
            completionMap.set(dateStr, (completionMap.get(dateStr) || 0) + 1)
          }
        })

        setData(mergeDailyData(dateRange, pomodoroMap, completionMap, workTime))
      } catch (err) {
        setError('Failed to load stats. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, period, workTime])

  return { data, loading, error }
}
