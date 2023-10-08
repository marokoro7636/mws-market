# MINT(MWS INTeligence)

**デモスト動画**

## Table of Contents

**for general**
- About
- 実用性と利便性
- 使い方


**for developers**
- ロードマップ
- リポジトリの構成
- 構成技術


**for MWSCup**

+ 審査基準について

## About
MINTはプロジェクト(ハッカソン課題)の情報を一元管理し，プロジェクトの利用・開発を支援するデジタルプラットフォームです．

プロジェクト情報の体系的な整理によるアクセシビリティの向上，およびコミュニティに寄り添ったプラットフォーム化により，プロジェクトの普及率向上とMWSCupの繁栄が本ツールの目的です．


### MWSCupの事前課題とその問題
2023年10月現在，MWSCupのハッカソン課題(旧事前課題)　のプロジェクトは80件を超え，この先もますます増えていくことが予想されます．

これに対し，現状のプロジェクトのアクセス方法は以下の3つです．
- MWSCupデータセット
- MWSCupホームページ
- YouTubeチャンネル

YouTubeチャンネルの追加により，アクセス性はアクセス性は確実に向上していますが，せっかく作ったツールが使われない，普及しないといった課題は広く認知されています．

これら問題の原因は以下の3つだと考えます．
- 用途に合ったツールを探すのが困難である
- ツールへのダウンロードリンクが資料から見つからずインストールができない
- MWSCupでの発表以降のツールのメンテが行われておらず，安心して利用できない

### MINTが提供する価値
MINTは以下の価値を提供します．
- 情報の一元化によりツールの探索を支援する
- インストール方法まで含めて一貫した説明ができる
  - ツールが見つかっても利用ができない事態を解消
- 作って終わりではなく，実用的なレベルまで到達・維持できるようにプロジェクトの価値を高める
  - プロジェクトの反響を可視化
    - メンテのモチベーションの向上
    - 就活・転職で活用できる形でプロジェクトの情報を公開

単なるツールでは以上の価値を提供することができません．
私たちはこれら価値の達成には当たり前に利用されること，継続的に利用されることが不可欠だと考えます．
そこで，このプロジェクトはプラットフォーム化を目的としました．

## MWSCupのプラットフォームとしての実用性と利便性
今後も開催されるMWSCupでコンテンツの拡大が予想されるため早い段階で体系的な管理が必要です．

MINTはMWSCupにフォーカスしたプラットフォームとするために以下のような工夫をしています．
- MWS参加者へのインセンティブ
  - MWSはマルウェア対策研究**人材育成**ワークショップであるため，参加者の人材育成が目的
  - MINTが参加者のキャリア形成に貢献
  - プロジェクトを単にGitHub上で公開するのではなく，MWSコミュニティからの反響も含めて，就活や転職で活用できる形で公開
- Slack認証
  - MWSはSlackでコミュニティを管理
  - Slackを認証基盤として，アカウントの管理コストを抑制
- コンテンツ作成の支援
  - ChatGPTを用いてYouTubeの発表動画やGitHubのREADMEからプロジェクトの説明文を自動生成

今後も利用されるプラットフォームを目指して，機能の拡充や工夫をしていきます．

## 使い方
- デモの詳細な利用方法は[HOW_TO_USE](https://github.com/marokoro7636/mws-market/blob/main/HOW_TO_USE.md)を参照のこと

## ロードマップ
### ツール開発のロードマップ
- [完了]基本的な機能
  - プロジェクトの閲覧，条件に応じた絞り込み
  - プロジェクトの詳細の閲覧
  - プロジェクトの登録
  - チームの管理
  - プロジェクトのインストールの説明
- [完了]実用性のための機能
  - Slackを使用したログイン
  - 生成系を活用した説明文の生成
  - レビューなどMWSコミュニティと連携させる機能
- [完了]今後のための工夫
  - 高速にプロトタイピングする工夫
  - 大規模化に耐えうる設計
  - 運営元を移行する前提の設計

### プラットフォーム化のロードマップ
今後，このツールの有用性が認められ，運用する場合は以下の項目に取り組む必要があると考えます．
- 運営方法の調整
  - 運営体制の調整
    - 計算資源の確保
    - 継続的な改良のための体制作り
  - MWSコミュニティへの普及
    - プラットフォームに適した形式でのプロジェクトの成形
- サービス品質の向上
  - モバイルへの対応
  - データの整合性の保証，トランザクション化
- 運営と改善
  - コミュニティの意見を取り入れて継続的に改善
  - プロジェクトのサービスの実現に協力

**UN頼みチームはMWSコミュニティに対する貢献としてこのプロジェクトに参加する意思があります**

## リポジトリの構成

```
/
|--- .github/workflows/
|     自動リリースのGithub Actionsの設定ファイル
|--- api/
|     DB(Firebase)と通信し、情報の登録や削除を行うAPIサーバ(FastAPI/Python)
|       |--- Dockerfile
|              APIサーバが動作するコンテナのビルドに必要
|--- caddy/
|     リバースプロキシの設定ファイル
|--- frontend/
|     本プロジェクトの構成画面(Next.js/TypeScript)
|       |--- Dockerfile
|              Next.jsが動作するコンテナのビルドに必要
|--- compose.yml
      各サーバ(フロントエンド、バックエンド、リバースプロキシ)を起動するためのDocker compose設定ファイル
```

## 構成技術

> [!NOTE]
> 全体像

### フロントエンド
- React/Next.js 13製
  - 大規模化に最も適したフレームワークと判断
  - コンポーネント化で隠蔽できる&多くの人が開発できる
- UIフレームワークはMaterial UI
  - モダンなUIを実装するための
- NextAuthによるユーザ認証
  - 認証周りのOAuthのハンドリング
  - Nextはサーバとクライアント同時に動くので，状態の管理として

### バックエンド
- Python製
  - 多くの人が開発できる，CMSなので速度<柔軟性
- WebフレームワークはFastAPI
  - Hot reloadで高速なプロトタイピング
  - APIドキュメントの自動生成のため
- APIドキュメント([Swagger](https://mws2023.pfpf.dev/docs))
  - 開発時の検証用として利用
  - 型も定義し，これだけでフロントチームと会話できるように
- Firebase
  - 高速なプロトタイピングに適した柔軟性
     - 豊富なドキュメント
     - 複数の便利な機能が利用できる
     - デバッグの容易さ
     - SchemeレスなNoSQL
  - 低コストでの運用が可能
     - 基本的には無料枠に収まる
  - 拡張性に富む
     - スケーリングなどにも容易に対応
- 生成系AIを活用した機能
  - YoutubeとGithubから説明文を自動作成する

### その他
- リバースプロキシの利用
  - 計算資源の隠蔽による構成の柔軟さ
  - ヘルスチェックも含めた冗長化
- Dockerによる構成
  - 開発環境の共有
  - 運用の移行のしやすさ
  - 複雑なシステムの容易な管理
  - 自動デプロイなどの用意さ

## Contribution

このプロジェクトはどんなContributionも歓迎します．
開発方法，Contributionに関する詳細は[CONTRIBUTING](https://github.com/marokoro7636/mws-market/blob/main/CONTRIBUTING.md)を参照ください．

## License

This software is released under the MIT License, see LICENSE.

*for MWSCup*


## 審査基準について

### 要件

- GitHub上で公開し，容易に利用・改変可能となっている
- チームで協力して作成している
- 成果物による法令順守違反及び倫理問題はない
  - デモサイトでは過去成果物の情報を一部お借りしています

### 新規性

- MWSハッカソン課題を対象としたデジタルプラットフォーム
- MWSハッカソン課題に対して付加価値をつけることを目的としている

### 実用性

- MWSCupハッカソン課題のプロジェクトを体系的に整理し，以前はできなかったプロジェクトの検索・インストールの補助を可能にした
- Slack認証によるログイン機能やレビュー・採点補助機能など，ユーザー・MWSCupの運営を支援する機能も備えている
- MINTは昨年度のMWSCup振り返りのアンケートに記載されていた内容に基づいて開発した

### 継続性

- プラットフォーム化することによって，MWSCupが続く限りこのツールは成長する
- プラットフォーム化を前提とした設計・運用の準備を行っている
- 開発方法・貢献方法を明記し，CDパイプラインを用意するなど開発に取り組むハードルをできるだけ取り除いた

### チームワーク

- 設計～コーディング，調査，レビューなど各分野の得意・不得意に合わせてメンバー全員で分担した
- GitHubの機能をフル活用し，マルチタスクに一丸となって課題に取り組んだ
