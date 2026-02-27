import os from "os";
import qrcode from "qrcode-terminal";

const args = process.argv.slice(2);

// helpオプションが指定された場合、使用方法を表示して終了する
if (args[0] === "--help" || args[0] === "-h") {
  console.log("Usage: ts-node dev_qr.ts [port] [path]");
  console.log("Example: ts-node dev_qr.ts 3000 user/home");
  console.log("[port] default: 3000, [path] default: empty");
  process.exit(0);
}

const port = args[0];
const path = args[1];

devQR(port, path);

/**
 * ローカルIPアドレスを取得する関数
 * ネットワークインターフェースを調べて、IPv4で内部でないアドレスを返す
 * 見つからない場合はループバックアドレスを返す
 * @returns ローカルIPアドレス
 */
function getLocalIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

/**
 * 開発用QRコード生成関数
 * 指定されたポートとパスを組み合わせてURLを生成し、そのURLのQRコードをターミナルに表示する
 * スマートフォンなどから簡単にローカル開発サーバーにアクセスできるようにできる
 * @param port 開発サーバーのポート番号
 * @param path アクセスしたいパス（e.g. "user/home"）デフォルトは空文字列
 */
function devQR(port: string = "3000", path: string = ""): void {
  const ip = getLocalIp();
  const cleanPath = path.replace(/^\/+/, "");
  const url = `http://${ip}:${port}/${cleanPath}`;

  console.log("Access URL:", url);
  qrcode.generate(url, { small: true });
}
