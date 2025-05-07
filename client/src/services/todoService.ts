import { Todo } from './../models/todo';
import { baseUrl } from './../config';

export async function updateTodoStatus(todo: Todo, newStatus: string) {
  try {
    const updatedTodo = { ...todo, status: newStatus };
    const result = await fetch(`${baseUrl}/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo),
    });

    if (!result.ok) {
      throw new Error(`Failed to update status. Status: ${result.status}`);
    }

    return true;
  } catch (err) {
    console.error('Error updating status:', err);
    return false;
  }
}

export const fetchTodos = async (typeFilter: string) => {
  
    try {
      const result = await fetch(`${baseUrl}?type=${typeFilter}`);
      const data = await result.json();
  
      if (!result.ok) {
        throw new Error(data.message || 'Failed to fetch todos');
      }
  
      return data;
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      throw err;
    }
  };
  
