# Contribution Guide

MINT(本プロジェクト)へのコントリビュート方法についてのガイドです。

## Issues
次のIssueを受けつけています。

- 使い方など本プロジェクトに関する質問
- エラーや問題の報告
- 新しい機能などの提案

その他のIssueも歓迎しています。

## Pull Request
Pull Requestはいつでも歓迎しています。  
次の種類のPull Requestを受け付けています。

以下の内容はIssue立てずにPull Requestを送ってください。
- 誤字の修正
- 各ドキュメントの修正

以下の内容はIssueを立てて相談してください。
- バグ・不具合の修正
- 新しい機能の追加

## 起動方法
本プロジェクトはDocker上で動作し、データベースとしてFirebaseを使います。  
認証にはSlack OAuthを使います。

### Firebaseの設定
以下の手順でデータベースを作成してください。

1. Firebaseでプロジェクトを追加
2. adminSDKに登録、トークンを取得
3. 本プロジェクトのルートに`creds`というディレクトリを作成し、`firebase.json`を追加

### SlackBotの導入
自身のワークスペースにSlackBotを導入してください。  
その時のScopeは以下のようにしてください。

### 環境変数の設定
Firebase、SlackBot、OpenAIのSecretsを設定します。

1.  OpenAIのアクセストークンを発行
2. NextAuthのシークレットを生成(任意の文字列)
   - `openssl rand -base64 32`などで生成
2. `creds`ディレクトリに`.env.frontend`と`.env.backend`を作成
- `.env.frontend`
```
SLACK_ID="[SlackBotのID]"
SLACK_SECRET="[Slackのアクセストークン]"

NEXTAUTH_URL="https://[自分のサーバのドメイン]/auth"
NEXTAUTH_SECRET="[NextAuthのシークレット]"

GOOGLE_APPLICATION_CREDENTIALS="/app/firebase.json"
```
- `.env.backend`
```
CRED_PATH=/app/creds/firebase.json
OPENAI_API_KEY=[Open APIのアクセストークン]
```

### コンテナの起動
Docker composeによりAPIサーバ、Next.js用サーバ、リバースプロキシサーバが起動します。  
開発環境、本番環境を使い分けることができます。

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

#### 起動するサーバ
- リバースプロキシ
  - http://localhost:18180
- APIサーバ
  - http://localhost:18181
- フロントエンドサーバ
  - http://localhost:18182

### 各サーバへのアクセス

リバースプロキシで二つのサーバを1つにまとめています。  

- フロントエンド(トップ画面)へのアクセス
  - http://localhost:18180
  - 開発環境では時間がかかるのでログをみつつ進めてください
- バックエンドへのアクセス
  - http://localhost:18180/api/
- Swaggerへのアクセス
  - http://localhost:18180/docs
  - スラッシュがない状態じゃないとつながらないです
