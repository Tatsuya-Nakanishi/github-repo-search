'use client';
import { DEFAULT_PAGE, GITHUB_API_MAX_PAGE, PER_PAGE } from '@/constants/pagination';

type PropType = {
  setPage: (page: number) => void;
  setKey: (key: string) => void;
  query: string;
  sort: 'stars' | 'updated';
};

export const usePagination = ({ setPage, setKey, query, sort }: PropType) => {
  const handlePageChange = (newPage: number) => {
    if (newPage < DEFAULT_PAGE || newPage > GITHUB_API_MAX_PAGE) {
      return;
    }
    setPage(newPage);
    setKey(
      `/search/repositories?q=${query}&sort=${sort}&per_page=${PER_PAGE}&page=${newPage}`
    );
  };

  return {
    handlePageChange,
  };
};
