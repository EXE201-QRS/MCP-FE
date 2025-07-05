import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationControlsProps) {
  // Generate page numbers to show
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7; // Total visible page buttons
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      if (currentPage <= 4) {
        // Show first 5 pages, ellipsis, and last page
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        if (totalPages > 6) {
          pages.push("...");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 3) {
        // Show first page, ellipsis, and last 5 pages
        pages.push(1);
        if (totalPages > 6) {
          pages.push("...");
        }
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current page range, ellipsis, last page
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageClick = (page: number) => {
    if (!disabled && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageClick(currentPage - 1)}
            className={
              disabled || currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {visiblePages.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => handlePageClick(page as number)}
                isActive={page === currentPage}
                size="icon"
                className={
                  disabled
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageClick(currentPage + 1)}
            className={
              disabled || currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

// Additional pagination info component
interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  itemName?: string;
}

export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  limit,
  itemName = "mục",
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="text-sm text-muted-foreground">
      Hiển thị {startItem} - {endItem} trong tổng số {totalItems} {itemName}
      {totalPages > 1 && ` (Trang ${currentPage}/${totalPages})`}
    </div>
  );
}
