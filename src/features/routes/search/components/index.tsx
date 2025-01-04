'use client';
import React from 'react';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import Pagination from './Pagination';
import { useSearchRepositories } from '../hooks/useSearchRepositories';
import { usePagination } from '../hooks/usePagination';
import { useSearchForm } from '../hooks/useSearchForm';
import { useSearchResults } from '../hooks/useSearchResults';
import Loading from '@/components/custom/Loading';

export default function Component() {
  const {
    sort,
    setSort,
    page,
    setPage,
    setKey,
    query,
    setQuery,
    repositories,
    isLoading,
  } = useSearchRepositories();

  const { handlePageChange, totalPages, pageNumbers } = usePagination({
    setPage,
    setKey,
    page,
    query,
    sort,
    totalCount: repositories?.totalCount ?? 0,
  });

  const { handleSubmit, handleHistoryClick, clearHistory, searchHistory } = useSearchForm(
    {
      setPage,
      setKey,
      setQuery,
      sort,
    }
  );

  const { handleSortChange } = useSearchResults({
    setSort,
    setPage,
    setKey,
    query,
  });

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
