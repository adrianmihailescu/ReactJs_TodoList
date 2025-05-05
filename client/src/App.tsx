
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';

import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

// models
import { Todo } from './models/todo';

// styles
import './App.css';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortOption, setSortOption] = useState<string>('[All]'); // fix 1d
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [sortByDate, setSortByDate] = useState(true); // fix 1.f whether sorting bydate is active
  const [isDateAsc, setIsDateAsc] = useState(false); // sort direction toggle

  const itemsPerPage = 10; // Pagination items per page
  const baseUrl = 'http://localhost:5001/api/todos'; // Base URL for API

  useEffect(() => {
    loadTodos(); // Load todos when the component mounts
  }, [typeFilter]); // fix 1.a Empty dependency array to only run once on mount

  const callApi = async (type?: string) => {
    let url = `${baseUrl}?type=${type}`;
    const response = await fetch(url);
    const body = await response.json();
  
    if (response.status !== 200)
      throw Error(body.message);

    return body;
  };
  

    // fix 2.d Fetch todos from the API and store them in localStorage
    const loadTodos = async () => {
      try {
        const data = await callApi(typeFilter);
        localStorage.setItem('todos', JSON.stringify(data));
        setTodos(data);
      } catch (error) {
        console.error('Error loading todos from API:', error);
      }
    };   

  // fix 1.e: Add Status Update functionality
  const updateTodoStatus = async (todo: Todo, newStatus: string) => {
    try {
      const updatedTodo = {
        ...todo,
        status: newStatus,
      };
  
      const response = await fetch(`${baseUrl}/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });
  
      if (!response.ok) {
        console.error("Failed to update status", response.statusText);
        return;
      }
  
      const updatedTodos = await callApi();
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };

  // fix 1.d add status
  // Handle the change in the dropdown for status sorting 
  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOption(event.target.value as string);
        // Sort todos based on status: active -> done
        todos
          .filter(todo => todo.status === event.target.value) // Filter based on status
          .sort((a, b) => {
            const dateA = new Date(a.creationTime).getTime();
            const dateB = new Date(b.creationTime).getTime();
            return dateA - dateB;
          }); // fix 1.d

    setItemsCount(Math.ceil(
        todos.filter(todo => todo.status === sortOption || sortOption === "[All]").length / itemsPerPage
      ));
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: 1,
        fontWeight: 'bold',
        height: '100vh',
      }}>
  
      {/* fix 1.d: add status sorting */}
      <Box sx={{ margin: 2, minWidth: 200 }}>
        <Typography variant="h6" color="textPrimary" gutterBottom>
          Order by status:
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="status-select-label">Sort by</InputLabel>
          <Select
            labelId="status-select-label"
            value={sortOption}
            onChange={handleSortChange}
            label="Sort by"
          >
            <MenuItem value="[All]">[All]</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>
      </Box>
  
      {/* fix 1.b: Grid displaying the sorted TODO items */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '100vh', p: 1 }}>
          <Box sx={{ margin: 2 }}>
      <Typography variant="h6" color="textPrimary" gutterBottom>
        Sort by due date:
      </Typography>
      <button
        onClick={() => {
          setSortByDate(true);
          setIsDateAsc(prev => !prev); // toggle asc/desc
        }}
        style={{
          padding: '8px 12px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Sort by date ({isDateAsc ? 'Desc' : 'Asc'})
      </button>
    </Box>
    <Box sx={{ margin: 2, minWidth: 200 }}>
                        <Typography variant="h6" color="textPrimary" gutterBottom>
                          Filter by type:
                        </Typography>
                        <FormControl fullWidth>
                          <InputLabel id="type-select-label">Type</InputLabel>
                          <Select
                            labelId="type-select-label"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            label="Type"
                          >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Results">Results</MenuItem>
                            <MenuItem value="Wins">Wins</MenuItem>
                            <MenuItem value="Withdraw">Withdraw</MenuItem>
                          </Select>
                        </FormControl>
                        </Box>
        <Grid container rowSpacing={0} columnSpacing={1.25}>
          {todos && todos
          .filter(todo => todo.status === sortOption || sortOption === "[All]")
          .sort((a, b) => {
            if (!sortByDate) {
              // original sorting (by creation date asc)
              return new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime();
            }

            const dateA = new Date(a.dueDate ?? a.creationTime).getTime();
            const dateB = new Date(b.dueDate ?? b.creationTime).getTime();

            return isDateAsc ? dateA - dateB : dateB - dateA;
          })
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) // paginate
            .map((todo, index) => (
              <Grid item xs={10} key={todo.id ?? index}>
                <Card sx={{
                  maxHeight: 250, display: 'flex', flexDirection: 'column', border: '1px solid black', borderRadius: '8px', marginBottom: 2, marginLeft: 2 }}>
                  <CardContent sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  padding: 1,
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                    cursor: 'pointer',
                  },
                }}>
                  {(currentPage - 1) * 10 + index+1}
                    <Typography color="textPrimary" gutterBottom>
                      {todo.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {new Date(todo.creationTime).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {todo.status}
                    </Typography>
                    {/* fix 1.c: Display the content of the Todo */}
                    <Typography variant="body1" color="textPrimary" component="p" sx={{ marginTop: 2 }}>
                      {todo.content}
                    </Typography>
                    {/* fix 2.c filter by type */}
                    <Typography variant="body1" color="textPrimary" component="p" sx={{ marginTop: 2 }}>
                      {todo.type}
                    </Typography>
                      {/* fix 1.e: Add status update button */}
                  {todo.status === 'Active' && (
                    <Box sx={{ marginTop: 1 }}>
                        <button onClick={() => updateTodoStatus(todo, 'Done')}>
                          Mark as Done
                        </button>
                        </Box>               
                  )}
                  </CardContent>
                </Card>
                <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 2 }}>
              </Typography>
              </Grid>
            ))}
        </Grid>
          {/* fix 1.f: Pagination control */}
    <Box sx={{ display: 'flex', justifyContent: 'center'}}>
      <Pagination
        count={itemsCount}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"      
      />
    </Box>
  </Box>
    </Box>
  );  
}