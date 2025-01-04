'use client';
import { useCallback, Dispatch, SetStateAction, useMemo } from 'react';
import { DEFAULT_PAGE, GITHUB_API_MAX_PAGE, PER_PAGE } from '@/constants/pagination';

type PropType = {
  setPage: Dispatch<SetStateAction<number>>;
  setKey: Dispatch<SetStateAction<string>>;
  page: number;
  totalCount: number;
  query: string;
  sort: 'stars' | 'updated';
};

export const usePagination = ({
  setPage,
  setKey,
  page,
  query,
  sort,
  totalCount,
}: PropType) => {
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < DEFAULT_PAGE || newPage > GITHUB_API_MAX_PAGE) {
        return;
      }
      setPage(newPage);
      setKey(
        `/search/repositories?q=${query}&sort=${sort}&per_page=${PER_PAGE}&page=${newPage}`
      );
    },
    [query, sort]
  );

  const totalPages = useMemo(
    () => Math.min(GITHUB_API_MAX_PAGE, Math.ceil((totalCount ?? 0) / PER_PAGE)),
    [totalCount]
  );

  const pageNumbers = useMemo(() => {
    const numbers: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      numbers.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    } else {
      numbers.push(DEFAULT_PAGE);
      if (page > 3) {
        numbers.push('ellipsis');
      }
      for (let i = Math.max(2, page - 1); i <= Math.min(page + 1, totalPages - 1); i++) {
        numbers.push(i);
      }
      if (page < totalPages - 2) {
        numbers.push('ellipsis');
      }
      if (page !== totalPages) {
        numbers.push(totalPages);
      }
    }

    return numbers;
  }, [page, totalPages]);

  return {
    handlePageChange,
    totalPages,
    pageNumbers,
  };
};
