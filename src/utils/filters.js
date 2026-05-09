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
  crucial: {
    icon: '⭐',
    title: 'No crucial todos',
    description: 'Star a todo to mark it as crucial and see it here.'
  },
  completed: {
    icon: '✅',
    title: 'Nothing completed yet',
    description: 'Finish a todo to see your progress here.'
  },
  notCompleted: {
    icon: '🎉',
    title: 'All caught up!',
    description: "No pending todos — you're on top of everything."
  }
}

export const draggableFilters = new Set(['none', 'crucial', 'completed', 'notCompleted'])

export function formatFilterName (filter) {
  if (filter === 'none') return 'All'
  filter = filter.replace(/([A-Z])/g, ' $1')
  return filter.charAt(0).toUpperCase() + filter.slice(1)
}
