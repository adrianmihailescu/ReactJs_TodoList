import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, InputLabel, Button, Typography, Box } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { FilterPanelProps } from '../interfaces/FilterPanelProps';

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSortOptionChange = (e: SelectChangeEvent<string>) => {
    const newFilters = { ...localFilters, sortOption: e.target.value };
    setLocalFilters(newFilters);
    setFilters(newFilters);  // Updating parent state
  };

  const handleDateSortChange = () => {
    const newFilters = { ...localFilters, isDateAsc: !localFilters.isDateAsc };
    setLocalFilters(newFilters);
    setFilters(newFilters);  // Updating parent state
  };

  const handleTypeFilterChange = (e: SelectChangeEvent<string>) => {
    const newFilters = { ...localFilters, typeFilter: e.target.value };
    setLocalFilters(newFilters);
    setFilters(newFilters);  // Updating parent state
  };

  return (
    <Box sx={{ p: 2, minWidth: 250 }}>
      {/* Order by status */}
      <Typography variant="h6" gutterBottom>Order by status:</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={localFilters.sortOption}
          onChange={handleSortOptionChange}
          label="Status"
        >
          <MenuItem value="[All]">[All]</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>
      </FormControl>

      {/* Sort by due date */}
      <Typography variant="h6" gutterBottom>Sort by due date:</Typography>
      <Button
        variant="contained"
        onClick={handleDateSortChange}
        sx={{ mb: 2 }}
      >
        Sort by Date ({localFilters.isDateAsc ? 'Asc' : 'Desc'})
      </Button>

      {/* Filter by type */}
      <Typography variant="h6" gutterBottom>Filter by type:</Typography>
      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Select
          value={localFilters.typeFilter}
          onChange={handleTypeFilterChange}
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
