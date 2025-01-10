'use client';
import { useState, useEffect } from 'react';
import useGithubApi from '@/hooks/useGithubApi';
import { RepositoryType } from '../../types/repository';
import { DEFAULT_PAGE } from '@/constants/pagination';

export const useSearchRepositories = () => {
  const [sort, setSort] = useState<'stars' | 'updated'>('stars');
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [key, setKey] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const { data: repositories, isLoading } = useGithubApi<RepositoryType>(key);

  useEffect(() => {
    if (!isLoading && repositories) {
      // 検索結果表示後は画面上部にスクロール
      window.scrollTo({ top: 0 });
    }
  }, [isLoading, repositories]);

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
