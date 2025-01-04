'use client';
import React, { useEffect } from 'react';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import Pagination from './Pagination';
import { useSearchRepositories } from '../hooks/useSearchRepositories';
import Loading from '@/components/custom/Loading';

export default function Component() {
  const {
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
  } = useSearchRepositories();

  useEffect(() => {
    if (!isLoading && repositories) {
      // 検索結果表示後は画面上部にスクロール
      window.scrollTo({ top: 0 });
    }
  }, [isLoading, repositories]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      {isLoading && <Loading />}
      <h1 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
        GitHub リポジトリ検索
      </h1>
      <SearchForm
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        handleSubmit={handleSubmit}
        placeholder="リポジトリを検索..."
        searchHistory={searchHistory}
        handleHistoryClick={handleHistoryClick}
        clearHistory={clearHistory}
      />
      <div className="space-y-4">
        {repositories ? (
          repositories.totalCount > 0 ? (
            <>
              <SearchResults
                repositories={repositories}
                sort={sort}
                handleSortChange={handleSortChange}
              />
              <Pagination
                page={page}
                totalPages={totalPages}
                pageNumbers={pageNumbers}
                handlePageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-xl font-bold sm:text-3xl">
                検索結果がありませんでした
              </h1>
            </div>
          )
        ) : (
          <div className="text-center">
            <h1 className="text-xl font-bold sm:text-3xl">検索してください</h1>
          </div>
        )}
      </div>
    </div>
  );
}
