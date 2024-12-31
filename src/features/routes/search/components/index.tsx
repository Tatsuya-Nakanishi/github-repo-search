'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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

type Repository = {
  id: number;
  full_name: string;
  html_url: string;
  description: string;
  owner: {
    avatar_url: string;
    login: string;
  };
  stargazers_count: number;
  language: string;
  watchers_count?: number;
  forks_count?: number;
  open_issues_count?: number;
};

const sortOptions = [
  { name: 'スター順', value: 'stars' },
  { name: '新着順', value: 'updated' },
];

const testData: Repository[] = [
  {
    id: 1,
    full_name: 'facebook/react',
    html_url: 'https://github.com/facebook/react',
    description:
      'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    owner: {
      avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
      login: 'facebook',
    },
    stargazers_count: 200000,
    language: 'JavaScript',
    watchers_count: 6500,
    forks_count: 41000,
    open_issues_count: 1000,
  },
  {
    id: 2,
    full_name: 'vercel/next.js',
    html_url: 'https://github.com/vercel/next.js',
    description: 'The React Framework for Production',
    owner: {
      avatar_url: 'https://avatars.githubusercontent.com/u/14985020?v=4',
      login: 'vercel',
    },
    stargazers_count: 100000,
    language: 'TypeScript',
    watchers_count: 2000,
    forks_count: 24000,
    open_issues_count: 1500,
  },
  {
    id: 3,
    full_name: 'tailwindlabs/tailwindcss',
    html_url: 'https://github.com/tailwindlabs/tailwindcss',
    description: 'A utility-first CSS framework for rapid UI development.',
    owner: {
      avatar_url: 'https://avatars.githubusercontent.com/u/67109815?v=4',
      login: 'tailwindlabs',
    },
    stargazers_count: 70000,
    language: 'CSS',
    watchers_count: 1000,
    forks_count: 3500,
    open_issues_count: 200,
  },
];

export default function Component() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState<'stars' | 'updated'>('stars');
  const [page, setPage] = useState(1);
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    setRepositories(testData);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    // 実際のAPIを使用する場合、ここで検索を実行します
  };

  const camerlizeData = humps.camelizeKeys(testData);
  console.log(camerlizeData);
  console.log(router);
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="リポジトリを検索..."
            className="flex-grow"
          />
          <Button type="submit">検索</Button>
        </div>
      </form>

      <div className="mb-4 flex items-center justify-between">
        <div>検索結果: {repositories.length} 件</div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'stars' | 'updated')}
          className="rounded-md border p-2"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {repositories.map((repo) => (
          <Card key={repo.id}>
            <CardContent className="p-4">
              <div className="flex items-start">
                <Image
                  src={repo.owner.avatar_url}
                  alt={`${repo.owner.login}'s avatar`}
                  width={40}
                  height={40}
                  className="mr-4 rounded-full"
                />
                <div className="flex-grow">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-left font-semibold text-blue-600 hover:underline">
                        {repo.full_name}
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
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {repo.full_name}
                          </a>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <div className="mb-2 flex items-center">
                          <Image
                            src={repo.owner.avatar_url}
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
                            <span>{repo.stargazers_count.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <EyeIcon className="mr-1 h-4 w-4" />
                            <span>{repo.watchers_count?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <GitForkIcon className="mr-1 h-4 w-4" />
                            <span>{repo.forks_count?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <AlertCircleIcon className="mr-1 h-4 w-4" />
                            <span>{repo.open_issues_count?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <p className="mt-1 text-sm text-gray-600">{repo.description}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="mr-4 flex items-center">
                      <StarIcon className="mr-1 h-4 w-4" />
                      {repo.stargazers_count.toLocaleString()}
                    </span>
                    {repo.language && <span>{repo.language}</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-4 mt-8 flex justify-center">
        <Pagination>
          <PaginationContent className="flex-wrap justify-center">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>
            {[...Array(Math.min(5, Math.ceil(repositories.length / 20)))].map((_, i) => (
              <PaginationItem key={i} className="hidden sm:inline-block">
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {Math.ceil(repositories.length / 20) > 5 && (
              <PaginationItem className="hidden sm:inline-block">
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem className="sm:hidden">
              <PaginationLink href="#">
                {page} / {Math.ceil(repositories.length / 20)}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < Math.ceil(repositories.length / 20)) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
