import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from './TodoCard';
import { Todo } from './../models/todo';

const todo: Todo = {
  id: '1',
  title: 'Write tests',
  content: 'Test writing',
  status: 'Active',
  type: 'Wins',
  creationTime: 1542111235544,
  dueDate: 1622374526340,
};

test('renders todo data', () => {
  render(
    <TodoCard
      todo={todo}
      index={0}
      currentPage={1}
      updateTodoStatus={jest.fn()}
    />
  );

  expect(screen.getByText(/1. Write tests/)).toBeInTheDocument();
  expect(screen.getByText(/Status: Active/)).toBeInTheDocument();
  expect(screen.getByText(/Test writing/)).toBeInTheDocument();
});

test('clicking "Mark as Done" calls updateTodoStatus', () => {
  const mockFn = jest.fn();
  render(
    <TodoCard
      todo={todo}
      index={0}
      currentPage={1}
      updateTodoStatus={mockFn}
    />
  );
  fireEvent.click(screen.getByText(/Mark as Done/i));
  expect(mockFn).toHaveBeenCalledWith(todo, 'Done');
});
