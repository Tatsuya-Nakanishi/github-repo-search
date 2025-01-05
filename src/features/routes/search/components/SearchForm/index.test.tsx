import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from './index';

vi.mock('@/features/common/SearchForm', () => ({
  default: vi.fn(() => <div data-testid="search-form" />),
}));

describe('SearchForm', () => {
  const mockProps = {
    value: '',
    onChange: vi.fn(),
    handleSubmit: vi.fn(),
    placeholder: 'リポジトリを検索...',
    searchHistory: ['react', 'typescript'],
    handleHistoryClick: vi.fn(),
    clearHistory: vi.fn(),
  };

  it('検索フォームが正しく表示される', () => {
    render(<SearchForm {...mockProps} />);

    expect(screen.getByTestId('search-form')).toBeInTheDocument();
  });

  it('検索履歴が表示される', () => {
    render(<SearchForm {...mockProps} />);

    mockProps.searchHistory.forEach((term) => {
      expect(screen.getByText(term)).toBeInTheDocument();
    });
  });

  it('検索履歴をクリックするとhandleHistoryClickが呼ばれる', () => {
    render(<SearchForm {...mockProps} />);

    const historyItem = screen.getByText('react');
    fireEvent.click(historyItem);

    expect(mockProps.handleHistoryClick).toHaveBeenCalledTimes(1);
    expect(mockProps.handleHistoryClick).toHaveBeenCalledWith('react');
  });

  it('履歴クリアボタンをクリックするとclearHistoryが呼ばれる', () => {
    render(<SearchForm {...mockProps} />);

    const clearButton = screen.getByLabelText('履歴を削除');
    fireEvent.click(clearButton);

    expect(mockProps.clearHistory).toHaveBeenCalledTimes(1);
  });

  it('検索履歴が空の場合、履歴セクションが表示されない', () => {
    render(<SearchForm {...mockProps} searchHistory={[]} />);

    expect(screen.queryByText('検索履歴')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '履歴を削除' })).not.toBeInTheDocument();
  });
});
