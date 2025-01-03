'use client';
import { PER_PAGE, DEFAULT_PAGE } from '@/constants/pagination';

type PropType = {
  setSort: (sort: 'stars' | 'updated') => void;
  setPage: (page: number) => void;
  setKey: (key: string) => void;
  query: string;
};

export const useSearchResults = ({ setSort, setPage, setKey, query }: PropType) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetSortValue = e.target.value as 'stars' | 'updated';
    setSort(targetSortValue);
    setPage(DEFAULT_PAGE);
    setKey(
      `/search/repositories?q=${query}&sort=${targetSortValue}&per_page=${PER_PAGE}&page=${DEFAULT_PAGE}`
    );
  };

  return {
    handleSortChange,
  };
};
