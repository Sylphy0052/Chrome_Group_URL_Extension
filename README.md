# Tab URL Exporter

現在のウィンドウで開いているタブのURL一覧を、テキストファイル (.txt) としてダウンロードするChrome拡張機能です。

## 機能

- 拡張アイコンをクリックすると、その場でダウンロードが始まります (ポップアップや確認ダイアログはありません)
- 対象は**アクティブなウィンドウの全タブ**です。タブの並び順 (左から右) を保持します
- 出力形式は**1行1URL**のプレーンテキストです
- `chrome://` や `file://` などの特殊なURLもフィルタせず、そのまま出力します
- ファイル名は `tabs-YYYYMMDD-hhmmss.txt` (実行時のローカル時刻) です

### 出力例

```
https://example.com/a
https://example.com/b
chrome://extensions
```

## インストール (未パッケージ拡張機能の読み込み)

1. Chromeで `chrome://extensions` を開く
2. 右上の「デベロッパーモード」をオンにする
3. 「パッケージ化されていない拡張機能を読み込む」をクリックする
4. このリポジトリのディレクトリを選択する
5. ツールバーに拡張機能をピン留めしておくと使いやすくなります

## 使い方

ツールバーの拡張アイコンをクリックするだけです。処理結果はアイコンのバッジで2秒間表示されます。

- `OK` (緑): ダウンロード成功
- `0` (グレー): 出力対象のURLが0件
- `ERR` (赤): エラー。詳細は `chrome://extensions` の「Service Worker」からコンソールを確認してください

保存先はChromeのダウンロードフォルダです。

## 権限

- `tabs`: タブのURLを取得するために必要です
- `downloads`: 生成したテキストファイルを保存するために必要です

外部への通信は一切行いません。取得したURLはファイル生成のみに使用します。

## 構成

```
manifest.json   拡張機能の定義 (Manifest V3)
background.js   アイコンのクリックを受けてURLを収集・ダウンロードするService Worker
icons/          拡張アイコン (16/32/48/128px)
```

## 実装メモ

Manifest V3のService Workerでは `URL.createObjectURL()` が利用できないため、ファイルの内容は `data:` URLとして `chrome.downloads.download()` に渡しています。

## ライセンス

[MIT License](LICENSE)
