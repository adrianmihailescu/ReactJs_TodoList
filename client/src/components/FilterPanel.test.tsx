import { render, screen, fireEvent, within } from '@testing-library/react';
import FilterPanel from './FilterPanel';
import '@testing-library/jest-dom';

describe('FilterPanel', () => {
  const defaultFilters = {
    sortOption: 'All',
    isDateAsc: false,
    typeFilter: 'All',
  };

  let setFiltersMock: jest.Mock;

  beforeEach(() => {
    setFiltersMock = jest.fn();
    render(<FilterPanel filters={defaultFilters} setFilters={setFiltersMock} />);
  });

  test('renders all sort controls', () => {
    expect(screen.getByText(/Order by status/i)).toBeInTheDocument();
    expect(screen.getByText(/Sort by due date/i)).toBeInTheDocument();
  });

  test('renders all filter controls', () => {
    expect(screen.getByText(/Filter by type/i)).toBeInTheDocument();
  });

  test('toggles isDateAsc', () => {
    fireEvent.click(screen.getByRole('button', { name: /Sort by Date/i }));

    expect(setFiltersMock).toHaveBeenCalledWith(
      expect.objectContaining({
        isDateAsc: true,
      })
    );
  });  
});
