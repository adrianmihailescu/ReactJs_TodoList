import { useEffect, useState, useMemo } from 'react';
import { Box, Grid, Pagination } from '@mui/material';
import FilterPanel from './components/FilterPanel';
import TodoCard from './components/TodoCard';
import { Todo } from './models/todo';
import './App.css';

const itemsPerPage = 10;
const baseUrl = 'http://localhost:5001/api/todos';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortOption, setSortOption] = useState('[All]');
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('All');
  const [isDateAsc, setIsDateAsc] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, [typeFilter]);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${baseUrl}?type=${typeFilter}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('todos', JSON.stringify(data));
      setTodos(data);
    } catch (err) {
      console.error('Failed to load todos:', err);
    }
  };

  const updateTodoStatus = async (todo: Todo, newStatus: string) => {
    try {
      const updatedTodo = { ...todo, status: newStatus };
      const res = await fetch(`${baseUrl}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });

      if (!res.ok) {
        console.error("Failed to update status", res.statusText);
        return;
      }

      fetchTodos(); // fix 1.a: Refresh after update
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // fix 1.c: Filter and sort the todos based on the selected sort option and date
  const filteredSortedTodos = useMemo(() => {
    let filteredItems = [...todos]; // clone to avoid mutating state

    // fix 2.c: Filter todos based on the selected sort option (Active/Done/[All])
    if (sortOption !== '[All]') {
      filteredItems = filteredItems.filter(todo => todo.status === sortOption);
    }

    // fix 3.c: Sort todos by date based on ascending or descending order
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

  // fix 5.c: Paginate the todos after applying the sorting and filtering
  const paginatedTodos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSortedTodos.slice(start, start + itemsPerPage);
  }, [filteredSortedTodos, currentPage]);

  const totalPages = Math.ceil(filteredSortedTodos.length / itemsPerPage);

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100vh' }}>
      {/* Sidebar Filters */}
      <FilterPanel
        sortOption={sortOption}
        setSortOption={setSortOption}
        isDateAsc={isDateAsc}
        setIsDateAsc={setIsDateAsc}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* ToDo List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        <Grid container spacing={2}>
          {/* render from paginatedTodos */}
          {paginatedTodos.map((todo, index) => (
            <Grid item xs={12} md={6} key={todo.id ?? index}>
              <TodoCard
                todo={todo}
                index={index}
                updateTodoStatus={updateTodoStatus}
                currentPage={currentPage}
              />
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      </Box>
    </Box>
  );
}
