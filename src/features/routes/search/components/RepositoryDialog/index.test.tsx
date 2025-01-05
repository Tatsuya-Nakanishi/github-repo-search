import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RepositoryDialog from './index';

const mockRepo = {
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
  description: 'Test repository',
  fork: false,
  url: 'https://api.github.com/repos/test-user/test-repo',
  language: 'TypeScript',
  forksCount: 100,
  stargazersCount: 1000,
  watchersCount: 50,
  openIssuesCount: 10,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
};

describe('RepositoryDialog', () => {
  it('トリガーボタンにリポジトリ名が表示される', () => {
    render(<RepositoryDialog repo={mockRepo} />);
    expect(screen.getByText('test-user/test-repo')).toBeInTheDocument();
  });

  it('ダイアログを開くと詳細情報が表示される', async () => {
    render(<RepositoryDialog repo={mockRepo} />);

    // ダイアログを開く
    fireEvent.click(screen.getByText('test-user/test-repo'));

    // 基本情報の確認
    expect(screen.getByText('test-user')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    // 統計情報の確認
    expect(screen.getByText('1,000 Stars')).toBeInTheDocument();
    expect(screen.getByText('50 Watchers')).toBeInTheDocument();
    expect(screen.getByText('100 Forks')).toBeInTheDocument();
    expect(screen.getByText('10 Open Issues')).toBeInTheDocument();
  });

  it('ダイアログを開くとXとFacebookのシェアボタンが表示される', () => {
    render(<RepositoryDialog repo={mockRepo} />);
    fireEvent.click(screen.getByText('test-user/test-repo'));

    // シェアボタンの存在を確認
    const xButton = screen.getByLabelText('X');
    const facebookButton = screen.getByLabelText('Facebook');
    expect(xButton).toBeInTheDocument();
    expect(facebookButton).toBeInTheDocument();

    // シェアボタンのpropsを検証
    const expectedUrl = mockRepo.htmlUrl;
    const expectedTitle = `GitHubリポジトリ: ${mockRepo.fullName}`;
    expect(expectedUrl).toBe('https://github.com/test-user/test-repo');
    expect(expectedTitle).toBe('GitHubリポジトリ: test-user/test-repo');
  });

  it('アバター画像が正しく表示される', () => {
    render(<RepositoryDialog repo={mockRepo} />);
    fireEvent.click(screen.getByText('test-user/test-repo'));

    const avatar = screen.getByAltText(`${mockRepo.owner.login}'s avatar`);
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src');
  });

  it('リポジトリリンクが正しいURLを持つ', () => {
    render(<RepositoryDialog repo={mockRepo} />);
    fireEvent.click(screen.getByText('test-user/test-repo'));

    const link = screen.getByRole('link', { name: mockRepo.fullName });
    expect(link).toHaveAttribute('href', mockRepo.htmlUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
