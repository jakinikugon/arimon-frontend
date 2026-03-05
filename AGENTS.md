# AGENT.md（jakinikugon プロジェクト共通ガイド）

## 1. 目的

本ファイルは、チームメンバーが Codex を使うときの共通ルールを定義する。  
目的は次の 2 点。

- 仕様理解のブレをなくす（どの資料を正とするかを統一）
- 実装方針のブレをなくす（型・API・UI 実装の作法を統一）

---

## 2. まず理解するべきプロダクト像

参照: `docs/design_notes/アイデア.md`

- 家庭の「冷蔵庫にある食材」と、店舗の「期限近い余りもの」をつなぐアプリ
- コア価値は「今日の食卓を成立させる」と「フードロス削減」の両立
- 主対象は 25〜40 代の共働き/子育て世帯（時短・節約ニーズ）

---

## 3. 仕様の一次情報（優先順位）

### UI/業務要件（上から優先）

1. `docs/design_notes/画面と機能.md`
2. `docs/design_notes/動線.md`
3. `docs/design_notes/アイデア.md`

### API/型要件（上から優先）

1. `docs/design_notes/api/detail.md`
2. `docs/design_notes/api/endpoint.md`
3. `docs/design_notes/api/sql_schema.md`
   
---

## 4. MVP 画面/機能の要点（設計資料準拠）

参照: `docs/design_notes/画面と機能.md`, `docs/design_notes/動線.md`

- 消費者向け
  - 余りもんチラシ一覧（検索/絞り込み/価格ソート）
  - 余りもん詳細（購入報告）(冷蔵庫追加動線は実装しない)
  - プロフィール兼設定（ユーザー名、アレルゲンなど）
  - 冷蔵庫・レシピ提案（食材追加削除、チャット、献立提案履歴）
- 店舗向け（準 MVP 含む）
  - 出品作成/編集/取消
  - 企業プロフィール公開
  - 期限切れ出品管理（準 MVP）

---

## 5. 実装ルール（チーム共通）

### 5.1 API 呼び出しの統一

- 画面から直接 `fetch` しない。`services/*` を経由する
- ただし、認証関係は`lib/auth`の関数を呼び出す

### 5.2 型の統一

- API 型は `types/api/*`、ドメイン型は `types/domain/*` に分離
- `docs/design_notes/api/detail.md` の命名規則  
  `Path + Method + (Request|Response)` を守る
- ID なし入力は `OmitId<T>` を使う

### 5.3 環境変数アクセスの統一

- `process.env` 直接参照は禁止（ESLint ルールあり）
- `lib/env.ts` の `EnvConfig` 経由で参照する

### 5.4 モック運用

- ローカルでモックを使う場合は `.env` の `NEXT_PUBLIC_USE_MOCKS=true`
- 新 endpoint 追加時は `types` と `services` だけでなく `mocks/handlers/*` も同時更新

### 5.5 API 契約上の重要点

参照: `docs/design_notes/api/detail.md`

- 空レスポンスは 204
- 401 時は`fetcher` 内で `POST /api/auth/refresh` を呼び出すため、基本的に再試行は不要。
- buyer 専用: `/api/buyers/me/**`
- store 専用: `/api/stores/me/**`
- 公開 endpoint は認証不要（items, stores/{id}, categories, jan, pantry/suggestions, upload）

---

## 6. 作業時の必須チェック

変更ごとに最低限次を実行する。

1. `npm run format`
2. `npm run typecheck`
3. `npm run lint`

失敗がある場合は、原因と影響範囲を明記する。

---

