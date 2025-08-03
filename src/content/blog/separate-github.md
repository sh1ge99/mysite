---
title: "GitHubアカウントを使い分ける方法"
pubDate: 2025-08-03
tags: ["Dev"]
---

## はじめに

会社の人とも GitHub アカウントを共有する機会があったので、仕事用の GitHub アカウントを新たに作成し、プライベートと仕事用でそれぞれアカウントを使い分けるときに快適にアカウントの切り替えができるように設定を行いました。
その中で行き詰まった点がいくつかあったので、それを振り返りながらメモとして残しておこうと思った次第です。
:::message
本記事は現在使用している GitHub アカウントを Private 用とし、2 つ目の会社用 GitHub アカウントを新たに追加することを前提として説明を行なっております。
:::

## 動作環境

- マシン : M1 MacBookAir
- OS : MacOS Sequoia
- シェル : zsh 5.9 (x86_64-apple-darwin24.0)

## 手順

### 新しい SSH 鍵（公開鍵と秘密鍵）を生成する。

```shell
# ~
# .sshディレクトリに移動
cd ~/.ssh
```

```shell
# shell:~/.ssh
# .sshディレクトリに移動
ssh-keygen -t ed25519 -C "your_email@example.com"
```

`ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`を実行すると、以下のメッセージが表示されるのでそれぞれに答えた後、SSH 鍵（公開鍵・秘密鍵）が生成されます。
:::message
`Enter file in which to save the key (/Users/user/.ssh/id_ed25519):`のファイル名は任意と記載しているが、同一ファイルの場合は上書きされてしまう為、既存の Private 用のファイル名と被らないように名前を設定しましょう。
:::

```shell
# ~/.ssh
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/user/.ssh/id_ed25519): work # Work用のファイル名を入力（ファイル名は任意）
Enter passphrase (empty for no passphrase): # [Type a passphrase]
Enter same passphrase again: # [Type passphrase again]
```

鍵が生成されていることを確認する。

```shell
# ~/.ssh
ls
private    private.pub    work    work.pub    known_hosts
```

### 生成された SSH キー(公開鍵)を GitHub アカウントへ追加する

work アカウントの公開鍵をコピ-する。

```shell
# ~
cat ~/.ssh/work.pub
```

```shell
# ~/.ssh/work.pub
ssh-ed25519 XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX your_email@example.com
```

以下 URL にアクセスして、「New SSH Key」をクリック
[https://github.com/settings/keys](https://github.com/settings/keys)

![](https://storage.googleapis.com/zenn-user-upload/2de3b2913d5f-20241104.png)

- 「Title」は任意
- 「Key type」はそのまま。
- 「Key」は先ほどコピーした work.pub の中身をコピペする。

入力完了後、「Add SSH Key」をクリックして完了。

### config ファイルの設定

どの SSH 鍵を使用してどの GitHub アカウントにアクセスするかを区別するためです。
ここでは、Private 用と Work 用を自動的に使い分けられるように config ファイルの設定を行います。
Vim で config ファイルを編集する。

```shell
# ~/.ssh
vi config
```

```shell
# ~/.ssh/config
# privateアカウント
Host github-private
  HostName github.com
  IdentityFile ~/.ssh/private # privateアカウントの秘密鍵のファイル
  User git
  Port 22
  TCPKeepAlive yes
  IdentitiesOnly yes

# workアカウント
Host github-work
  HostName github.com
  IdentityFile ~/.ssh/work # workアカウントの秘密鍵のファイル
  User git
  Port 22
  TCPKeepAlive yes
  IdentitiesOnly yes
```

#### 設定の意味

- `Host`: 識別名です。リポジトリのリモート URL でこの名前を使います。
- `HostName`: 実際のホスト名です。GitHub なら github.com。
- `User`: SSH 接続時のユーザー名。Git では常に git になります。
- `IdentityFile`: この接続に使用する SSH キーのパスです。個人アカウントと仕事用アカウントで別々のキーを指定します。
- `User`: SSH 接続に使うユーザー名です。GitHub の場合は常に git です。
- `Port`: SSH 接続に使用するポート番号です。標準の SSH ポートである 22 が指定されています。
- `TCPKeepAlive`: 接続が自動で切れないように、TCP 接続を定期的に保つ設定です。yes にすると、SSH 接続が長時間アイドル状態になっても維持されやすくなります。
- `IdentitiesOnly`: 明示的に指定した鍵のみを使用するオプションです。これにより、他の SSH 鍵が自動的に試されるのを防ぎます。

上記の設定を行ったら、`:wq`で保存して終了する。

### 接続確認

下記コマンドで SSH 接続ができるか確認する。

```zsh
# privateアカウントの接続を確認する
ssh -T github-private
Hi [privateアカウントのユーザー名]! You've successfully authenticated, but GitHub does not provide shell access.

# workアカウントの接続を確認する
ssh -T github-work
Hi [workアカウントのユーザー名]! You've successfully authenticated, but GitHub does not provide shell access.
```

上記の通り出力されたら OK。

### ディレクトリごとに GitHub アカウントを切り替える

Git アカウントを複数管理していると、アカウント切り替えが非常に面倒になります。これを解決してくれるのが、`includeIf`です。

#### 1. **`~/.gitconfig` に次を追加**

```ini
[includeIf "gitdir:~/work/"]　
    path = ~/.gitconfig_work
```

この設定は、`~/work/` 配下のリポジトリに対して、特定の Git 設定（ここでは`~/.gitconfig_work`）を適用するためのものです。

#### 2. **`~/.gitconfig_work` を作成**

```ini
[user]
    name = work.name // Work用
    email = your_work_email@example.com
```

#### 3. **リモート URL 変換の設定を追加**

メインの `~/.gitconfig` に以下を追加します。

```ini
[url "git@github-work:"]
    insteadOf = git@github.com:
```

#### 4. **いざ実証**

Work ディレクトリに移動してリポジトリをクローンします。

```bash
cd ~/work
git clone "git@github.com:username/repository.git"
```

クローンが成功したら、リモート URL が正しく設定されているか確認しましょう

```bash
cd repository
git remote -v
```

以下のように`git@github-work:`が表示されれば成功です。

```bash
origin  git@github-work:username/repository.git (fetch)
origin  git@github-work:username/repository.git (push)
```

## まとめ

これでとりあえず GitHub の複数アカウントの運用はできそうです。
もっと効率的な切り替え方法があれば、また更新してい来たいと思います。

## 参考文献

- [https://zenn.dev/taichifukumoto/articles/how-to-use-multiple-github-accounts](https://zenn.dev/taichifukumoto/articles/how-to-use-multiple-github-accounts)

- [https://docs.github.com/ja/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-your-personal-account/managing-multiple-accounts](https://docs.github.com/ja/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-your-personal-account/managing-multiple-accounts)

- [https://docs.github.com/ja/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent](https://docs.github.com/ja/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

- [https://zenn.dev/hr0t15/articles/2f65b5a776b45c](https://zenn.dev/hr0t15/articles/2f65b5a776b45c)

- [https://qiita.com/shungo_m/items/387d70b1645ae03435b5](https://qiita.com/shungo_m/items/387d70b1645ae03435b5)
