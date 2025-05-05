import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { TodoCardProps } from './../interfaces/TodoCardProps';



const TodoCard: React.FC<TodoCardProps> = ({ todo, index, updateTodoStatus, currentPage }) => {
  return (
    <Card sx={{ border: '1px solid black', borderRadius: '8px' }}>
      <CardContent>
        <Typography variant="h6">
          {(currentPage - 1) * 10 + index + 1}. {todo.title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Created: {new Date(todo.creationTime).toLocaleDateString()}
        </Typography>
        <Typography>Status: {todo.status}</Typography>
        <Typography sx={{ mt: 1 }}>{todo.content}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>Type: {todo.type}</Typography>

        {/* Fix 2.e - Mark Todo as Done */}
        {todo.status === 'Active' && (
          <Button sx={{ mt: 2 }} variant="outlined" onClick={() => updateTodoStatus(todo, 'Done')}>
            Mark as Done
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoCard;
