'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center px-4 text-center">
      <div className="rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-4 flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="mb-4 text-3xl font-bold text-gray-800">エラーが発生しました</h1>
        <p className="mb-8 text-gray-600">
          申し訳ありませんが、予期せぬエラーが発生しました。問題が解決しない場合は、サポートまでお問い合わせください。
        </p>
        <div className="flex justify-center">
          <Button onClick={reset} className="mr-4">
            再試行
          </Button>
          <Button asChild variant="outline">
            <Link href="/">ホームに戻る</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
