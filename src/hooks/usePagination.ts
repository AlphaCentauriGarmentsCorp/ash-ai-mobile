import { useMemo, useState } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  initialPage?: number;
  initialEntriesPerPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  entriesPerPage: number;
  currentItems: T[];
  totalPages: number;
  totalItems: number;
  indexOfFirstEntry: number;
  indexOfLastEntry: number;
  setCurrentPage: (page: number) => void;
  setEntriesPerPage: (entries: number) => void;
  handlePageChange: (page: number) => void;
  handleEntriesChange: (entries: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function usePagination<T>({
  data,
  initialPage = 1,
  initialEntriesPerPage = 10,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [entriesPerPage, setEntriesPerPage] = useState(initialEntriesPerPage);

  const paginationData = useMemo(() => {
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentItems = data.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(data.length / entriesPerPage);

    return {
      indexOfLastEntry,
      indexOfFirstEntry,
      currentItems,
      totalPages,
      totalItems: data.length,
    };
  }, [data, currentPage, entriesPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEntriesChange = (entries: number) => {
    setEntriesPerPage(entries);
    setCurrentPage(1); // Reset to first page when changing entries per page
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(paginationData.totalPages);
  const goToNextPage = () => handlePageChange(currentPage + 1);
  const goToPreviousPage = () => handlePageChange(currentPage - 1);

  const hasNextPage = currentPage < paginationData.totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    currentPage,
    entriesPerPage,
    currentItems: paginationData.currentItems,
    totalPages: paginationData.totalPages,
    totalItems: paginationData.totalItems,
    indexOfFirstEntry: paginationData.indexOfFirstEntry,
    indexOfLastEntry: paginationData.indexOfLastEntry,
    setCurrentPage,
    setEntriesPerPage,
    handlePageChange,
    handleEntriesChange,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
  };
}

export default usePagination;
