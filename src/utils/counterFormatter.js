export function formatCounterDigit (counter) {
  return counter < 10 ? `0${counter}` : counter
}

export function calculateMinutes (timeInS) {
  return Math.floor(timeInS / 60)
}

export function calculateResidualSeconds (timeInS) {
  return Math.floor((timeInS % 60))
}
