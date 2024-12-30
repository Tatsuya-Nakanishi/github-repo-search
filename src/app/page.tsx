'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // デモ用の検索結果
    const demoResults = [
      `「${query}」に関する検索結果1`,
      `「${query}」に関する検索結果2`,
      `「${query}」に関する検索結果3`,
    ];
    setResults(demoResults);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">検索</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="検索キーワードを入力..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 hover:bg-gray-100"
          >
            <Search className="h-5 w-5 text-gray-500" />
            <span className="sr-only">検索</span>
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">検索結果</h2>
          <div className="divide-y rounded-lg border">
            {results.map((result, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <p>{result}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="rounded-lg border border-gray-200 p-4 text-center text-gray-500">
          検索結果が見つかりませんでした。
        </div>
      )}
    </div>
  );
}
