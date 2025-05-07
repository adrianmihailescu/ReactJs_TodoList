import { useQuery } from '@tanstack/react-query'; // fix 2.b optimize database access with caching
import { fetchTodos } from '../services/todoService';
import { itemsPerPage } from './../config';

export const useTodos = (
  typeFilter: string,
  sortOption: string,
  isDateAsc: boolean,
  currentPage: number
) => {
  // fix 2.b: Caching Fetch and cache todos using React Query
  const { data: todos = [], isLoading, refetch } = useQuery({
    queryKey: ['todos', typeFilter, sortOption, isDateAsc], // fix 2.b: Cache key includes typeFilter
    queryFn: () => fetchTodos(typeFilter, sortOption), // fix 2.c: Fetch todos based on typeFilter and sortOption
    staleTime: 5 * 60 * 1000, // fix 2.b: Cache expiration time (5 minutes)
  });

  // fix 1.d, 1.f: Sorting
  let sortedTodos = [...todos];
  let orderByStatusHandled = false;

  if (sortOption !== 'All') {
    sortedTodos.sort((a, b) => {
      if (a.status === sortOption && b.status !== sortOption) return -1;
      if (a.status !== sortOption && b.status === sortOption) return 1;
      return 0;
    });
    orderByStatusHandled = true;
  }  

  // fix 1.d, 1.f: Sort todos by date based on ascending or descending order
  if (!orderByStatusHandled) {
    if (isDateAsc) {
      sortedTodos.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else {
      sortedTodos.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    }
  }

  // fix 2.a: Paginate the todos after applying the sorting and filtering
  const paginatedTodos = sortedTodos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedTodos.length / itemsPerPage);

  return {
    paginatedTodos,
    totalPages,
    loading: isLoading,
    refetch, // refetch function from useQuery
  };
};
