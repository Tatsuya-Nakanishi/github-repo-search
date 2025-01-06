# GitHubリポジトリ検索ツール
![image](https://github.com/user-attachments/assets/ef327963-5ebd-425e-998d-23775d9d5ad6)

## 機能一覧
| キーワード検索 | 検索履歴 |
| --- | --- |
| ![image](https://github.com/user-attachments/assets/4f532a21-7ccb-42a2-8d18-6c7ec02faec5) | ![image](https://github.com/user-attachments/assets/3a069630-f448-496e-8c56-101123174f43) |
| 検索したいキーワードを入力し、検索ボタンを押すと、検索結果一覧が表示される | 検索フォームの下に最新の検索履歴5件が表示される。<br>履歴押下で検索結果一覧が表示される。<br>検索履歴クリアボタンで履歴をクリアできる。 |

| 検索一覧  | 検索詳細 |
| ------------- | ------------- |
| ![image](https://github.com/user-attachments/assets/d8ceabb9-fd09-4198-9c26-6a4a0455b188)  | ![image](https://github.com/user-attachments/assets/f621dac5-2c27-4c8e-b54a-55ddb48fc613)  |
| 20件ずつ表示。<br>並び替え(スター順・新着順)、ページネーションができる。  | 該当リポジトリの詳細（リポジトリ名、オーナーアイコン、プロジェクト言語、Star 数、Watcher 数、Fork 数、Issue 数）を表示<br>SNS共有(X, Facebook)ができる。 |
## 環境構築
```bash
# 依存ライブラリのインストール
npm install

# git hooksのインストール
npm run prepare

# .env.localを作成
cp .env.example .env.local

# 環境変数を設定
以下を参考にNEXT_PUBLIC_GITHUB_TOKENを設定してください。
※トークン発行の際はリポジトリアクセス権限等全てのアクセス権限を付与しないでください。

https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

# 開発環境起動
npm run dev
```

## 主な技術構成
- Next.js:15系(App Router)
- React:19系
- TailwindCSS
- TypeScript
- shadcn/ui
- SWR
- ESLint
- Prettier
- Husky
- Vitest

## 技術的な工夫・選定理由

「プロダクションを意識したコーディング」をするにあたり、以下の点を意識しました。
- 開発速度の向上
- メンテナンス性と拡張性の確保
- コードの一貫性と品質の確保
- パフォーマンスの最適化
- チーム開発の効率化

この前提のもと行った技術的な工夫・選定理由を以下に記載します。
### UI・スタイリング
UIライブラリにはshadcn/ui、CSSにはTailwindCSSを使用しています。
<br>
【理由】
- **shadcn/ui**
    - 拡張性が高い
    - npm等の依存関係にないため、バージョンアップが容易
    - 生成AI(V0)との相性がよく、素早くUIを作成できる
- **TailwindCSS**
    - shadcn/uiで利用されている
    - CSSのクラス名の命名コストが削れる

### データフェッチ
SWRで非同期通信を行い、GitHub APIからデータを取得しています。
<br>
【理由】
- Next.js公式がCSRではSWR等のライブラリ利用を推奨している
- 記述がシンプルで、コードの可読性が高まる
- 高速かつ軽量
- キャッシュを利用し、検索結果を高速に表示できる

### ディレクトリ構成
Featuresをベースにした構成にしています。
<br>
<pre>
src
├── app          ・・・ルーティング
├── features     ・・・ロジック + コンポーネントをまとめたもの
│   ├── common   ・・・共通部分
│   └── routes   ・・・ページ特有
├── components   ・・・ロジックを持たないUIコンポーネント
│   ├── custom  ・・・自作のUIコンポーネント
│   └── ui      ・・・shadcn/uiのコンポーネント
├── constants    ・・・共通で利用する定数を定義
├── hooks        ・・・共通ロジックの内、React Hooksが「ある」もの
├── lib          ・・・共通ロジックの内、React Hooksが「ない」もの
├── types        ・・・共通で利用する型定義
</pre>
検索ページ(features/routes/search)のディレクトリ構成
<br>
UIとロジックを分離し、役割ごとにディレクトリを分けています。
<pre>
features/routes/search
├── components
│   ├── Pagination           ・・・ページネーションUIコンポーネント
│   │   ├── index.test.tsx
│   │   └── index.tsx
│   ├── RepositoryDialog     ・・・リポジトリ詳細ダイアログUIコンポーネント
│   │   ├── index.test.tsx
│   │   └── index.tsx
│   ├── SearchForm           ・・・検索フォームUIコンポーネント
│   │   ├── index.test.tsx
│   │   └── index.tsx
│   ├── SearchResults        ・・・検索結果一覧UIコンポーネント
│   │   ├── index.test.tsx
│   │   └── index.tsx
│   ├── index.test.tsx
│   └── index.tsx            ・・・各コンポーネントのラッパー
└── hooks
    ├── usePagination          ・・・ページネーションロジック
    │   ├── index.test.ts
    │   └── index.ts
    ├── useSearchForm          ・・・検索フォームロジック
    │   ├── index.test.ts
    │   └── index.ts
    ├── useSearchRepositories  ・・・リポジトリ検索ロジック
    │   ├── index.test.ts
    │   └── index.ts
    └── useSearchResults       ・・・検索結果一覧ロジック
        ├── index.test.ts
        └── index.ts
</pre>
<br>

[参考](https://qiita.com/miumi/items/359b8a77bbb6f9666950)
<br>
【理由】
- 機能・ページ単位でディレクトリを管理したかったから。
   - コードの確認を容易にする
   - 影響範囲を限定しやすい
- 責務を明確にしやすい。
- Atomic Designと比べても認知負荷が低く、ファイルの設置場所がわかりやすい。
  - 現案件でAtomic Designを導入しているが、うまく機能していなかったため他のデザインパターンを検証したかった。
  - 「共通で使えるかどうか」、「ロジックを持つかどうか」で判断ができるためシンプル。

### git hooks
huskyを利用して、
<br>
コミット時にESLint、Prettier
<br>
プッシュ時に型チェック、Vitestを実行するように設定しています。
<br>
【理由】
- コーディング規約を統一し、事前チェックを行うことでレビューコストを削減したいから。
- 事前にバグを検出できるため、デプロイ後のバグ修正コストを削減したいから。

### テスト
Vitestを利用したフロントエンドテストを導入しました。
<br>
一旦はロジックを持つFeatures配下でテストを行っています。
<br>
【理由】
- テストケースを日本語で書き、仕様を明確にできるから。
- 動作を担保し、デグレを防ぐことができるから。

### その他
- 検索履歴はローカルストレージに保存し、ブラウザを閉じても保持されるようにしています。
- できるだけ、関数にはuseCallback、計算にはuseMemoを利用して、不要な再レンダリングを防ぐようにしています。

## 導入を見送ったもの

### SSR
今回はSEO対策や初期表示でのデータフェッチの必要がなかったためどうしてもSSRを使いたい理由がなかったから。

### React.Memoによるコンポーネントのメモ化
レンダリング抑制に効果的ですが、各コンポーネントのpropsの値の更新が多いのと、
<br>
React公式がほとんどの場合で必要ないと言及しているため。
<br>
[参考](https://ja.react.dev/reference/react/memo#should-you-add-memo-everywhere)

### SuspenseによるローディングUIの制御
App Routerでは、loading.tsxでより柔軟にローディングUIを表示できるが、
<br>
今回のデータフェッチではSWRを利用しており、SWR公式がSuspenseの利用を推奨していないため。
<br>
[参考](https://swr.vercel.app/ja/docs/suspense)

## 今後の課題
- 現状だと、githubのアクセストークンがパブリックになってしまうため、githubAPIへのアクセスをServer Actionsで行うようにしたい。
- ESLintの実行自体はできているが、selint.config.mjsの設定が反映されていないため修正が必要
- E2Eテストの導入
  - 動作全体のテストを行いたいから。
- Storybookの導入
  - コンポーネントのカタログを作成し、開発者やデザイナーにUIを共有したいから。
- Vercelにデプロイ