import { useEffect, useMemo, useState } from 'react';

interface UseSearchProps<T> {
  data: T[];
  searchKeys: (keyof T)[];
  debounceMs?: number;
}

interface UseSearchReturn<T> {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedQuery: string;
  filteredData: T[];
  clearSearch: () => void;
}

export function useSearch<T extends Record<string, any>>({
  data,
  searchKeys,
  debounceMs = 300,
}: UseSearchProps<T>): UseSearchReturn<T> {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Filter data based on debounced query
  const filteredData = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return data;
    }

    const lowerQuery = debouncedQuery.toLowerCase();

    return data.filter((item) => {
      return searchKeys.some((key) => {
        const value = item[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerQuery);
      });
    });
  }, [data, debouncedQuery, searchKeys]);

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    filteredData,
    clearSearch,
  };
}

export default useSearch;
