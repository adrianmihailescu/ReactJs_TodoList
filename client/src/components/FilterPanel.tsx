import React from 'react';
import {
  FormControl, Select, MenuItem, InputLabel, Button, Typography, Box
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { FilterPanelProps } from '../interfaces/FilterPanelProps';

const FilterPanel: React.FC<FilterPanelProps> = ({
  sortOption,
  setSortOption,
  isDateAsc,
  setIsDateAsc,
  typeFilter,
  setTypeFilter,
}) => {
  return (
    <Box sx={{ p: 2, minWidth: 250 }}>
      {/* Fix 2.c - Order by status */}
      <Typography variant="h6" gutterBottom>Order by status:</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={sortOption}
          onChange={(e: SelectChangeEvent<string>) => setSortOption(e.target.value)}
          label="Status"
        >
          <MenuItem value="[All]">[All]</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>
      </FormControl>

      {/* Fix 1.c - Sort by due date */}
      <Typography variant="h6" gutterBottom>Sort by due date:</Typography>
      <Button
        variant="contained"
        onClick={() => setIsDateAsc((prev) => !prev)}
        sx={{ mb: 2 }}
      >
        Sort by Date ({isDateAsc ? 'Asc' : 'Desc'})
      </Button>

      {/* Fix 2.d - Filter by type */}
      <Typography variant="h6" gutterBottom>Filter by type:</Typography>
      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Select
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
  );
};

export default FilterPanel;
