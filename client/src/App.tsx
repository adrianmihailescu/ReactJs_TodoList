import { useState } from 'react';
import { Box, Grid, Pagination, CircularProgress } from '@mui/material';
import FilterPanel from './components/FilterPanel';
import TodoCard from './components/TodoCard';
import { Todo } from './models/todo';
import './App.css';
import { useTodos } from './hooks/useTodos';
import { updateTodoStatus } from './services/todoService';

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    sortOption: 'All',
    typeFilter: 'All',
    isDateAsc: false,
  });

  // Using the useTodos hook
  const {
    paginatedTodos,
    totalPages,
    loading,
    refetch, // fix 2.b: Use React Query's refetch method to fetch updated todos
  } = useTodos(filters.typeFilter, filters.sortOption, filters.isDateAsc, currentPage);

  const handleUpdateTodoStatus = async (todo: Todo, newStatus: string) => {
    const success = await updateTodoStatus(todo, newStatus);
    if (success) {
      await refetch();
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
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%', // full height of parent
                mt: 4,
              }}
            >
              <Box sx={{ mb: 2, fontSize: '1.2rem' }}>Loading TODOs...</Box>
              <CircularProgress />
            </Box>
          ) : paginatedTodos.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>No TODOs found.</Box>
          ) : (
            <>
              <Grid container spacing={2}>
                {paginatedTodos.map((todo, index) => (
                  <Grid item xs={12} md={6} key={todo.id ?? index}>
                    <TodoCard
                      todo={todo}
                      index={index}
                      updateTodoStatus={handleUpdateTodoStatus}
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
            </>
          )}
        </Box>
      </Box>
  );
}
