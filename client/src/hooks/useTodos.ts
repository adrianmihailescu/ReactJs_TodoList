// hooks/useTodos.ts
import { useEffect, useMemo, useState } from 'react';
import { Todo } from '../models/todo';
import { fetchTodos } from '../services/todoService';

export function useTodos(
  typeFilter: string,
  sortOption: string,
  isDateAsc: boolean,
  currentPage: number
) {
  const [todos, setTodos] = useState<Todo[]>([]);

  // fix 2.c: Use hook to fetch todos when typeFilter changes
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTodos(typeFilter);
        localStorage.setItem('todos', JSON.stringify(data));
        setTodos(data);
      } catch (err) {
        console.error('Failed to load todos:', err);
      }
    };
    load();
  }, [typeFilter]);

  // fix 1.f: Filter and sort the todos based on the selected sort option and date
  const filteredSortedTodos = useMemo(() => {
    let filteredItems = [...todos]; // clone to avoid mutating state

    // fix 1.d: Filter todos based on the selected sort option (Active/Done/[All])
    if (sortOption !== '[All]') {
      filteredItems = filteredItems.filter(todo => todo.status === sortOption);
    }

    // fix 1.f: Sort todos by date based on ascending or descending order
    filteredItems.sort((a, b) => {
      const dateA = new Date(a.dueDate ?? a.creationTime);
      const dateB = new Date(b.dueDate ?? b.creationTime);
      console.log('Date A:', dateA, 'Date B:', dateB);
      return isDateAsc
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });

    return filteredItems;
  }, [todos, sortOption, isDateAsc]);

  // fix 2.a: Paginate the todos after applying the sorting and filtering
  const ITEMS_PER_PAGE = 10;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTodos = useMemo(() => {
    return filteredSortedTodos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSortedTodos, currentPage]);

  const totalPages = Math.ceil(filteredSortedTodos.length / ITEMS_PER_PAGE);

  return {
    todos,
    setTodos,
    filteredSortedTodos,
    paginatedTodos,
    totalPages,
    ITEMS_PER_PAGE,
  };
}
