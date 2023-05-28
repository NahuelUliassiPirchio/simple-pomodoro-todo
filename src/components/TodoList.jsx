import { getData } from '@/services/dbService'
import TodoListItem from './TodoListItem'

async function getTodos () { // TODO: move to service or hook
  let todos
  try {
    todos = await getData('todos')
    todos = todos.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })
    return todos
  } catch (error) {
    console.log(error) // TODO: handle error
  }

  return {
    todos
  }
}

export default async function TodoList () {
  const todos = await getTodos()
  return (
    <ul className='list-group'>
      {
        todos &&
        todos.map(todo => <TodoListItem key={todo.id} {...todo} />)
      }
    </ul>
  )
}
