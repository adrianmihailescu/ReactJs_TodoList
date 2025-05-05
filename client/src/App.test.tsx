import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';

const mockTodos = [
  {
    id: '1',
    title: 'Test Todo',
    content: 'Test content',
    status: 'Active',
    type: 'Results',
    creationTime: new Date().toISOString(),
    dueDate: null,
  },
];

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => mockTodos,
  } as Response);
});

afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
});

test('renders fetched todos', async () => {
  render(<App />);
  expect(await screen.findByText(/Test Todo/)).toBeInTheDocument();
});
