'use client';

import useSWR, { SWRResponse } from 'swr';
import humps from 'humps';

const GITHUB_API_BASE_URL = 'https://api.github.com';

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('リクエストに失敗しました');
      }
      return res.json();
    })
    .then((data) => humps.camelizeKeys(data));

export default function useGithubApi<T>(key: string): SWRResponse<T, Error> {
  const url = `${GITHUB_API_BASE_URL}${key}`;

  return useSWR<T>(key ? url : null, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });
}
