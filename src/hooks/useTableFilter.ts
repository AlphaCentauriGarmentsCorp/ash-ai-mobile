import { useMemo, useState } from 'react';

type FilterValue = string | number | boolean;

interface FilterConfig {
  [key: string]: FilterValue;
}

interface UseTableFilterProps<T> {
  data: T[];
  initialFilters?: FilterConfig;
}

interface UseTableFilterReturn<T> {
  filters: FilterConfig;
  filteredData: T[];
  setFilter: (key: string, value: FilterValue) => void;
  setFilters: (filters: FilterConfig) => void;
  resetFilters: () => void;
  clearFilter: (key: string) => void;
}

export function useTableFilter<T extends Record<string, any>>({
  data,
  initialFilters = {},
}: UseTableFilterProps<T>): UseTableFilterReturn<T> {
  const [filters, setFiltersState] = useState<FilterConfig>(initialFilters);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        // If filter value is 'all' or empty, don't filter
        if (value === 'all' || value === '' || value === null || value === undefined) {
          return true;
        }

        // Get the item value for this filter key
        const itemValue = item[key];

        // Handle different comparison types
        if (typeof value === 'string' && typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }

        return itemValue === value;
      });
    });
  }, [data, filters]);

  const setFilter = (key: string, value: FilterValue) => {
    setFiltersState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setFilters = (newFilters: FilterConfig) => {
    setFiltersState(newFilters);
  };

  const resetFilters = () => {
    setFiltersState(initialFilters);
  };

  const clearFilter = (key: string) => {
    setFiltersState((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  return {
    filters,
    filteredData,
    setFilter,
    setFilters,
    resetFilters,
    clearFilter,
  };
}

export default useTableFilter;
