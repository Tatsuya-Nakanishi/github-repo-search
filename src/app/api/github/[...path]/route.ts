import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API_BASE_URL = 'https://api.github.com';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  try {
    const resolvedParams = await params;
    const urlPath = resolvedParams.path.join('/');
    if (urlPath === '') {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
    }
    // リクエストURLからクエリパラメータを取得
    const { searchParams } = new URL(req.url);
    // クエリパラメータを動的に組み立てる
    const queryParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      queryParams.append(key, value);
    });
    const queryString = queryParams.toString();
    if (queryString === '') {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // GitHub API のエンドポイントを構築
    const endpoint = `${GITHUB_API_BASE_URL}/${urlPath}?${queryString}`;

    console.log('Fetching GitHub API:', endpoint);

    // GitHub API を呼び出す
    const ghRes = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`, // サーバーサイド環境変数
      },
    });

    if (!ghRes.ok) {
      const errorData = await ghRes.json();
      return NextResponse.json(
        { error: 'GitHub API request failed', details: errorData },
        { status: ghRes.status }
      );
    }

    const data = await ghRes.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
