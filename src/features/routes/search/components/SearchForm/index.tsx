'use client';
import SearchForm from '@/features/common/SearchForm';

type PropType = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  buttonText?: string;
  className?: string;
};

export default function Component({
  value,
  onChange,
  handleSubmit,
  placeholder = '',
  buttonText = '検索',
  className = 'mx-auto mb-8 max-w-2xl px-4 sm:px-6 lg:px-0',
}: PropType) {
  return (
    <SearchForm
      value={value}
      onChange={onChange}
      handleSubmit={handleSubmit}
      placeholder={placeholder}
      buttonText={buttonText}
      className={className}
    />
  );
}
