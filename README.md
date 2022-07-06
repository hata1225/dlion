# DLion - ファイル管理 SNS

管理したいファイルをアップロードすると、タイムラインに流れるwebアプリを目指して作製中。。。

## Requirement

> 立ち上げにあたり、事前に **docker-compose,yarnコマンド**が使えるようにしてください 🙏\
> \
> バージョンについて\
> Docker version 20.10.13\
> node: 18.4.0

## 立ち上げ方

1.  **git clone をする**

    `git clone git@github.com:hata1225/dlion.git`

2.  **clone してできた、dlion フォルダへ移動する**

    `cd dlion`

3.  **任意のブランチに切り替える**

    例: `git checkout develop/v1.0.0`

4.  **.env ファイルを作成する**

    `touch .env`

5.  **Django 用シークレットキーを、.env ファイルに書き込み**

    - 共同で運営、管理等する場合、シークレットキーは githubAccount: @hata1225 からもらってください。
    - 個人でソースを使う場合は、シークレットキーを自分で発行し.env ファイルに貼り付けてください。
      1. `cd django_api && python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())' && cd ../`
      2. 出力された文字列をコピー

    **.env ファイル内に、以下を例に記述(xxxxxxx...はコピーした文字列)**

          `SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

6.  **yarn installをする**

    dlion ディレクトリ直下でコマンドを叩いてください。
    `yarn install`

7.  **docker-compose build をする**

    最初は時間がかかるかもしれないです。
    `docker-compose build`

8.  **docker-compose up**

    `docker-compose up`

    > 一番下の行にこんなのが出たら、多分成功です。　\
    > 　　`react-app_1 | No issues found.`

9.  **localhost:3000 へ移動する**

    **http://localhost:3000**
