// /apps/rain PWA用のアイコンPNGを生成して public/apps/rain/ に出力する
// 依存を増やさないため、雫の形はスーパーサンプリングで直接描画し、
// PNGはNode組み込みのzlibでエンコードする
import { deflateSync } from "node:zlib";
import fs from "node:fs/promises";
import path from "node:path";

const BG = [0x0a, 0x10, 0x18] as const; // 画面基調の暗い紺
const DROP_TOP = [0xb5, 0xe3, 0xf5] as const; // 雫の上端(明るい水色)
const DROP_BOTTOM = [0x5a, 0xb0, 0xd8] as const; // 雫の下端(深い水色)

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const byte of buf) {
    c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(size: number, rgba: Uint8Array): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // 各行の先頭にフィルタタイプ0を付ける
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0;
    raw.set(rgba.subarray(y * size * 4, (y + 1) * size * 4), rowStart + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// 雫: 上端の尖り(apex)から下の円へ接線でつながる古典的なティアドロップ形。
// 正規化座標(-1..1)で定義し、点が内部にあるかを判定する
const APEX_Y = -0.92;
const CIRCLE_Y = 0.35;
const CIRCLE_R = 0.57;

function insideDrop(x: number, y: number): boolean {
  const dx = x;
  const dy = y - CIRCLE_Y;
  if (dx * dx + dy * dy <= CIRCLE_R * CIRCLE_R) return true;
  // apexと円の2接点が作る三角形の内側か
  const d = CIRCLE_Y - APEX_Y;
  const cosA = CIRCLE_R / d;
  const sinA = Math.sqrt(1 - cosA * cosA);
  // 円中心から見た接点(中心→apex方向 (0,-1) を±α回転)
  const t1x = CIRCLE_R * sinA;
  const t1y = CIRCLE_Y - CIRCLE_R * cosA;
  const cross = (ax: number, ay: number, bx: number, by: number) =>
    ax * by - ay * bx;
  const s1 = cross(t1x - 0, t1y - APEX_Y, x - 0, y - APEX_Y);
  const s2 = cross(-t1x - t1x, t1y - t1y, x - t1x, y - t1y); // 底辺 t1→t2 (水平)
  const s3 = cross(0 - -t1x, APEX_Y - t1y, x - -t1x, y - t1y);
  return (s1 <= 0 && s2 <= 0 && s3 <= 0) || (s1 >= 0 && s2 >= 0 && s3 >= 0);
}

function renderIcon(size: number, dropScale: number): Uint8Array {
  const rgba = new Uint8Array(size * size * 4);
  const half = size / 2;
  const ss = 4; // 4x4スーパーサンプリング
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let coverage = 0;
      let ySum = 0;
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const x = (px + (sx + 0.5) / ss - half) / (half * dropScale);
          const y = (py + (sy + 0.5) / ss - half) / (half * dropScale);
          if (insideDrop(x, y)) {
            coverage++;
            ySum += y;
          }
        }
      }
      const i = (py * size + px) * 4;
      const a = coverage / (ss * ss);
      if (a === 0) {
        rgba[i] = BG[0];
        rgba[i + 1] = BG[1];
        rgba[i + 2] = BG[2];
      } else {
        // 雫の上下で色を淡く変える(正規化yは約-1..1)
        const t = Math.min(1, Math.max(0, (ySum / coverage + 1) / 2));
        const dr = DROP_TOP[0] + (DROP_BOTTOM[0] - DROP_TOP[0]) * t;
        const dg = DROP_TOP[1] + (DROP_BOTTOM[1] - DROP_TOP[1]) * t;
        const db = DROP_TOP[2] + (DROP_BOTTOM[2] - DROP_TOP[2]) * t;
        rgba[i] = Math.round(BG[0] + (dr - BG[0]) * a);
        rgba[i + 1] = Math.round(BG[1] + (dg - BG[1]) * a);
        rgba[i + 2] = Math.round(BG[2] + (db - BG[2]) * a);
      }
      rgba[i + 3] = 255;
    }
  }
  return rgba;
}

async function main() {
  const outDir = path.resolve("public/apps/rain");
  await fs.mkdir(outDir, { recursive: true });
  const targets = [
    { file: "icon-192.png", size: 192, dropScale: 0.72 },
    { file: "icon-512.png", size: 512, dropScale: 0.72 },
    // maskable: 中央80%のセーフゾーンに収まるよう小さめに描く
    { file: "icon-512-maskable.png", size: 512, dropScale: 0.52 },
  ];
  for (const { file, size, dropScale } of targets) {
    const png = encodePng(size, renderIcon(size, dropScale));
    await fs.writeFile(path.join(outDir, file), png);
    console.log(`Generated: public/apps/rain/${file} (${png.length} bytes)`);
  }
}

main();
