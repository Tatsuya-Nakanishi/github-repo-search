'use client';
import React, { useState, useEffect } from 'react';
import { StarIcon, EyeIcon, GitForkIcon, AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import useGithubApi from '@/hooks/useGithubApi';
import Loading from '@/components/custom/Loading';
import { PER_PAGE, DEFAULT_PAGE, GITHUB_API_MAX_PAGE } from '@/constants/pagination';
import { RepositoryType } from '@/types/repository';

const GITHUB_SEARCH_REPOSITORIES_ENDPOINT = '/search/repositories';

const sortOptions = [
  { name: 'スター順', value: 'stars' },
  { name: '新着順', value: 'updated' },
];

export default function Component() {
  const [sort, setSort] = useState<'stars' | 'updated'>('stars');
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [searchKey, setSearchKey] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: repositories, isLoading } = useGithubApi<RepositoryType>(searchKey);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('query') as string;
    setPage(DEFAULT_PAGE);
    setSearchKey(
      searchQuery
        ? `${GITHUB_SEARCH_REPOSITORIES_ENDPOINT}?q=${searchQuery}&sort=${sort}&per_page=${PER_PAGE}&page=${DEFAULT_PAGE}`
        : ''
    );
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetSortValue = e.target.value as 'stars' | 'updated';
    setSort(targetSortValue);
    setPage(DEFAULT_PAGE);
    setSearchKey(
      `${GITHUB_SEARCH_REPOSITORIES_ENDPOINT}?q=${searchQuery}&sort=${targetSortValue}&per_page=${PER_PAGE}&page=${DEFAULT_PAGE}`
    );
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < DEFAULT_PAGE || newPage > GITHUB_API_MAX_PAGE) {
      return;
    }
    setPage(newPage);
    setSearchKey(
      `${GITHUB_SEARCH_REPOSITORIES_ENDPOINT}?q=${searchQuery}&sort=${sort}&per_page=${PER_PAGE}&page=${newPage}`
    );
  };
  useEffect(() => {
    if (!isLoading && repositories) {
      window.scrollTo({ top: 0 });
    }
  }, [isLoading, repositories]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      {isLoading && <Loading />}
      <h1 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
        GitHub リポジトリ検索
      </h1>

      <form
        onSubmit={handleSearch}
        className="mx-auto mb-8 max-w-2xl px-4 sm:px-6 lg:px-0"
      >
        <div className="flex items-center gap-2">
          <Input
            type="text"
            name="query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="リポジトリを検索..."
            className="flex-grow"
          />
          <Button type="submit">検索</Button>
        </div>
      </form>

      <div className="space-y-4">
        {repositories ? (
          repositories.totalCount > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>検索結果: {repositories.totalCount.toLocaleString()} 件</div>
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="rounded-md border p-2"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              {repositories.items.map((repo) => (
                <Card key={repo.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={repo.owner.avatarUrl}
                        alt={`${repo.owner.login}'s avatar`}
                        width={40}
                        height={40}
                        className="flex-shrink-0 rounded-full"
                      />
                      <div className="min-w-0 flex-1">
                        {' '}
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="max-w-full truncate text-left font-semibold text-blue-600 hover:underline">
                              {repo.fullName}
                            </button>
                          </DialogTrigger>
                          <DialogContent
                            className="sm:max-w-[425px]"
                            aria-describedby="dialog-description"
                            aria-description="リポジトリの詳細情報"
                          >
                            <DialogHeader>
                              <DialogTitle>
                                <a
                                  href={repo.htmlUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {repo.fullName}
                                </a>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              <div className="mb-2 flex items-center">
                                <Image
                                  src={repo.owner.avatarUrl}
                                  alt={`${repo.owner.login}'s avatar`}
                                  width={24}
                                  height={24}
                                  className="mr-2 rounded-full"
                                />
                                <span>{repo.owner.login}</span>
                              </div>
                              <p>
                                <strong>言語:</strong> {repo.language}
                              </p>
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                <div className="flex items-center">
                                  <StarIcon className="mr-1 h-4 w-4" />
                                  <span>
                                    {repo.stargazersCount.toLocaleString()} Stars
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <EyeIcon className="mr-1 h-4 w-4" />
                                  <span>
                                    {repo.watchersCount.toLocaleString()} Watchers
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <GitForkIcon className="mr-1 h-4 w-4" />
                                  <span>{repo.forksCount.toLocaleString()} Forks</span>
                                </div>
                                <div className="flex items-center">
                                  <AlertCircleIcon className="mr-1 h-4 w-4" />
                                  <span>
                                    {repo.openIssuesCount.toLocaleString()} Open Issues
                                  </span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <p className="mt-1 line-clamp-2 min-w-0 break-all text-sm text-gray-600">
                          {repo.description}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className="mr-4 flex items-center">
                            <StarIcon className="mr-1 h-4 w-4" />
                            {repo.stargazersCount.toLocaleString()}
                          </span>
                          {repo.language && <span>{repo.language}</span>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="mb-4 mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent className="flex-wrap justify-center">
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > DEFAULT_PAGE) {
                            handlePageChange(page - 1);
                          }
                        }}
                        className={
                          page <= DEFAULT_PAGE ? 'pointer-events-none opacity-50' : ''
                        }
                      />
                    </PaginationItem>
                    {(() => {
                      const totalPages = Math.min(
                        GITHUB_API_MAX_PAGE,
                        Math.ceil((repositories?.totalCount || 0) / PER_PAGE)
                      );
                      const pageNumbers: (number | 'ellipsis')[] = [];

                      if (totalPages <= 7) {
                        pageNumbers.push(
                          ...Array.from({ length: totalPages }, (_, i) => i + 1)
                        );
                      } else {
                        pageNumbers.push(DEFAULT_PAGE);
                        if (page > 3) {
                          pageNumbers.push('ellipsis');
                        }
                        for (
                          let i = Math.max(2, page - 1);
                          i <= Math.min(page + 1, totalPages - 1);
                          i++
                        ) {
                          pageNumbers.push(i);
                        }
                        if (page < totalPages - 2) {
                          pageNumbers.push('ellipsis');
                        }
                        if (page !== totalPages) {
                          pageNumbers.push(totalPages);
                        }
                      }

                      return pageNumbers.map((pageNum, index) => (
                        <PaginationItem key={index} className="hidden sm:inline-block">
                          {pageNum === 'ellipsis' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              href="#"
                              isActive={page === pageNum}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNum);
                              }}
                            >
                              {pageNum}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ));
                    })()}
                    <PaginationItem className="sm:hidden">
                      <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
                        {page} /{' '}
                        {Math.min(
                          GITHUB_API_MAX_PAGE,
                          Math.ceil((repositories?.totalCount || 0) / PER_PAGE)
                        )}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            page <
                            Math.min(
                              GITHUB_API_MAX_PAGE,
                              Math.ceil((repositories?.totalCount || 0) / PER_PAGE)
                            )
                          ) {
                            handlePageChange(page + 1);
                          }
                        }}
                        className={
                          page >=
                          Math.min(
                            GITHUB_API_MAX_PAGE,
                            Math.ceil((repositories?.totalCount || 0) / PER_PAGE)
                          )
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
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
