
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { Todo } from './models/todo';
import './App.css';


export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  // const classes = useStyles();

  useEffect(() => {
    (
      async function () {

        const data = await callApi();
        setTodos(data);

      }()
    )

  }, []) // fix 1.a. Empty dependency array ensures the effect runs only once when the component mounts

  const callApi = async () => {
    const response = await fetch('http://localhost:5001/api/todos');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: 1,
        fontWeight: 'bold',
      }}>
      <Grid container spacing={10}>
        {todos && todos.map((todo) => (
          <Grid item xs={10}>
            <Card >
              <CardContent>
                <Typography color="textPrimary" gutterBottom>
                  {todo.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {new Date(todo.creationTime).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {todo.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>))}
      </Grid>
    </Box>
  );
}




// 30.04.2025
// import React, { useEffect, useState } from 'react';
// import { Box } from '@mui/system';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Grid';
// import FormControl from '@mui/material/FormControl';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import InputLabel from '@mui/material/InputLabel';
// import Button from '@mui/material/Button';  // Import Button to update status

// import { Todo } from './models/todo';
// import './App.css';

// export default function App() {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [sortOption, setSortOption] = useState<string>('active'); // 'active' or 'done'
//   const [dateSortOption, setDateSortOption] = useState<string>('asc'); // 'asc' or 'desc'

//   useEffect(() => {
//     (
//       async function () {

//         const data = await callApi();
//         setTodos(data);

//       }()
//     )

//   }, []); // fix 1.a. Empty dependency array ensures the effect runs only once when the component mounts

//   const callApi = async () => {
//     const response = await fetch('http://localhost:5001/api/todos');
//     const body = await response.json();
//     if (response.status !== 200) throw Error(body.message);
//     return body;
//   };

//   // Handle the change in the dropdown for status sorting 
//   // fix 1.d add status
//   const handleSortChange = (event: SelectChangeEvent<string>) => {
//     setSortOption(event.target.value as string);
//   };

//   // Handle the change in the dropdown for date sorting
//   const handleDateSortChange = (event: SelectChangeEvent<string>) => {
//     setDateSortOption(event.target.value as string);
//   };

//   // Sort todos based on status
//   const sortedTodos = todos
//     .filter(todo => todo.status === sortOption) // Filter based on status
//     .sort((a, b) => {
//       // Sort based on due date in the selected order
//       const dateA = new Date(a.dueDate).getTime();
//       const dateB = new Date(b.dueDate).getTime();
//       return dateSortOption === 'asc' ? dateA - dateB : dateB - dateA;
//     });

//   // Function to handle status change to 'done'
//   // fix 1.e: Add Status Update functionality
//   const handleStatusChange = (id: string) => {
//     const updatedTodos = todos.map(todo => 
//       todo.id === id ? { ...todo, status: 'done' } : todo
//     );
//     setTodos(updatedTodos);  // Update state and re-render with new status
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: { xs: 'column', md: 'row' },
//         alignItems: 'center',
//         bgcolor: 'background.paper',
//         overflow: 'hidden',
//         borderRadius: '12px',
//         boxShadow: 1,
//         fontWeight: 'bold',
//       }}>

//       {/* fix 1.d: add status sorting */}
//       <Box sx={{ marginBottom: '20px' }}>
//         <Typography variant="h6" color="textPrimary" gutterBottom>
//           Order by status:
//         </Typography>
//         <FormControl fullWidth>
//           <InputLabel>Sort by</InputLabel>
//           <Select
//             value={sortOption}
//             onChange={handleSortChange}
//             label="Sort by"
//           >
//             <MenuItem value="active">Active</MenuItem>
//             <MenuItem value="done">Done</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       {/* fix 1.f: add date sorting */}
//       <Box sx={{ marginBottom: '20px' }}>
//         <Typography variant="h6" color="textPrimary" gutterBottom>
//           Sort by date:
//         </Typography>
//         <FormControl fullWidth>
//           <InputLabel>Sort by</InputLabel>
//           <Select
//             value={dateSortOption}
//             onChange={handleDateSortChange}
//             label="Sort by"
//           >
//             <MenuItem value="asc">Ascending</MenuItem>
//             <MenuItem value="desc">Descending</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       {/* fix 1.b: Grid displaying the sorted TODO items */}
//       <Grid container spacing={10}>
//         {sortedTodos.map((todo) => (
//           <Grid item xs={10} key={todo.id}>
//             <Card>
//               <CardContent>
//                 <Typography color="textPrimary" gutterBottom>
//                   {todo.title}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary" component="p">
//                   {new Date(todo.creationTime).toLocaleDateString()}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary" component="p">
//                   {todo.status}
//                 </Typography>
//                 {/* fix 1.c: Display the content of the Todo */}
//                 <Typography variant="body1" color="textPrimary" component="p" sx={{ marginTop: 2 }}>
//                   {todo.content}
//                 </Typography>
//                 {/* fix 1.e: Add a button to change the status to Done */}
//                 {todo.status === 'active' && (
//                   <Button 
//                     variant="contained" 
//                     color="primary" 
//                     onClick={() => handleStatusChange(todo.id)} 
//                     sx={{ marginTop: 2 }}
//                   >
//                     Mark as Done
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }
