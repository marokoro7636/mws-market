#　　起動方法
環境変数を記載し，Dockerを起動してください．

## 環境変数

## Dockerの起動
###　開発環境
- Fast APIのホットリロードが動作する
- Next.jsのホットリロードが動作する
```
docker compose --profile=dev up
```

###　本番環境
- Fast APIのホットリロードが動作する
- Next.jsのホットリロードが動作しない
```
docker compose --profile=prod build
docker compose --profile=prod up
```

###　起動するサーバ
- リバースプロキシ
  - http://localhost:18180
- APIサーバ
  - http://localhost:18181
- フロントエンドサーバ
  - http://localhost:18182

#　使い方
リバースプロキシで二つのサーバを1つにまとめています
- フロントエンドへアクセス
  - http://localhost:18180
  - 開発環境では時間がかかるのでログをみつつ進めてください
- バックエンドへのアクセス
  - http://localhost:18180/api/
- Swaggerへのアクセス
  - http://localhost:18180/docs
  - スラッシュがない状態じゃないとつながらないです
