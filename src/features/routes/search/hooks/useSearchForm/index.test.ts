import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSearchForm } from './index';

const createMockFormEvent = (inputValue: string) => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  input.name = 'query';
  input.value = inputValue;
  form.appendChild(input);

  return {
    preventDefault: vi.fn(),
    currentTarget: form,
  } as unknown as React.FormEvent<HTMLFormElement>;
};

describe('useSearchForm', () => {
  const mockProps = {
    setPage: vi.fn(),
    setKey: vi.fn(),
    setQuery: vi.fn(),
    sort: 'stars' as const,
  };

  // localStorage のモック
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // localStorage のモックを設定
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });
  });

  it('初期化時に localStorage から履歴を読み込む', () => {
    const mockHistory = ['react', 'vue'];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockHistory));

    const { result } = renderHook(() => useSearchForm(mockProps));

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('search_history');
    expect(result.current.searchHistory).toEqual(mockHistory);
  });

  it('フォーム送信時に正しく処理される', () => {
    const { result } = renderHook(() => useSearchForm(mockProps));

    const mockEvent = createMockFormEvent('test-query');

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockProps.setPage).toHaveBeenCalledWith(1);
    expect(mockProps.setKey).toHaveBeenCalledWith(
      '/search/repositories?q=test-query&sort=stars&per_page=20&page=1'
    );
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('履歴クリック時に正しく処理される', () => {
    const { result } = renderHook(() => useSearchForm(mockProps));

    act(() => {
      result.current.handleHistoryClick('test-query');
    });

    expect(mockProps.setQuery).toHaveBeenCalledWith('test-query');
    expect(mockProps.setPage).toHaveBeenCalledWith(1);
    expect(mockProps.setKey).toHaveBeenCalledWith(
      '/search/repositories?q=test-query&sort=stars&per_page=20&page=1'
    );
  });

  it('履歴をクリアできる', () => {
    const { result } = renderHook(() => useSearchForm(mockProps));

    act(() => {
      result.current.clearHistory();
    });

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('search_history');
    expect(result.current.searchHistory).toEqual([]);
  });

  it('履歴は最大5件まで保存される', () => {
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify(['item1', 'item2', 'item3', 'item4', 'item5'])
    );
    const { result } = renderHook(() => useSearchForm(mockProps));

    const mockEvent = createMockFormEvent('new-item');

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(result.current.searchHistory).toHaveLength(5);
    expect(result.current.searchHistory[0]).toBe('new-item');
  });

  it('重複する検索クエリは1つにまとめられる', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(['test', 'vue']));
    const { result } = renderHook(() => useSearchForm(mockProps));

    const mockEvent = createMockFormEvent('new-item');

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(result.current.searchHistory).toEqual(['new-item', 'test', 'vue']);
  });
});
