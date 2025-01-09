'use client';
import { useCallback, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { DEFAULT_PAGE, PER_PAGE } from '@/constants/pagination';

type PropType = {
  setPage: Dispatch<SetStateAction<number>>;
  setKey: Dispatch<SetStateAction<string>>;
  setQuery: Dispatch<SetStateAction<string>>;
  sort: 'stars' | 'updated';
};

const HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 5;

export const useSearchForm = ({ setPage, setKey, setQuery, sort }: PropType) => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 検索フォームの送信
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

  // 履歴の保存
  const addToHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setSearchHistory((prev) => {
      const newHistory = [
        searchQuery,
        ...prev.filter((item) => item !== searchQuery),
      ].slice(0, MAX_HISTORY_ITEMS);

      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  // 履歴から検索
  const handleHistoryClick = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(DEFAULT_PAGE);
    setKey(
      `/search/repositories?q=${searchQuery}&sort=${sort}&per_page=${PER_PAGE}&page=${DEFAULT_PAGE}`
    );
  };

  // 履歴の全削除
  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setSearchHistory([]);
  };

  useEffect(() => {
    // ローカルストレージから履歴を取得
    const history = localStorage.getItem(HISTORY_KEY);
    if (history) {
      setSearchHistory(JSON.parse(history) as string[]);
    }
  }, []);

  return {
    handleSubmit,
    handleHistoryClick,
    clearHistory,
    searchHistory,
  };
};
