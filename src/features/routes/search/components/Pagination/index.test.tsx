import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './index';

describe('Pagination', () => {
  const mockProps = {
    page: 2,
    totalPages: 5,
    pageNumbers: [1, 2, 3, 4, 5],
    handlePageChange: vi.fn(),
  };

  it('現在のページが強調表示される', () => {
    render(<Pagination {...mockProps} />);
    // 現在のページを探す
    const currentPage = screen.getByText('2').closest('a');
    expect(currentPage).toHaveAttribute('aria-current', 'page');

    // 他のページを探す
    const otherPage = screen.getByText('1').closest('a');
    expect(otherPage).not.toHaveAttribute('aria-current', 'page');
  });

  it('ページ番号をクリックするとhandlePageChangeが呼ばれる', () => {
    render(<Pagination {...mockProps} />);
    fireEvent.click(screen.getByText('3'));
    expect(mockProps.handlePageChange).toHaveBeenCalledWith(3);
  });

  it('前へボタンをクリックすると前のページに移動する', () => {
    render(<Pagination {...mockProps} />);
    fireEvent.click(screen.getByText('前へ'));
    expect(mockProps.handlePageChange).toHaveBeenCalledWith(1);
  });

  it('次へボタンをクリックすると次のページに移動する', () => {
    render(<Pagination {...mockProps} />);
    fireEvent.click(screen.getByText('次へ'));
    expect(mockProps.handlePageChange).toHaveBeenCalledWith(3);
  });

  it('最初のページでは前へボタンが無効になる', () => {
    render(<Pagination {...mockProps} page={1} />);
    const prevButton = screen.getByText('前へ').parentElement;
    expect(prevButton).toHaveClass('pointer-events-none', 'opacity-50');
  });

  it('最後のページでは次へボタンが無効になる', () => {
    render(<Pagination {...mockProps} page={5} />);
    const nextButton = screen.getByText('次へ').parentElement;
    expect(nextButton).toHaveClass('pointer-events-none', 'opacity-50');
  });

  it('省略記号が表示される場合のテスト', () => {
    const longPageNumbers = [1, 'ellipsis' as const, 4, 5, 6, 'ellipsis' as const, 10];
    render(<Pagination {...mockProps} pageNumbers={longPageNumbers} totalPages={10} />);

    // "More pages"というスクリーンリーダー用テキストで省略記号を探す
    const ellipses = screen.getAllByText('More pages');
    expect(ellipses).toHaveLength(2);
  });

  it('モバイル表示で現在のページ/総ページ数が表示される', () => {
    render(<Pagination {...mockProps} />);
    const pageIndicator = screen.getByText('2 / 5');
    expect(pageIndicator.parentElement).toHaveClass('sm:hidden');
  });
});
