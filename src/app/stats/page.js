'use client'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const StatsPage = dynamic(() => import('@/components/StatsPage'), { ssr: false })

export default function Page () {
  useEffect(() => {
    document.title = 'Stats | Pomodoro'
    return () => { document.title = 'Pomodoro' }
  }, [])

  return <StatsPage />
}
