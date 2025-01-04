'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import useGithubApi from '@/hooks/useGithubApi';
import { RepositoryType } from '@/types/repository';
import { DEFAULT_PAGE, PER_PAGE, GITHUB_API_MAX_PAGE } from '@/constants/pagination';

const HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 5;

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
      addToHistory(searchQuery);
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

  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const history = localStorage.getItem(HISTORY_KEY);
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // 履歴の保存
  const addToHistory = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setSearchHistory((prev) => {
      const newHistory = [
        searchQuery,
        ...prev.filter((item) => item !== searchQuery),
      ].slice(0, MAX_HISTORY_ITEMS);

      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // 履歴から検索
  const handleHistoryClick = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    setPage(DEFAULT_PAGE);
    setKey(
      `/search/repositories?q=${searchQuery}&sort=${sort}&per_page=${PER_PAGE}&page=${DEFAULT_PAGE}`
    );
  }, []);

  // 履歴の全削除
  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setSearchHistory([]);
  }, []);

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
    searchHistory,
    handleHistoryClick,
    clearHistory,
  };
};
