import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from './FilterPanel';

const defaultProps = {
  sortOption: '[All]',
  setSortOption: jest.fn(),
  isDateAsc: false,
  setIsDateAsc: jest.fn(),
  typeFilter: 'All',
  setTypeFilter: jest.fn(),
};

test('renders filter controls', () => {
  render(<FilterPanel {...defaultProps} />);
  expect(screen.getByText(/Order by status/i)).toBeInTheDocument();
  expect(screen.getByText(/Sort by Date/i)).toBeInTheDocument();
  expect(screen.getByText(/Filter by type/i)).toBeInTheDocument();
});

test('toggles date sort direction', () => {
  render(<FilterPanel {...defaultProps} />);
  fireEvent.click(screen.getByText(/Sort by Date/i));
  expect(defaultProps.setIsDateAsc).toHaveBeenCalled();
});
