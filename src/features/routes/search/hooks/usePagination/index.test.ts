import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePagination } from './index';
import {
  GITHUB_API_MAX_RESULT,
  GITHUB_API_MAX_PAGE,
  PER_PAGE,
} from '@/constants/pagination';

describe('usePagination', () => {
  const mockProps = {
    setPage: vi.fn(),
    setKey: vi.fn(),
    page: 2,
    query: 'react',
    sort: 'stars' as const,
    totalCount: 100,
  };

  it('handlePageChangeが正しく動作する', () => {
    const { result } = renderHook(() => usePagination(mockProps));

    // 有効なページ番号の場合
    result.current.handlePageChange(3);
    expect(mockProps.setPage).toHaveBeenCalledWith(3);
    expect(mockProps.setKey).toHaveBeenCalledWith(
      `/search/repositories?q=react&sort=stars&per_page=${PER_PAGE}&page=3`
    );

    // 無効なページ番号（0以下）の場合
    result.current.handlePageChange(0);
    expect(mockProps.setPage).not.toHaveBeenCalledWith(0);

    // 無効なページ番号（最大ページ数超過）の場合
    result.current.handlePageChange(GITHUB_API_MAX_PAGE + 1);
    expect(mockProps.setPage).not.toHaveBeenCalledWith(GITHUB_API_MAX_PAGE + 1);
  });

  it('totalPagesが正しく計算される', () => {
    // 通常のケース
    const { result: result1 } = renderHook(() =>
      usePagination({ ...mockProps, totalCount: 100 })
    );
    expect(result1.current.totalPages).toBe(5);

    // GitHub APIの最大ページ数を超える場合
    const { result: result2 } = renderHook(() =>
      usePagination({ ...mockProps, totalCount: GITHUB_API_MAX_PAGE * PER_PAGE * 2 })
    );
    expect(result2.current.totalPages).toBe(GITHUB_API_MAX_PAGE);

    // 0件の場合
    const { result: result3 } = renderHook(() =>
      usePagination({ ...mockProps, totalCount: 0 })
    );
    expect(result3.current.totalPages).toBe(0);
  });

  describe('pageNumbersが正しく生成される', () => {
    it('7ページ以下の場合、全ページ番号が表示される', () => {
      const { result } = renderHook(() =>
        usePagination({ ...mockProps, totalCount: 7 * PER_PAGE, page: 4 })
      );
      expect(result.current.pageNumbers).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('現在のページが中央付近の場合', () => {
      const middlePage = GITHUB_API_MAX_PAGE / 2;
      const { result } = renderHook(() =>
        usePagination({
          ...mockProps,
          totalCount: GITHUB_API_MAX_RESULT,
          page: middlePage,
        })
      );

      expect(result.current.pageNumbers).toEqual([
        1,
        'ellipsis',
        middlePage - 1,
        middlePage,
        middlePage + 1,
        'ellipsis',
        GITHUB_API_MAX_PAGE,
      ]);
    });

    it('現在のページが最初の方の場合', () => {
      const { result } = renderHook(() =>
        usePagination({
          ...mockProps,
          totalCount: GITHUB_API_MAX_RESULT,
          page: 2,
        })
      );
      expect(result.current.pageNumbers).toEqual([
        1,
        2,
        3,
        'ellipsis',
        GITHUB_API_MAX_PAGE,
      ]);
    });

    it('現在のページが最後の方の場合', () => {
      const { result } = renderHook(() =>
        usePagination({
          ...mockProps,
          totalCount: GITHUB_API_MAX_RESULT,
          page: GITHUB_API_MAX_PAGE - 1,
        })
      );
      expect(result.current.pageNumbers).toEqual([
        1,
        'ellipsis',
        GITHUB_API_MAX_PAGE - 2,
        GITHUB_API_MAX_PAGE - 1,
        GITHUB_API_MAX_PAGE,
      ]);
    });
  });
});
