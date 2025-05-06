import { useState } from 'react';
import { Box, Grid, Pagination } from '@mui/material';
import FilterPanel from './components/FilterPanel';
import TodoCard from './components/TodoCard';
import { Todo } from './models/todo';
import './App.css';
import { useTodos } from './hooks/useTodos';
import { fetchTodos } from './services/todoService';
import { baseUrl } from './config';

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    sortOption: 'All',
    typeFilter: 'All',
    isDateAsc: false,
  });

  // Using the useTodos hook
  const {
    setTodos,
    paginatedTodos,
    totalPages,
  } = useTodos(filters.typeFilter, filters.sortOption, filters.isDateAsc, currentPage);

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

      setTodos(await fetchTodos(filters.typeFilter));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100vh' }}>
      {/* Sidebar Filters */}
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
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
