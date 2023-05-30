import { getData } from '@/services/dbService'
import TodoListItem from './TodoListItem'

export default async function TodoList () {
  const todos = await getData('todos')

  return (
    <ul className='list-group'>
      {
        todos &&
        todos.map(todo => <TodoListItem key={todo.id} todo={todo} />)
      }
    </ul>
  )
}
