<br>
<br>

# DLion - ファイル管理 SNS

管理したいファイルをアップロードすると、タイムラインに流れる web アプリを作製中。。。

<br>
<br>

## 目次

- [⚙️ Requirement](https://github.com/hata1225/dlion/edit/main/README.md#%EF%B8%8F-requirement)
- [👀 画面設計(構想)](https://lh5.googleusercontent.com/fX7YNotu_3EWe1d6ZENl0mPMkT3SRh0WC_JwLeCbxWl3F6wN9_gXfG8Ms7jPLNrx1vixWjXWLnhvOTRux-HF=w2156-h1528-rw)
- [🌳 ブランチ管理について](https://github.com/hata1225/dlion/edit/main/README.md#-%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E7%AE%A1%E7%90%86%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)
- [⤴️ 立ち上げ方](https://github.com/hata1225/dlion/edit/main/README.md#%EF%B8%8F-%E7%AB%8B%E3%81%A1%E4%B8%8A%E3%81%92%E6%96%B9)
  - [立ち上げ 2 回目以降](https://github.com/hata1225/dlion/edit/develop/v1.0.0/README.md#%E7%AB%8B%E3%81%A1%E4%B8%8A%E3%81%92-2-%E5%9B%9E%E7%9B%AE%E4%BB%A5%E9%99%8D)
  - [立ち上げ初回](https://github.com/hata1225/dlion/edit/develop/v1.0.0/README.md#%E5%88%9D%E3%82%81%E3%81%A6%E7%AB%8B%E3%81%A1%E4%B8%8A%E3%81%92%E3%82%8B%E3%81%A8%E3%81%8D)
- [🛢 データベースのリセット方法](https://github.com/hata1225/dlion/edit/main/README.md#-%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E3%81%AE%E3%83%AA%E3%82%BB%E3%83%83%E3%83%88%E6%96%B9%E6%B3%95)
- [🍭 その他](https://github.com/hata1225/dlion/edit/main/README.md#-%E3%81%9D%E3%81%AE%E4%BB%96)

<br>
<br>

## ⚙️ Requirement

> ### コマンドについて
>
> 立ち上げにあたり、事前に以下のコマンドが使えるようにしてください 🙏
>
> - **docker-compose** (docker と docker-compose を install してください)
> - **npm** (node の install のみで OK です)
>
> ---
>
> ### バージョンについて
>
> - docker: 20.10.13
> - docker-compose: 1.92.2
> - node: 19.8.1
> - python: 3.11.2
> - Django: 4.1.7
> - DRF: 3.14.0
>
> ---
>
> ### 使用している Docker イメージについて
>
> - ubuntu: 22.10
> - node: 19.8.1-slim
> - selenium (docker hub から最新の image を引っ張ってる)
> - redis: redis:latest
>
> ---
>
> ### URL
>
> - フロント: [http://localhost:3000](http://localhost:3000)
> - バック(api 確認) : [http://localhost:8000/api](http://localhost:8000/api)
> - バック(管理画面) : [http://localhost:8000/admin](http://localhost:8000/admin)

<br>
<br>

## 👀 画面設計（構想）

<details>

![画面設計](https://lh3.googleusercontent.com/nRzfPmMVbbyvrw7XO_T2Hqz-Uk9Kj2yGbcYo4pGIRLjMKewo2auP54qUlDVImhk4hfYDJsgM6Reo0Ksk63pq=w2156-h1414-rw)

</details>

<br>
<br>

## 🌳 ブランチ管理について

> main
>
> > develop/[バージョン]
> >
> > > feature/[機能名]

**現在は、develop/v1.0.0 に直接コミットしています。**

- develop/[バージョン]

  例: develop/v1.0.0

- feature/[機能名]

  スネークケースで記述

  例: feature/maindata_view_card

<br>
<br>

## ⤴️ 立ち上げ方

### 立ち上げ 2 回目以降

<details>

1.  **立ち上げ**

        docker-compose up

    dlion ディレクトリ直下で実行

2.  **停止**

    ショートカット: cmd + c

</details>

### 初めて立ち上げるとき

<details>

1.  **git clone をする**

        git clone git@github.com:hata1225/dlion.git

2.  **clone してできた、dlion フォルダへ移動する**

        cd dlion

3.  **任意のブランチに切り替える**

        例: git checkout develop/v1.0.0

4.  **.env ファイルを作成する**

        touch .env

5.  **Django 用シークレットキーを、.env ファイルに書き込み**

    個人でソース(dlion)を使う場合は、シークレットキーを自分で発行し.env ファイルに貼り付けてください。

    1.  シークレットキー発行
        ```
        cd django_api && python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())' && cd ../
        ```
    2.  出力された文字列をコピー

        ターミナルに出力される文字列をコピー

    **.env ファイル内に、以下を例に記述(xxxxxxx...はコピーした文字列)**

        SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

6.  **superuser 情報を.env ファイルに追記**

    localhost:8000/admin にログインするとき & watchdog でディレクトリを監視、エンコード等で使います

        SUPER_USER_EMAIL=example@example.com
        SUPER_USER_PASS=password

7.  **yarn install をする**

    dlion ディレクトリ直下でコマンドを叩いてください。

        yarn install

8.  **docker-compose build をする**

    最初は時間がかかるかもしれないです。

    ubuntu を download したり、React で使用するモジュールを download したり色々やってくれます。

        docker-compose build

9.  **docker-compose up**

    docker-compose up

    しばらくした後、ターミナルの一番下の行にこんなのが出力されたら**多分成功**です。\
    `react-app_1 | No issues found.`

10. **localhost:3000 へ移動する**

    **http://localhost:3000**

11. **停止**

    ショートカット: cmd + c

12. **マイグレーションファイルを作製**

        docker-compose run --rm django_app sh -c "python3 manage.py makemigrations core"

    --rm: コンテナ停止後、コンテナを削除

    sh -c: シェルコマンド （bash -c: バッシュコマンド）

. **マイグレーションファイルをもとに、データベースへ反映**

        docker-compose run --rm django_app sh -c "python3 manage.py migrate core"

</details>

<br>
<br>

## 🛢 データベースのリセット方法

<details>

1.  **マイグレーションファイルを削除**

        django_api/migrations

2.  **データベース削除**

        django_api/db.sqlite3

3.  **マイグレーションファイルを作製**

        docker-compose run --rm django_app sh -c "python3 manage.py makemigrations core"

    --rm: コンテナ停止後、コンテナを削除

    sh -c: シェルコマンド （bash -c: バッシュコマンド）

4.  **マイグレーションファイルをもとに、データベースへ反映**

        docker-compose run --rm django_app sh -c "python3 manage.py migrate core"

</details>

<br>
<br>

## 🍭 その他

- docker-compose で動かしている docker イメージを更新する（現状は selenium の更新のみ）

      docker-compose pull | grep "Downloaded newer image" && docker-compose down && docker-compose up -d

- django に superuser を新しく作成する

  以下を実行

  ```
  docker-compose run --rm django_app sh -c "python3 manage.py createsuperuser"
  ```

  入力を求められるので、以下を例に入力

  ```
  Username (leave blank to use 'user1'): example
  Email address: example@example.com
  Password: # パスワードを入力
  Password (again):
  This password is too common. # パスワードが単純過ぎる場合はエラー発生
  Password:
  Password (again):
  Superuser created successfully.
  ```

- UI 実装時によく使っているライブラリ

  - [material ui v4](https://v4.mui.com/)

<br>
<br>

## 💻 自宅サーバー構築tips
### ハードについて
- RaspberryPi4B 4GB
- SSD 120GB
- HDD 4TB
### 行ったこと
- **SSDにOSを焼き付けた**
  - 参考: [Raspberry Pi ImagerでSSDをフォーマット](http://www.momobro.com/rasbro/tips-rp-raspberry-pi-image-format/)
- **OSの更新**
  - 参考: [raspberrypiのOSを更新する方法](https://qiita.com/akiraichi5430/items/6b9855f59fb3a3f9de35)
- **port番号の固定**
  - 参考: [初心者向！Raspberry Pi 最低限のセキュリティ設定](https://qiita.com/mochifuture/items/00ca8cdf74c170e3e6c6)
- **SSH接続**
  - 参考: [Raspberry Pi3のLAN外からのSSH接続設定方法](https://qiita.com/3no3_tw/items/4b5975a9f3087edf4e20)
- **sshのconfig設定で、ssh接続を楽に行う**
  - 参考: [~/.ssh/configを使ってSSH接続を楽にする](https://tech-blog.rakus.co.jp/entry/20210512/ssh)
- **dockerコマンド**
  - 参考: [Raspberry PiにDockerをインストール](https://qiita.com/homelan/items/0bb265cf92310d29cb82)
- **docker-composeコマンド**
  - 参考: [Raspberry Pi 4 に Docker と Docker Compose をインストールする](https://dev.classmethod.jp/articles/install-docker-for-raspberry-pi-4/)
- **oh my zsh**
  - 参考: [自分の Ubuntu の zsh を oh-my-zsh に設定する。](https://toxweblog.toxbe.com/2017/10/01/ubuntu-oh-my-zsh/)
  - 参考: [Themes(oh my zshのいろんなテーマがある)](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes)
- **ラズパイ to github の接続**
  - 参考: [【超簡単】git github 接続方法](https://qiita.com/Sub_Tanabe/items/4e03dcf42e3b0d19bb66)
