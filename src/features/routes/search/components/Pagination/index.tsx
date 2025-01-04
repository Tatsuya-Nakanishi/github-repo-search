'use client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { DEFAULT_PAGE } from '@/constants/pagination';

type PropType = {
  totalPages: number;
  page: number;
  pageNumbers: (number | 'ellipsis')[];
  handlePageChange: (newPage: number) => void;
};

export default function Component({
  totalPages,
  page,
  pageNumbers,
  handlePageChange,
}: PropType) {
  const canGoPrevious = page > DEFAULT_PAGE;
  const canGoNext = page < totalPages;

  return (
    <div className="mb-4 mt-8 flex justify-center">
      <Pagination>
        <PaginationContent className="flex-wrap justify-center">
          <PaginationItem>
            <PaginationPrevious
              isActive={canGoPrevious}
              onClick={() => handlePageChange(page - 1)}
              className={
                canGoPrevious ? 'cursor-pointer' : 'pointer-events-none opacity-50'
              }
            />
          </PaginationItem>
          {pageNumbers.map((pageNum, index) => (
            <PaginationItem key={index} className="hidden sm:inline-block">
              {pageNum === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={page === pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem className="sm:hidden">
            <PaginationLink>
              {page} / {totalPages}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              isActive={canGoNext}
              onClick={() => handlePageChange(page + 1)}
              className={canGoNext ? 'cursor-pointer' : 'pointer-events-none opacity-50'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
