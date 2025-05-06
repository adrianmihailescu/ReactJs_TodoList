export interface FilterPanelProps {
  filters: {
    sortOption: string;
    typeFilter: string;
    isDateAsc: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    sortOption: string;
    typeFilter: string;
    isDateAsc: boolean;
  }>>;
}