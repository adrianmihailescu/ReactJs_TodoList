import { useEffect, useMemo, useState } from 'react';
import { Todo } from '../models/todo';
import { fetchTodos } from '../services/todoService';
import { itemsPerPage } from './../config';

export function useTodos(
  typeFilter: string,
  sortOption: string,
  isDateAsc: boolean,
  currentPage: number
) {
  const [todos, setTodos] = useState<Todo[]>([]);

  // fix 2.c: Use hook to fetch todos when typeFilter changes
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodos(typeFilter);
        localStorage.setItem('todos', JSON.stringify(data));
        setTodos(data);
      } catch (err) {
        console.error('Failed to load todos:', err);
      }
    };
    loadTodos();
  }, [typeFilter]);

  // fix 1.f: Filter and sort the todos based on the selected sort option and date
  const filteredSortedTodos = useMemo(() => {
    let filteredItems = [...todos];

    // fix 1.d: Filter todos based on the selected sort option (Active/Done/All)
    if (sortOption !== 'All') {
      filteredItems = filteredItems.filter(todo => todo.status === sortOption);
    }

    // fix 1.f: Sort todos by date based on ascending or descending order
    filteredItems.sort((a, b) => {
      const dateA = new Date(a.dueDate ?? a.creationTime);
      const dateB = new Date(b.dueDate ?? b.creationTime);
      return isDateAsc
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });

    return filteredItems;
  }, [todos, sortOption, isDateAsc]);

  // fix 2.a: Paginate the todos after applying the sorting and filtering
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedTodos = useMemo(() => {
    return filteredSortedTodos.slice(start, start + itemsPerPage);
  }, [filteredSortedTodos, currentPage]);

  const totalPages = Math.ceil(filteredSortedTodos.length / itemsPerPage);

  return {
    todos,
    setTodos,
    filteredSortedTodos,
    paginatedTodos,
    totalPages,
    itemsPerPage,
  };
}
