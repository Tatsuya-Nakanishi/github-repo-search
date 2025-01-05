import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useSearchResults } from './index';

describe('useSearchResults', () => {
  const mockProps = {
    setSort: vi.fn(),
    setPage: vi.fn(),
    setKey: vi.fn(),
    query: 'test-query',
  };

  it('handleSortChangeが正しく動作する', () => {
    const { result } = renderHook(() => useSearchResults(mockProps));

    // セレクトの変更イベントをシミュレート
    const mockEvent = {
      target: {
        value: 'updated',
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    result.current.handleSortChange(mockEvent);

    // 各setterが正しく呼ばれることを確認
    expect(mockProps.setSort).toHaveBeenCalledWith('updated');
    expect(mockProps.setPage).toHaveBeenCalledWith(1);
    expect(mockProps.setKey).toHaveBeenCalledWith(
      '/search/repositories?q=test-query&sort=updated&per_page=20&page=1'
    );
  });

  it('queryの依存関係が正しく動作する', () => {
    const { result, rerender } = renderHook((props) => useSearchResults(props), {
      initialProps: mockProps,
    });

    // 新しいqueryで再レンダリング
    rerender({
      ...mockProps,
      query: 'new-query',
    });

    const mockEvent = {
      target: {
        value: 'stars',
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    result.current.handleSortChange(mockEvent);

    // 新しいqueryが使用されることを確認
    expect(mockProps.setKey).toHaveBeenCalledWith(
      '/search/repositories?q=new-query&sort=stars&per_page=20&page=1'
    );
  });
});
