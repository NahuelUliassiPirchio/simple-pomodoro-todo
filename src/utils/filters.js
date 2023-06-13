import { orderBy } from 'firebase/firestore/lite'

export const filters = {
  none: null,
  crucial: orderBy('crucial', 'desc'),
  completed: orderBy('completed', 'desc'),
  notCompleted: orderBy('completed', 'asc'),
  alphabeticalAscendant: orderBy('text', 'asc'),
  alphabeticalDescendant: orderBy('text', 'desc')
}

export function formatFilterName (filter) {
  filter = filter.replace(/([A-Z])/g, ' $1')
  return filter.charAt(0).toUpperCase() + filter.slice(1)
}
