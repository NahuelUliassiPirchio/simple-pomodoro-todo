import { orderBy, where } from 'firebase/firestore/lite'

export const filters = {
  none: null,
  crucial: where('crucial', '==', true),
  completed: where('completed', '==', true),
  notCompleted: where('completed', '==', false),
  alphabeticalAscendant: orderBy('text', 'asc'),
  alphabeticalDescendant: orderBy('text', 'desc')
}

export const filterEmptyMessages = {
  crucial: 'You have no crucial todos',
  completed: 'You have no completed todos',
  notCompleted: 'You have no pending todos'
}

export const draggableFilters = new Set(['none', 'crucial', 'completed', 'notCompleted'])

export function formatFilterName (filter) {
  filter = filter.replace(/([A-Z])/g, ' $1')
  return filter.charAt(0).toUpperCase() + filter.slice(1)
}
