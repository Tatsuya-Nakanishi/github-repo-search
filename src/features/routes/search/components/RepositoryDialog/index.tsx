'use client';
import Image from 'next/image';
import { StarIcon, EyeIcon, GitForkIcon, AlertCircleIcon } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RepositoryItemsType } from '@/types/repository';
import {
  TwitterShareButton,
  FacebookShareButton,
  FacebookIcon,
  XIcon,
} from 'react-share';

type PropType = {
  repo: RepositoryItemsType;
};

export default function Component({ repo }: PropType) {
  const shareUrl = repo.htmlUrl;
  const shareTitle = `GitHubリポジトリ: ${repo.fullName}`;

  return (
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
          <DialogTitle className="pr-8">
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="line-clamp-2 hover:underline"
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
              <span>{repo.stargazersCount.toLocaleString()} Stars</span>
            </div>
            <div className="flex items-center">
              <EyeIcon className="mr-1 h-4 w-4" />
              <span>{repo.watchersCount.toLocaleString()} Watchers</span>
            </div>
            <div className="flex items-center">
              <GitForkIcon className="mr-1 h-4 w-4" />
              <span>{repo.forksCount.toLocaleString()} Forks</span>
            </div>
            <div className="flex items-center">
              <AlertCircleIcon className="mr-1 h-4 w-4" />
              <span>{repo.openIssuesCount.toLocaleString()} Open Issues</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <TwitterShareButton url={shareUrl} title={shareTitle}>
            <XIcon size={32} round />
          </TwitterShareButton>
          <FacebookShareButton url={shareUrl} title={shareTitle}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
