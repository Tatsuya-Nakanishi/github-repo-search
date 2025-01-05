import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from './index';

describe('SearchForm', () => {
  const mockProps = {
    handleSubmit: vi.fn((e) => e.preventDefault()),
    value: '',
    onChange: vi.fn(),
    placeholder: '検索キーワード',
    buttonText: '検索する',
  };

  it('入力フィールドとボタンが表示される', () => {
    render(<SearchForm {...mockProps} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '検索する' })).toBeInTheDocument();
  });

  it('プレースホルダーが正しく表示される', () => {
    render(<SearchForm {...mockProps} />);

    expect(screen.getByPlaceholderText('検索キーワード')).toBeInTheDocument();
  });

  it('入力値が変更されたときにonChangeが呼ばれる', () => {
    render(<SearchForm {...mockProps} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it('フォーム送信時にhandleSubmitが呼ばれる', () => {
    render(<SearchForm {...mockProps} />);

    const form = document.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);

    expect(mockProps.handleSubmit).toHaveBeenCalled();
  });

  it('デフォルト値が正しく設定される', () => {
    const { handleSubmit, value, onChange } = mockProps;
    render(<SearchForm handleSubmit={handleSubmit} value={value} onChange={onChange} />);

    expect(screen.getByRole('button')).toHaveTextContent('検索');
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', '');
  });

  it('カスタムクラス名が適用される', () => {
    const customClassName = 'custom-class';
    render(<SearchForm {...mockProps} className={customClassName} />);

    const form = document.querySelector('form');
    expect(form).toHaveClass(customClassName);
  });
});
