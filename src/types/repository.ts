export type RepositoryItemsType = {
  id: number;
  fullName: string;
  htmlUrl: string;
  description: string;
  owner: {
    avatarUrl: string;
    login: string;
  };
  stargazersCount: number;
  language: string;
  watchersCount: number;
  forksCount: number;
  openIssuesCount: number;
};

export type RepositoryType = {
  items: RepositoryItemsType[];
  totalCount: number;
};
