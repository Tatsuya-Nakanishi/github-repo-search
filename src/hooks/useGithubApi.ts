'use client';

import humps from 'humps';
import useSWR, { SWRResponse } from 'swr';

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error('リクエストに失敗しました');
      }
      return res.json();
    })
    .then((data: any) => humps.camelizeKeys(data));

export default function useGithubApi<T>(path: string): SWRResponse<T, Error> {
  const url = path ? `/api/github/${path}` : null;

  return useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });
}
