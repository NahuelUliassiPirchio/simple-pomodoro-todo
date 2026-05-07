export function generateDateRange (periodDays) {
  const days = []
  for (let i = periodDays - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    days.push({
      dateString: d.toDateString(),
      isoDate: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })
  }
  return days
}

export function formatTime (minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

export function mergeDailyData (dateRange, pomodoroMap, completionMap, workTime) {
  return dateRange.map(({ dateString, isoDate, label }) => ({
    dateString,
    isoDate,
    label,
    pomodoros: pomodoroMap.get(dateString) ?? 0,
    minutesWorked: (pomodoroMap.get(dateString) ?? 0) * workTime,
    tasksCompleted: completionMap.get(dateString) ?? 0
  }))
}
