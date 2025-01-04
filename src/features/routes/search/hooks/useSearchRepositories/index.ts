'use client';
import { useState, useCallback, useMemo } from 'react';
import useGithubApi from '@/hooks/useGithubApi';
import { RepositoryType } from '@/types/repository';
import { DEFAULT_PAGE, PER_PAGE, GITHUB_API_MAX_PAGE } from '@/constants/pagination';

export const useSearchRepositories = () => {
  const [sort, setSort] = useState<'stars' | 'updated'>('stars');
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [key, setKey] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const { data: repositories, isLoading } = useGithubApi<RepositoryType>(key);

  const totalPages = useMemo(
    () =>
      Math.min(
        GITHUB_API_MAX_PAGE,
        Math.ceil((repositories?.totalCount ?? 0) / PER_PAGE)
      ),
    [repositories?.totalCount]
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

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const searchQuery = formData.get('query') as string;

      setPage(DEFAULT_PAGE);
      setKey(
        searchQuery
          ? `/search/repositories?q=${searchQuery}&sort=${sort}&per_page=${PER_PAGE}&page=${DEFAULT_PAGE}`
          : ''
      );
    },
    [sort]
  );

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

  return {
    sort,
    page,
    query,
    setQuery,
    repositories,
    isLoading,
    totalPages,
    pageNumbers,
    handleSubmit,
    handleSortChange,
    handlePageChange,
  };
};
