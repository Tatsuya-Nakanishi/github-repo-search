import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SearchComponent from './index';
import { useSearchRepositories } from '../hooks/useSearchRepositories';

// モックの型定義
vi.mock('../hooks/useSearchRepositories', () => ({
  useSearchRepositories: vi.fn().mockReturnValue({
    sort: 'stars',
    setSort: vi.fn(),
    page: 1,
    setPage: vi.fn(),
    setKey: vi.fn(),
    query: '',
    setQuery: vi.fn(),
    repositories: null,
    isLoading: false,
  }),
}));

vi.mock('../hooks/usePagination', () => ({
  usePagination: () => ({
    handlePageChange: vi.fn(),
    totalPages: 5,
    pageNumbers: [1, 2, 3, 4, 5],
  }),
}));

vi.mock('../hooks/useSearchForm', () => ({
  useSearchForm: () => ({
    handleSubmit: vi.fn(),
    handleHistoryClick: vi.fn(),
    clearHistory: vi.fn(),
    searchHistory: ['react', 'vue'],
  }),
}));

vi.mock('../hooks/useSearchResults', () => ({
  useSearchResults: () => ({
    handleSortChange: vi.fn(),
  }),
}));

vi.mock('@/components/custom/Loading', () => ({
  default: () => <div data-testid="loading">Loading...</div>,
}));

vi.mock('./SearchForm', () => ({
  default: vi.fn(() => <div data-testid="search-form" />),
}));

vi.mock('./SearchResults', () => ({
  default: vi.fn(() => <div data-testid="search-results" />),
}));

vi.mock('./Pagination', () => ({
  default: vi.fn(() => <div data-testid="pagination" />),
}));

describe('SearchComponent', () => {
  it('初期状態で検索フォームとメッセージが表示される', () => {
    render(<SearchComponent />);

    expect(screen.getByText('GitHub リポジトリ検索')).toBeInTheDocument();
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    expect(screen.getByText('検索してください')).toBeInTheDocument();
  });

  it('ローディング中はローディングコンポーネントが表示される', () => {
    vi.mocked(useSearchRepositories).mockReturnValue({
      ...vi.mocked(useSearchRepositories)(),
      isLoading: true,
    });

    render(<SearchComponent />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('検索結果がある場合、結果とページネーションが表示される', () => {
    vi.mocked(useSearchRepositories).mockReturnValue({
      ...vi.mocked(useSearchRepositories)(),
      repositories: {
        totalCount: 100,
        items: [
          {
            id: 1,
            fullName: 'test-user/test-repo',
            owner: {
              login: 'test-user',
              avatarUrl: 'https://example.com/avatar.jpg',
            },
            description: 'Test repository',
            stargazersCount: 100,
            language: 'TypeScript',
            htmlUrl: '',
            watchersCount: 0,
            forksCount: 0,
            openIssuesCount: 0,
          },
        ],
      },
    });

    render(<SearchComponent />);
    // SearchResultsコンポーネントが描画されていることを確認
    expect(screen.getByTestId('search-results')).toBeInTheDocument();
    // Paginationコンポーネントが描画されていることを確認
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('検索結果が0件の場合、メッセージが表示される', () => {
    vi.mocked(useSearchRepositories).mockReturnValue({
      ...vi.mocked(useSearchRepositories)(),
      repositories: {
        totalCount: 0,
        items: [],
      },
    });

    render(<SearchComponent />);
    expect(screen.getByText('検索結果がありませんでした')).toBeInTheDocument();
  });
});
