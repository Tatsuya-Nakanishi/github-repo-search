'use client';
import { useState } from 'react';
import useGithubApi from '@/hooks/useGithubApi';
import { RepositoryType } from '@/types/repository';
import { DEFAULT_PAGE } from '@/constants/pagination';

export const useSearchRepositories = () => {
  const [sort, setSort] = useState<'stars' | 'updated'>('stars');
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [key, setKey] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const { data: repositories, isLoading } = useGithubApi<RepositoryType>(key);

  return {
    sort,
    setSort,
    page,
    setPage,
    setKey,
    query,
    setQuery,
    repositories,
    isLoading,
  };
};
