'use client';
import React, { useState } from 'react';
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
import humps from 'humps';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import useSWR from 'swr';

type RepositoryItemsType = {
  id: number;
  fullName: string;
  htmlUrl: string;
  description: string;
  owner: {
    avatarUrl: string;
    login: string;
  };
  stargazersCount: number;
  language: string;
  watchersCount: number;
  forksCount: number;
  openIssuesCount: number;
};

type RepositoryType = {
  items: RepositoryItemsType[];
  totalCount: number;
};

const sortOptions = [
  { name: 'スター順', value: 'stars' },
  { name: '新着順', value: 'updated' },
];

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      // **セキュリティ上の注意**: トークンをクライアントサイドにハードコードするのは避けてください。
      // 環境変数を使用するか、サーバーサイドでプロキシすることを推奨します。
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('APIリクエストに失敗しました');
      }
      return res.json();
    })
    .then((data) => humps.camelizeKeys(data));

export default function Component() {
  const [sort, setSort] = useState<'stars' | 'updated'>('stars');
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    data: repositories,
    error,
    isLoading,
  } = useSWR<RepositoryType>(searchKey, fetcher, {
    revalidateOnFocus: false,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('query') as string;
    setPage(1);
    setSearchKey(
      searchQuery
        ? `https://api.github.com/search/repositories?q=${searchQuery}&sort=${sort}&per_page=20&page=1`
        : null
    );
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    const targetSortValue = e.target.value as 'stars' | 'updated';
    setSort(targetSortValue);
    setPage(1);
    setSearchKey(
      `https://api.github.com/search/repositories?q=${searchQuery}&sort=${targetSortValue}&per_page=20&page=1`
    );
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > Math.ceil((repositories?.totalCount || 0) / 20)) {
      return;
    }
    setPage(newPage);
    setSearchKey(
      `https://api.github.com/search/repositories?q=${searchQuery}&sort=${sort}&per_page=20&page=${newPage}`
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-3xl font-bold">GitHub リポジトリ検索</h1>

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
        {repositories && repositories.items.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div>検索結果: {repositories.totalCount} 件</div>
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
              <React.Fragment key={repo.id}>
                <Card key={repo.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <Image
                        src={repo.owner.avatarUrl}
                        alt={`${repo.owner.login}'s avatar`}
                        width={40}
                        height={40}
                        className="mr-4 rounded-full"
                      />
                      <div className="flex-grow">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="text-left font-semibold text-blue-600 hover:underline">
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
                        <p className="mt-1 text-sm text-gray-600">{repo.description}</p>
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
              </React.Fragment>
            ))}
            <div className="mb-4 mt-8 flex justify-center">
              <Pagination>
                <PaginationContent className="flex-wrap justify-center">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) {
                          handlePageChange(page - 1);
                        }
                      }}
                      className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {(() => {
                    const totalPages = Math.min(
                      50,
                      Math.ceil((repositories?.totalCount || 0) / 20)
                    );
                    const pageNumbers: (number | 'ellipsis')[] = [];

                    if (totalPages <= 7) {
                      pageNumbers.push(
                        ...Array.from({ length: totalPages }, (_, i) => i + 1)
                      );
                    } else {
                      pageNumbers.push(1);
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
                      {Math.min(50, Math.ceil((repositories?.totalCount || 0) / 20))}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          page <
                          Math.min(50, Math.ceil((repositories?.totalCount || 0) / 20))
                        ) {
                          handlePageChange(page + 1);
                        }
                      }}
                      className={
                        page >=
                        Math.min(50, Math.ceil((repositories?.totalCount || 0) / 20))
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
