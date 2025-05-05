import { Todo } from '../models/todo';
import { baseUrl } from './../config';

export async function updateTodoStatus(todo: Todo, newStatus: string) {
  try {
    const updatedTodo = { ...todo, status: newStatus };
    const res = await fetch(`${baseUrl}/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo),
    });

    if (!res.ok) {
      throw new Error('Failed to update status');
    }

    return true;
  } catch (err) {
    console.error('Error updating status:', err);
    return false;
  }
}

export const fetchTodos = async (typeFilter: string) => {
  
    try {
      const res = await fetch(`${baseUrl}?type=${typeFilter}`);
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch todos');
      }
  
      return data; // Return the fetched todos
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      throw err; // Rethrow error so it can be handled by calling component or hook
    }
  };
  
