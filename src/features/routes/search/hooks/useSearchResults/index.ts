'use client';
import { useCallback, Dispatch, SetStateAction } from 'react';
import { PER_PAGE, DEFAULT_PAGE } from '@/constants/pagination';

type PropType = {
  setSort: Dispatch<SetStateAction<'stars' | 'updated'>>;
  setPage: Dispatch<SetStateAction<number>>;
  setKey: Dispatch<SetStateAction<string>>;
  query: string;
};
export const useSearchResults = ({ setSort, setPage, setKey, query }: PropType) => {
  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const targetSortValue = e.target.value as 'stars' | 'updated';
      setSort(targetSortValue);
      setPage(DEFAULT_PAGE);
      setKey(
        `/search/repositories?q=${query}&sort=${targetSortValue}&per_page=${PER_PAGE}&page=${DEFAULT_PAGE}`
      );
    },
    [query]
  );

  return {
    handleSortChange,
  };
};
