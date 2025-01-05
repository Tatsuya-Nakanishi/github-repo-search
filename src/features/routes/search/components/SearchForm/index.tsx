'use client';
import SearchForm from '@/features/common/SearchForm';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PropType = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  searchHistory: string[];
  handleHistoryClick: (searchQuery: string) => void;
  clearHistory: () => void;
};

export default function Component({
  value,
  onChange,
  handleSubmit,
  placeholder = '',
  buttonText = '検索',
  className = 'mx-auto mb-4 max-w-2xl px-4 sm:px-6 lg:px-0',
  searchHistory,
  handleHistoryClick,
  clearHistory,
}: PropType) {
  return (
    <>
      <SearchForm
        value={value}
        onChange={onChange}
        handleSubmit={handleSubmit}
        placeholder={placeholder}
        buttonText={buttonText}
        className={className}
      />
      {searchHistory.length > 0 && (
        <div className="mb-4 mt-1 flex justify-center">
          <div className="flex max-w-2xl items-center gap-2">
            <div className="flex flex-wrap gap-1.5 text-sm text-muted-foreground">
              {searchHistory.map((item) => (
                <button
                  key={item}
                  onClick={() => handleHistoryClick(item)}
                  className="transition-colors hover:text-foreground"
                >
                  {item.length > 10 ? `${item.slice(0, 10)}...` : item}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearHistory}
              className="ml-1 h-7 w-7"
              title="履歴を削除"
              aria-label="履歴を削除"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
