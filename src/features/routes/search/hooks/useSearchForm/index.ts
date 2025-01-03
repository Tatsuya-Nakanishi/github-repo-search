'use client';
import { DEFAULT_PAGE, PER_PAGE } from '@/constants/pagination';

type PropType = {
  setPage: (page: number) => void;
  setKey: (key: string) => void;
  sort: 'stars' | 'updated';
};

export const useSearchForm = ({ setPage, setKey, sort }: PropType) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('query') as string;
    setPage(DEFAULT_PAGE);
    setKey(
      searchQuery
        ? `/search/repositories?q=${searchQuery}&sort=${sort}&per_page=${PER_PAGE}&page=${DEFAULT_PAGE}`
        : ''
    );
  };

  return { handleSubmit };
};
