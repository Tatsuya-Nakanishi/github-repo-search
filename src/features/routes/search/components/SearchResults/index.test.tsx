import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchResults from './index';

describe('SearchResults', () => {
  const mockRepositories = {
    totalCount: 100,
    items: [
      {
        id: 1,
        name: 'test-repo',
        fullName: 'test-user/test-repo',
        private: false,
        owner: {
          login: 'test-user',
          id: 1,
          avatarUrl: 'https://example.com/avatar.jpg',
          url: 'https://api.github.com/users/test-user',
        },
        htmlUrl: 'https://github.com/test-user/test-repo',
        description: 'Test repository description',
        fork: false,
        url: 'https://api.github.com/repos/test-user/test-repo',
        language: 'TypeScript',
        forksCount: 10,
        stargazersCount: 100,
        watchersCount: 5,
        openIssuesCount: 3,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      },
    ],
  };

  const mockProps = {
    repositories: mockRepositories,
    sort: 'stars' as const,
    handleSortChange: vi.fn(),
  };

  it('検索結果の総件数が表示される', () => {
    render(<SearchResults {...mockProps} />);
    expect(screen.getByText('検索結果: 100 件')).toBeInTheDocument();
  });

  it('ソートオプションが表示され、変更できる', () => {
    render(<SearchResults {...mockProps} />);
    const select = screen.getByRole('combobox');

    expect(select).toHaveValue('stars');
    fireEvent.change(select, { target: { value: 'updated' } });
    expect(mockProps.handleSortChange).toHaveBeenCalled();
  });

  it('リポジトリの情報が正しく表示される', () => {
    render(<SearchResults {...mockProps} />);

    // リポジトリ名
    expect(screen.getByText('test-user/test-repo')).toBeInTheDocument();

    // 説明
    expect(screen.getByText('Test repository description')).toBeInTheDocument();

    // スター数
    expect(screen.getByText('100')).toBeInTheDocument();

    // プログラミング言語
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    // アバター画像
    const avatar = screen.getByAltText("test-user's avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src');
  });

  it('検索結果が0件の場合、メッセージが表示される', () => {
    render(
      <SearchResults
        {...mockProps}
        repositories={{ ...mockRepositories, totalCount: 0, items: [] }}
      />
    );

    expect(screen.getByText('検索結果がありませんでした')).toBeInTheDocument();
  });
});
