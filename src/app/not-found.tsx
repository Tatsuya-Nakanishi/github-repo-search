import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 text-center">
      <div className="rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">404</h1>
        <h2 className="mb-4 text-xl font-semibold text-gray-700">
          ページが見つかりません
        </h2>
        <p className="mb-8 text-gray-600">
          申し訳ありませんが、お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Button asChild>
          <Link href="/" className="inline-flex items-center">
            <HomeIcon className="mr-2 h-4 w-4" />
            ホームに戻る
          </Link>
        </Button>
      </div>
    </div>
  );
}
