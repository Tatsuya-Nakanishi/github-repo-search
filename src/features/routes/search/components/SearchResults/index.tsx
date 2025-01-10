'use client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { StarIcon } from 'lucide-react';
import RepositoryDialog from '../RepositoryDialog';
import { RepositoryType } from '../../types/repository';

type PropType = {
  repositories: RepositoryType;
  sort: 'stars' | 'updated';
  handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const sortOptions = [
  { name: 'スター順', value: 'stars' },
  { name: '新着順', value: 'updated' },
];

export default function Component({ repositories, sort, handleSortChange }: PropType) {
  return repositories.totalCount > 0 ? (
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
                <RepositoryDialog repo={repo} />
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
    </>
  ) : (
    <div className="text-center">
      <h1 className="text-xl font-bold sm:text-3xl">検索結果がありませんでした</h1>
    </div>
  );
}
