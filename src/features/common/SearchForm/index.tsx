'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          name="query"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-grow"
        />
        <Button type="submit">{buttonText}</Button>
      </div>
    </form>
  );
}
