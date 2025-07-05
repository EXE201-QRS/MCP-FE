import { useState, useCallback, useMemo } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
}

interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  resetPagination: () => void;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  onPageChange,
}: UsePaginationProps = {}): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      onPageChange?.(page, pageSize);
    },
    [pageSize, onPageChange]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
      onPageChange?.(1, size);
    },
    [onPageChange]
  );

  const resetPagination = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
    onPageChange?.(initialPage, initialPageSize);
  }, [initialPage, initialPageSize, onPageChange]);

  return {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    handlePageChange,
    handlePageSizeChange,
    resetPagination,
  };
}

// Hook for client-side filtering with pagination awareness
interface UseClientFilterProps<T> {
  data: T[];
  searchTerm: string;
  statusFilter: string;
  searchFields: string[];
  statusField: keyof T;
}

export function useClientFilter<T extends Record<string, any>>({
  data,
  searchTerm,
  statusFilter,
  searchFields,
  statusField,
}: UseClientFilterProps<T>) {
  return useMemo(() => {
    return data.filter((item) => {
      // Search filter
      const matchesSearch = searchTerm === '' || searchFields.some((field) => {
        const fieldValue = field.includes('.') 
          ? field.split('.').reduce((obj: any, key: string) => obj?.[key], item)
          : item[field];
        
        return fieldValue?.toString()?.toLowerCase()?.includes(searchTerm.toLowerCase());
      });

      // Status filter
      const matchesStatus = statusFilter === 'all' || item[statusField] === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, statusFilter, searchFields, statusField]);
}
