export interface FilterPanelProps {
  sortOption: string;
  setSortOption: React.Dispatch<React.SetStateAction<string>>;
  isDateAsc: boolean;
  setIsDateAsc: React.Dispatch<React.SetStateAction<boolean>>;
  typeFilter: string;
  setTypeFilter: React.Dispatch<React.SetStateAction<string>>;
}