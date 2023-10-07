## 開発

### 起動方法

#### 開発環境

- Fast APIのホットリロードが動作する
- Next.jsのホットリロードが動作する

```
docker compose --profile=dev up
```

#### 本番環境

- Fast APIのホットリロードが動作する
- Next.jsのホットリロードが動作しない

```
docker compose --profile=prod build
docker compose --profile=prod up
```

### 起動するサーバ

- リバースプロキシ
  - http://localhost:18180
- APIサーバ
  - http://localhost:18181
- フロントエンドサーバ
  - http://localhost:18182

### 使い方

リバースプロキシで二つのサーバを一つにまとめている
基本的には相対パスで書いておけば問題なし

- フロントエンドへアクセス
  - http://localhost:18180
  - 開発環境では時間がかかるのでログをみつつ進めること
- バックエンドへのアクセス
  - http://localhost:18180/api/
- Swaggerへのアクセス
  - http://localhost:18180/docs
  - スラッシュがない状態じゃないとつながらないようにしているので注意すること
