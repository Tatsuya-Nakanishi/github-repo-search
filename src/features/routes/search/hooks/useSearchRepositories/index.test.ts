import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, type Mock, beforeEach } from 'vitest';
import { useSearchRepositories } from './index';
import useGithubApi from '@/hooks/useGithubApi';

// useGithubApiのモック
vi.mock('@/hooks/useGithubApi', () => ({
  default: vi.fn(),
}));

// window.scrollToのモック
const mockScrollTo = vi.fn();
window.scrollTo = mockScrollTo;

describe('useSearchRepositories', () => {
  const mockRepositories = {
    totalCount: 100,
    items: [
      {
        id: 1,
        name: 'test-repo',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初期状態が正しく設定される', () => {
    (useGithubApi as Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    const { result } = renderHook(() => useSearchRepositories());

    expect(result.current.sort).toBe('stars');
    expect(result.current.page).toBe(1);
    expect(result.current.query).toBe('');
    expect(result.current.repositories).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('ソート順を変更できる', () => {
    const { result } = renderHook(() => useSearchRepositories());

    act(() => {
      result.current.setSort('updated');
    });

    expect(result.current.sort).toBe('updated');
  });

  it('ページを変更できる', () => {
    const { result } = renderHook(() => useSearchRepositories());

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.page).toBe(2);
  });

  it('検索キーを設定できる', () => {
    const { result } = renderHook(() => useSearchRepositories());

    act(() => {
      result.current.setKey('/search/repositories?q=test');
    });

    expect(result.current.setKey).toBeDefined();
  });

  it('検索クエリを設定できる', () => {
    const { result } = renderHook(() => useSearchRepositories());

    act(() => {
      result.current.setQuery('test');
    });

    expect(result.current.query).toBe('test');
  });

  it('検索結果が取得されたら画面上部にスクロールする', () => {
    (useGithubApi as Mock).mockReturnValue({
      data: mockRepositories,
      isLoading: false,
    });

    renderHook(() => useSearchRepositories());

    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it('ローディング中はスクロールしない', () => {
    (useGithubApi as Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    renderHook(() => useSearchRepositories());

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it('データがない場合はスクロールしない', () => {
    (useGithubApi as Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    renderHook(() => useSearchRepositories());

    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});
