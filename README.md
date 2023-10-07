# ツール名

**デモスト動画**


## Table of Contents

**for general**

+ About
+ できること
+ ツール使い方
+ 信頼できるソースについて
+ ロードマップ

**for developers**

+ リポジトリの構成
+ 構成技術
+ 技術的なロードマップ
+ License

**for MWSCup**

+ 審査基準について


## About

MWSCupハッカソン課題の成果物(以下"プロジェクト"と呼ぶ)の検索・インストールを補助するデジタルプラットフォームです．

2023年10月現在，MWSCupのハッカソン課題(旧事前課題)のプロジェクトはおよそ80種類を超え，この先もますます増えていくことが予想されます．
プロジェクトの確認方法として，MWSCupデータセットやMWSCupのホームページ，Youtubeチャンネルなどがあり，プロジェクトの資料へのアクセス性は向上しております．
しかし，
1. 用途に合ったプロジェクトを探すのが大変
2. プロジェクトへのダウンロードリンクが資料から見つからずインストールできない
3. MWSCup以降のプロジェクト改良が行われておらず，安全面に少々不安を感じてしまう

という問題点を抱えています．

このツールは，プロジェクトの機能・形式による絞り込み・検索を実装し，インストール方法を明確化することで，過去のプロジェクトの「探す・利用する」を支援することを目的とします．
そして，プロジェクトへのアクセスと利用率を向上させることで開発者のモチベーションが高まり，メンテナンス頻度が増加することが期待されます．

## できること
1. プロジェクトをマーケットに登録できる
2. 登録されたプロジェクトの一覧を確認できる
3. プロジェクトをフィルター・検索できる
4. プロジェクトの詳細を確認できる
5. プロジェクトのインストール方法を確認できる

## 機能一覧

### SlackOAuthによるログイン

マーケットの利用にはログインが必要です．
mws2023 authがMWS slackワークスぺース(現在は試験的にUndanomi slack)へのアクセス権限を要求してくるため，内容を確認のうえ，問題がなければ"許可する"を押してください．

**デモスト**
### プロジェクトの閲覧
プロジェクトを閲覧できるページとして，プロジェクト一覧ページとプロジェクト詳細ページの2つが存在します．
#### プロジェクト一覧ページ
プロジェクトの一覧を確認することができるページです．
以下のものが表示されています．
- プロジェクトのタイトル
- プロジェクトのアイコン
- プロジェクトの評価
- プロジェクトを開発したチーム名
- プロジェクトの説明

また一覧ページでは，以下のことができます．
- プロジェクトのカテゴリー検索
- プロジェクトのキーワード検索

**デモスト**

#### プロジェクト詳細ページ
各プロジェクトに関する情報が記載されているページです．
一覧ページで確認できる内容に加えて，以下のものが表示されています．
- プロジェクトのYoutubeリンク
- プロジェクトのスクリーンショット
- プロジェクトの説明全文

またプロジェクト詳細ページでは，以下のことができます．
- プロジェクトのダウンロード
- プロジェクト情報の編集(ご自身が登録したプロジェクトのみ)

### チーム
マーケットへのプロジェクトの登録には"チーム"に所属している必要があります．
"チーム"とは，MWSCupに参加する団体グループを指します(例. UN頼み)
1つのチームが登録できるプロジェクトは1つのみとなります．

チームへの所属方法としては次の2通りがあります．
1. ご自身でチームを作成する
2. ほかのチームメンバーにチームに招待してもらう

以下，所属チームの確認方法とチームへの所属方法について説明します．

#### 所属チーム確認方法
マイページ(右上のアイコンから遷移可能)に，所属するチームの一覧が表示されます．クリックすることで，各チームの詳細情報を確認できます．

**画像**

#### チーム作成
マイページの左下の"add team"からチームの作成が可能です．
チーム作成には，以下の情報の入力が必要となります．
- Team名(Team Name)
- MWSCupへの参加年(Year)
- チーム説明(Description)

作成したチームには以下の情報が付与されます．
これらの情報は，それぞれ後述するチーム継承，チーム招待で使用します．
- Team Secret
- Team共有リンク

#### チームへの招待
チームの詳細画面に表示されているTeam共有リンクを招待したいメンバーに共有することで，他の参加者をチームに招待することができます．

**説明画像**

#### チーム継承

**デモストgif**

### プロジェクト登録ページ
プロジェクトの登録はチームのページから行えます．
登録の際には，以下の情報が必要となります．
- プロジェクトの名前
- プロジェクトのアイコン
- プロジェクトの説明
- プロジェクトのスクリーンショット
- プロジェクトのgithub release
- プロジェクトのgithubリンク
- プロジェクトのYoutube共有リンク

**デモストgif**

### READMEの自動生成

**デモストgif**

### レビュー・採点の補助機能

**デモストgif**

## 開発ロードマップ

*for MWSCup*

## 審査基準について

### 要件

- Github上で公開し，容易に利用・改変可能となっている
- チームで協力して作成している
- 成果物による法令順守違反及び倫理問題はない

### 新規性

- MWSハッカソン課題を対象としたデジタルプラットフォーム

### 実用性

- MWSCupハッカソン課題のプロジェクトを体系的に整理し，以前はできなかったプロジェクトの検索・インストールの補助を可能にした
- SlackOAuthによるログイン機能やレビュー・採点機能など，ユーザーだけでなくMWSCupの運営を支援する機能も備えている．
- このツールは昨年度のMWSCup振り返りのアンケートに(ここ諸説)記載されていた内容に基づいて開発したため，有効性は高い

### 継続性

- READMEにて利用方法，改良方法を提示しました
- README内のロードマップにて，開発のこれまでと今後を可視化しました

### チームワーク

- コーディングに関しては適切に分担し，ペアプログラミングなどの手法も取り入れながら作業を進めました．
- コーディングタスクが存在しないメンバーもツールの開発・発表に必要なタスクを適切に分担しました．具体的なタスクの分担はプライバシーの関係でここでは省略します．

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
