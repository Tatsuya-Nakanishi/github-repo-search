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
import { DEFAULT_PAGE, GITHUB_API_MAX_PAGE, PER_PAGE } from '@/constants/pagination';

type PropType = {
  totalCount: number;
  page: number;
  handlePageChange: (newPage: number) => void;
};

export default function Component({ totalCount, page, handlePageChange }: PropType) {
  return (
    <div className="mb-4 mt-8 flex justify-center">
      <Pagination>
        <PaginationContent className="flex-wrap justify-center">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > DEFAULT_PAGE) {
                  handlePageChange(page - 1);
                }
              }}
              className={page <= DEFAULT_PAGE ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          {(() => {
            const totalPages = Math.min(
              GITHUB_API_MAX_PAGE,
              Math.ceil(totalCount / PER_PAGE)
            );
            const pageNumbers: (number | 'ellipsis')[] = [];

            if (totalPages <= 7) {
              pageNumbers.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
            } else {
              pageNumbers.push(DEFAULT_PAGE);
              if (page > 3) {
                pageNumbers.push('ellipsis');
              }
              for (
                let i = Math.max(2, page - 1);
                i <= Math.min(page + 1, totalPages - 1);
                i++
              ) {
                pageNumbers.push(i);
              }
              if (page < totalPages - 2) {
                pageNumbers.push('ellipsis');
              }
              if (page !== totalPages) {
                pageNumbers.push(totalPages);
              }
            }

            return pageNumbers.map((pageNum, index) => (
              <PaginationItem key={index} className="hidden sm:inline-block">
                {pageNum === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={page === pageNum}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNum);
                    }}
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ));
          })()}
          <PaginationItem className="sm:hidden">
            <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
              {page} / {Math.min(GITHUB_API_MAX_PAGE, Math.ceil(totalCount / PER_PAGE))}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (
                  page < Math.min(GITHUB_API_MAX_PAGE, Math.ceil(totalCount / PER_PAGE))
                ) {
                  handlePageChange(page + 1);
                }
              }}
              className={
                page >= Math.min(GITHUB_API_MAX_PAGE, Math.ceil(totalCount / PER_PAGE))
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
