// 雨の日の窓ガラスのシミュレーション本体。
// DOM は canvas だけを受け取り、UI(ヒント文など)への通知は hooks 経由で行う。

import rainLoopUrl from "./rain_loop.mp3";

export interface RainHooks {
  /** まちが全部灯ったときなどに流れる一言を表示する */
  showFlavor(text: string): void;
  /** ヒント文をフェードアウトさせる */
  fadeHint(): void;
}

export interface RainEngine {
  setMuted(muted: boolean): void;
  setAuto(auto: boolean): void;
  destroy(): void;
}

interface Light {
  x: number;
  y: number;
  c: string;
  stage: number;
  cool: number;
  glow: number;
  note: number;
}

interface Stuck {
  x: number;
  y: number;
  r: number;
  a: number;
  tail: number;
  sq: number;
  rot: number;
}

interface TrailDot {
  x: number;
  y: number;
  r: number;
  a: number;
}

interface Faller {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  trail: TrailDot[];
  lastTrail: number;
}

type LightDef = [number, number, number, string, number];

interface Town {
  name: string;
  base: [string, string, string];
  lights: LightDef[];
  spark: [string, string];
  /** 雨の表情:雫の落下速度 / 結露と自動落下のペース / BGM音量、それぞれの係数 */
  rain: { fall: number; pace: number; bgm: number };
}

/* ---------- まち(全部灯すと次のまちへ) ---------- */
const TOWNS: Town[] = [
  {
    name: "よるのまち",
    base: ["#0a1220", "#0d1826", "#16202e"],
    lights: [
      [0.16, 0.72, 0.3, "255,190,110", 0.3],
      [0.34, 0.8, 0.22, "255,160, 90", 0.22],
      [0.55, 0.68, 0.34, "120,200,215", 0.2],
      [0.74, 0.78, 0.26, "255,205,130", 0.26],
      [0.88, 0.62, 0.2, "170,150,220", 0.14],
      [0.08, 0.5, 0.18, "120,190,210", 0.12],
      [0.45, 0.55, 0.16, "255,235,180", 0.1],
      [0.65, 0.88, 0.3, "255,150, 80", 0.18],
      [0.25, 0.6, 0.12, "200,230,255", 0.08],
      [0.93, 0.85, 0.22, "140,210,200", 0.16],
    ],
    spark: ["255,210,140", "150,215,225"],
    rain: { fall: 1, pace: 1, bgm: 1 },
  },
  {
    name: "みなとまち",
    base: ["#071018", "#0a1d24", "#0e2a30"],
    lights: [
      [0.12, 0.78, 0.26, "120,225,210", 0.26],
      [0.3, 0.66, 0.3, "90,190,230", 0.22],
      [0.5, 0.84, 0.22, "255,230,170", 0.2],
      [0.68, 0.7, 0.28, "110,210,190", 0.24],
      [0.86, 0.8, 0.24, "140,200,255", 0.18],
      [0.06, 0.58, 0.16, "180,240,230", 0.12],
      [0.42, 0.56, 0.14, "220,245,255", 0.1],
      [0.6, 0.9, 0.26, "90,170,210", 0.16],
      [0.78, 0.55, 0.14, "170,230,220", 0.1],
      [0.94, 0.66, 0.18, "120,190,230", 0.14],
    ],
    spark: ["190,240,230", "140,200,240"],
    rain: { fall: 1.15, pace: 1.35, bgm: 1.15 }, // 海からの本降り
  },
  {
    name: "ゆうぐれのまち",
    base: ["#1a0f1e", "#2a1626", "#3a1e2a"],
    lights: [
      [0.14, 0.7, 0.3, "255,150,120", 0.28],
      [0.32, 0.82, 0.24, "255,120, 90", 0.22],
      [0.52, 0.66, 0.32, "255,180,200", 0.18],
      [0.72, 0.78, 0.26, "255,200,120", 0.24],
      [0.9, 0.64, 0.2, "230,140,190", 0.16],
      [0.08, 0.52, 0.16, "255,170,150", 0.12],
      [0.44, 0.54, 0.14, "255,220,180", 0.1],
      [0.64, 0.88, 0.28, "255,130,110", 0.18],
      [0.24, 0.62, 0.12, "255,190,210", 0.08],
      [0.94, 0.84, 0.2, "250,160,140", 0.14],
    ],
    spark: ["255,190,150", "255,160,190"],
    rain: { fall: 0.9, pace: 0.8, bgm: 0.9 }, // 通り雨のなごり
  },
  {
    name: "ゆきのまち",
    base: ["#0d141f", "#141e2c", "#1d2938"],
    lights: [
      [0.15, 0.74, 0.28, "200,225,255", 0.24],
      [0.33, 0.8, 0.22, "235,240,255", 0.18],
      [0.53, 0.68, 0.3, "170,210,250", 0.18],
      [0.73, 0.78, 0.24, "255,240,210", 0.2],
      [0.89, 0.62, 0.18, "190,215,245", 0.14],
      [0.07, 0.54, 0.16, "210,230,255", 0.1],
      [0.45, 0.56, 0.14, "240,245,255", 0.08],
      [0.63, 0.88, 0.26, "200,220,255", 0.16],
      [0.25, 0.6, 0.12, "225,235,255", 0.08],
      [0.93, 0.84, 0.2, "210,235,255", 0.14],
    ],
    spark: ["240,245,255", "190,215,250"],
    rain: { fall: 0.6, pace: 0.55, bgm: 0.75 }, // みぞれまじりの静かな雨
  },
];

const TRAVEL_TEXTS = [
  "せんろの つなぎめを かぞえる おと",
  "とんねるの かぜが まどを たたいた",
  "あまつぶが よこに ながれていく",
  "とおくの てっきょうを わたる おと",
  "くらやみに でんちゅうが ひとつずつ",
  "だれも いない ホームを とおりすぎた",
  "あめの においが こくなってきた",
  "まどの くもりに ゆびの あとが のこっている",
  "かさを わすれた ひとの はしる おと",
  "しんごうの あかが あめに にじむ",
  "よふけの かもつれっしゃと すれちがう",
  "たんぼの みずが そらを うつしている",
  "どこかで ふみきりが なりやんだ",
  "やまの むこうで かみなりが ひとつ",
  "あめあしが つよくなって よわくなった",
  "しらない かわを わたった",
  "ぬれた アスファルトの ひかりが ながれる",
  "くさはらの あめは やわらかい おとがする",
  "バスていに ひとりぶんの かさの あと",
  "でんせんに あまつぶが ならんでいる",
  "といの みずが うたみたいに きこえる",
  "とりが ひくいところを とんでいった",
  "こうじょうの ゆげが あめに とけていく",
  "じはんきの ひかりだけが おきていた",
  "なまえの ない えきを とおりすぎた",
  "うみの ほうから しおの におい",
  "きりの なかで おとが まるくなる",
  "ちいさな はしの したで あめやどりの かげ",
  "よるの プールに あめが ふっている",
  "だれかの くちぶえが とぎれて きえた",
  "あめは やねごとに ちがう おとで なる",
  "マンホールの まるが ひかっている",
  "こうさてんで かさが すれちがう",
  "のきさきの すずめが みじろぎ ひとつ",
  "ゆうやけの いろが みずたまりに しずむ",
  "コインランドリーの まるい まどが まわる",
  "でんしゃの まどに ひたいを あてる ひと",
  "かんばんの もじが ひとつだけ きえている",
  "こうえんの ブランコが ひとりでに ゆれた",
  "あめどいを のぼる みずの こえ",
  "やおやの ひさしから しずくが ひとすじ",
  "とけいだいが ぬれて ふかい いろに なる",
  "さかみちを みずが えらんで ながれる",
  "しょうてんがいの アーケードに あめの こだま",
  "だれかが ながぐつを ほめられていた",
  "ふるい ポストが あめに うたれている",
  "せんたくものを とりこむ おとが した",
  "こんびにの ひかりが みちを しかくく きる",
  "わすれられた かさが かべに もたれている",
  "すいどうかんの なかを とおる みずの うわさ",
  "よるの がっこうは あめの おとだけ",
  "プラットホームの はしで ひかりが たまる",
  "タクシーの ワイパーが ふたつ うなずく",
  "はとが のきしたで じゅんばんを まっている",
  "かわらやねを あめが かぞえて あるく",
  "こうばんの まえで かさが ひらいた",
  "みずたまりが そらの つづきに なっている",
  "えんとつの けむりが あめに おされて ひくい",
  "しらない いえの ゆうげの におい",
  "じてんしゃの ベルが とおくで ひとつ",
  "でんちゅうの ひかりに あめが むらがる",
  "かんばんねこの せとものが ぬれて つやつや",
  "ちかみちの トンネルで おとが ふとる",
  "かえりみちの ひとの かげが ながい",
  "やたいの ちょうちんが ひとつ ともった",
  "うらどおりの みずたまりを またぐ あしおと",
  "ビニールがさに あめの つぶが おどる",
  "こうしゃの チャイムが あめに とけた",
  "つりばしの ロープが しずくを ならべる",
  "ゆきの においが まじりはじめた",
  "ストーブの けむりが よこに ながれる",
  "くつしたの まま まどべに たつ ひと",
  "じどうはんばいきが つりせんを かんがえている",
  "よぞらの すみが すこし あかるい",
  "かもめが てすりで あめやどり",
  "ふねの ひかりが なみに きざまれる",
  "とだなの おくで コップが なる いえ",
  "おんがくしつから ピアノが ひとおと",
  "かいだんの おどりばに まるい ひかり",
  "だれかの でんわの こえが やさしかった",
  "あめの ひは とけいが ゆっくり すすむ",
  "かさたての なかで かさが やすんでいる",
  "まちの ちずには ない ほそい みち",
  "やねの うえを ひかりが すべっていく",
  "こうしゅうでんわが ひかっていた",
  "せんろわきの あじさいが おもたい",
  "ゆうびんうけに あめが すこし はいった",
  "ガードしたで おとが ひとまわり おおきい",
  "しんぶんはいたつの カブが みずを はねた",
  "よるの としょかんの まどが ひとつ あかるい",
  "かいだんを おりる ながぐつの リズム",
  "とおくの かんらんしゃが ゆっくり ひかる",
  "あめの むこうで まちが にじんで ひとつに なる",
  "こうそくどうろの おとが うみに にている",
  "だれかが ドアを そっと しめた",
  "すべりだいに あまみずの みち",
  "ろじうらの きんもくせいが つよく におう",
  "でんきやの テレビが みんな おなじ ゆめ",
  "かわの おもてを あめが けずっていく",
  "はしの したの こえは よく ひびく",
  "ひさしぶりの ほしが ひとつ みえた",
  "せんろが ぬれて ぎんいろに なる",
  "パーキングの ライトが じゅんばんに ねむる",
  "ふうりんが ひとこと だけ いった",
  "あめがっぱの こどもが かけていった",
  "こうえんの すなばに ちいさな みずうみ",
  "まどガラスの むこうと こちらの おんど",
  "バケツが いっぱいに なる おとで めが さめる",
  "とりいの あかが あめで ふかく なる",
  "うちがわから くもりを ふく てのひら",
  "しんやの スーパーに かごが ひとつ",
  "かみなりの あとの しずけさが ながい",
  "みちの さきが きりに つつまれて まっしろ",
  "のらいぬが のきしたで まるく なる",
  "こうじげんばの ブルーシートが うたう",
  "つきが くもの うすいところを えらぶ",
  "ふとんの なかから きく あめは べつの おと",
  "すいぞくかんの まえで うみの ゆめを みる",
  "ネオンの みどりが みずたまりで およぐ",
  "だれも みていない はなびが あがった",
  "やまの えきは あめの おとが ちかい",
  "かいそくでんしゃが かぜを おいていった",
  "こうちゃの ゆげと まどの くもり",
  "くだりざかの みずが さきを いそぐ",
  "しめった ダンボールの におい",
  "まよなかの こうしゃてんの ひかりが またたく",
  "あめの ひの えんそくの バス",
  "ちいさな みせの のれんが おもい",
  "かえるの こえが ひとつ ふえた",
  "あさが ちかい いろの あめに なった",
];

const WAKE_TEXTS = [
  "まちが めを さました",
  "だれかが カーテンを あけた",
  "こんやは みんな おきている",
  "とおくで だれかが わらった",
  "ゆうびんやが じてんしゃで かけていく",
  "パンやの かまどに ひが はいった",
  "ふろやの えんとつから けむりが たつ",
  "ふみきりの おとが きこえる",
  "まちじゅうの やかんが なきだした",
  "きょうも だれかの いえに あかりが ともる",
];

const pick = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

export function createRainEngine(
  cv: HTMLCanvasElement,
  hooks: RainHooks,
): RainEngine {
  const ctx = cv.getContext("2d")!;
  const PI = Math.PI;

  let W = 0,
    H = 0,
    DPR = 1;
  const bg = document.createElement("canvas"),
    bgx = bg.getContext("2d")!;
  const fog = document.createElement("canvas"),
    fgx = fog.getContext("2d")!; // 曇りマスク
  const scene = document.createElement("canvas"),
    scx = scene.getContext("2d")!; // 背景+あかり+曇りの合成
  const FOGA = 0.15; // 曇りの最大濃度(初期値=上限)
  const LIGHTS: Light[] = [];

  let FLAVORS: string[] | null = null; // WAKE_TEXTSとTRAVEL_TEXTSを合わせたもの(初回に生成)
  let townIdx = 0,
    townBlend = 1; // 1=切替完了
  let prevLights: Light[] = []; // 流れていく前のまちのあかり
  const bgPrev = document.createElement("canvas"),
    bpx = bgPrev.getContext("2d")!;

  let destroyed = false;
  const timeouts = new Set<ReturnType<typeof setTimeout>>();
  function later(fn: () => void, ms: number) {
    const id = setTimeout(() => {
      timeouts.delete(id);
      fn();
    }, ms);
    timeouts.add(id);
  }

  function paintBackground() {
    const T = TOWNS[townIdx];
    bg.width = W * DPR;
    bg.height = H * DPR;
    bgx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const base = bgx.createLinearGradient(0, 0, 0, H);
    base.addColorStop(0, T.base[0]);
    base.addColorStop(0.55, T.base[1]);
    base.addColorStop(1, T.base[2]);
    bgx.fillStyle = base;
    bgx.fillRect(0, 0, W, H);
    LIGHTS.length = 0;
    // あかりの場所は毎回ランダム(近すぎる配置は避ける)
    const NLIGHTS = 12,
      minD = Math.min(W, H) * 0.18,
      placed: Array<[number, number]> = [];
    for (let i = 0; i < NLIGHTS; i++) {
      const [, , pr, c, a] = T.lights[i % T.lights.length];
      let x = 0,
        y = 0,
        tries = 0;
      do {
        x = (0.06 + Math.random() * 0.88) * W;
        y = (0.32 + Math.random() * 0.58) * H;
        tries++;
      } while (
        tries < 60 &&
        placed.some((p) => Math.hypot(p[0] - x, p[1] - y) < minD)
      );
      placed.push([x, y]);
      const r = pr * Math.max(W, H);
      const g = bgx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${c},${a})`);
      g.addColorStop(0.5, `rgba(${c},${a * 0.4})`);
      g.addColorStop(1, `rgba(${c},0)`);
      bgx.fillStyle = g;
      bgx.beginPath();
      bgx.arc(x, y, r, 0, 6.2832);
      bgx.fill();
      LIGHTS.push({ x, y, c, stage: 0, cool: 0, glow: 0, note: i });
    }
    for (let i = 0; i < 26; i++) {
      const x = Math.random() * W,
        y = H * (0.35 + Math.random() * 0.55),
        r = 4 + Math.random() * 14;
      const c = T.spark[Math.random() < 0.7 ? 0 : 1];
      const g = bgx.createRadialGradient(x, y, 0, x, y, r * 3);
      g.addColorStop(0, `rgba(${c},.20)`);
      g.addColorStop(1, `rgba(${c},0)`);
      bgx.fillStyle = g;
      bgx.beginPath();
      bgx.arc(x, y, r * 3, 0, 6.2832);
      bgx.fill();
    }
    const vig = bgx.createLinearGradient(0, 0, 0, H);
    vig.addColorStop(0, "rgba(4,8,14,.55)");
    vig.addColorStop(0.45, "rgba(4,8,14,.15)");
    vig.addColorStop(1, "rgba(4,8,14,.30)");
    bgx.fillStyle = vig;
    bgx.fillRect(0, 0, W, H);
  }
  function nextTown() {
    // 今の景色を残したまま、次のまちへゆっくり明け渡す
    prevLights = LIGHTS.map((L) => ({ ...L })); // あかりは灯ったまま景色と一緒に流れていく
    bgPrev.width = bg.width;
    bgPrev.height = bg.height;
    bpx.setTransform(1, 0, 0, 1, 0, 0);
    bpx.drawImage(bg, 0, 0);
    townIdx = (townIdx + 1) % TOWNS.length;
    paintBackground(); // LIGHTSも新しいまちのものに
    // BGMの基準音量も、次のまちの雨にゆっくり寄せていく
    if (AC && bgmGain)
      bgmGain.gain.setTargetAtTime(
        0.105 * TOWNS[townIdx].rain.bgm,
        AC.currentTime,
        2.5,
      );
    litCount = 0;
    celebrated = false;
    townBlend = 0;
  }
  function paintFog() {
    // マスク:不透明=曇り最大。増えてもここが上限
    fog.width = W * DPR;
    fog.height = H * DPR;
    fgx.setTransform(DPR, 0, 0, DPR, 0, 0);
    fgx.fillStyle = "rgb(148,174,190)";
    fgx.fillRect(0, 0, W, H);
  }
  function wipeFog(x: number, y: number, r: number, strength: number) {
    fgx.save();
    fgx.globalCompositeOperation = "destination-out";
    const g = fgx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(0,0,0,${strength})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    fgx.fillStyle = g;
    fgx.beginPath();
    fgx.arc(x, y, r, 0, 6.2832);
    fgx.fill();
    fgx.restore();
  }
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * DPR;
    cv.height = H * DPR;
    cv.style.width = W + "px";
    cv.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    scene.width = W * DPR;
    scene.height = H * DPR;
    scx.setTransform(DPR, 0, 0, DPR, 0, 0);
    townBlend = 1; // リサイズ時は移り変わりを打ち切る
    paintBackground();
    paintFog();
  }
  window.addEventListener("resize", resize);
  resize();

  /* ================= 音 ================= */
  let AC: AudioContext | null = null,
    master: GainNode | null = null,
    bgmGain: GainNode | null = null,
    muted = false;
  const PENTA = [0, 2, 4, 7, 9];
  function ac(): AudioContext {
    if (!AC) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      AC = new Ctor();
      master = AC.createGain();
      master.gain.value = muted ? 0 : 0.55;
      master.connect(AC.destination);
      // 雨音BGM:録音した雨のループ、これひとつだけ
      const rg = AC.createGain();
      rg.gain.value = 0.105 * TOWNS[townIdx].rain.bgm; // 基準音量(ゆらぎ込みで0.09〜0.12 × まちの係数)
      rg.connect(master);
      bgmGain = rg;
      // 遠くなったり近くなったり、ゆるやかな強弱のゆらぎ
      const lfo = AC.createOscillator();
      lfo.frequency.value = 1 / 28; // 28秒でひとまわり
      const lfoDepth = AC.createGain();
      lfoDepth.gain.value = 0.015;
      lfo.connect(lfoDepth);
      lfoDepth.connect(rg.gain);
      lfo.start();
      void fetch(rainLoopUrl)
        .then((res) => res.arrayBuffer())
        .then((data) => AC!.decodeAudioData(data))
        .then((buf) => {
          const src = AC!.createBufferSource();
          src.buffer = buf;
          src.loop = true;
          src.connect(rg);
          src.start();
        });
    }
    if (AC.state === "suspended") void AC.resume();
    return AC;
  }
  function tone(
    freq: number,
    dur: number,
    vol: number,
    type: OscillatorType = "sine",
    glide = 0,
    delay = 0,
    atk = 0.012,
  ) {
    if (muted) return;
    const a = ac(),
      t = a.currentTime + delay;
    const o = a.createOscillator(),
      g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(freq * glide, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(master!);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  let lastTick = 0;
  function tickSound(r: number) {
    const now = performance.now();
    if (now - lastTick < 80) return;
    lastTick = now;
    tone(620 - r * 4 + Math.random() * 60, 0.05, 0.014, "sine", 0.7);
  }
  function slipSound() {
    tone(300, 0.32, 0.035, "sine", 0.5);
  }
  function plopSound(r: number, x: number) {
    // 落ちた場所で音程が変わる(左が低く右が高く)
    const idx = Math.max(0, Math.min(4, Math.floor((x / W) * 5)));
    const f = 196 * Math.pow(2, PENTA[idx] / 12) * (r > 34 ? 1 : 2); // 大きい雫は低め
    tone(f, 1.8, 0.07, "sine", 0, 0.06);
  }
  function revealSound(i: number) {
    // ランプが姿を見せる、低くて柔らかいベース音(音階は灯る時と同じ)
    const f = 98 * Math.pow(2, PENTA[i % 5] / 12);
    tone(f, 1.6, 0.038, "sine", 0, 0, 0.05);
    tone(f * 2, 0.9, 0.01, "sine", 0, 0, 0.06); // 倍音をうっすら重ねて輪郭を出す
  }
  function lampSound(i: number) {
    const f =
      (392 * Math.pow(2, PENTA[i % 5] / 12)) / (Math.floor(i / 5) % 2 ? 2 : 1);
    tone(f, 1.4, 0.06, "sine");
    tone(f * 2, 0.7, 0.02, "sine", 0, 0.03);
  }
  function chordSound() {
    [262, 392, 523, 659].forEach((f, i) =>
      tone(f, 2.4, 0.05, "sine", 0, i * 0.12),
    );
  }
  function townSound() {
    // まちの音:たまに遠くから、そのまちの気配だけが届く
    switch (townIdx) {
      case 0: // よるのまち:時計台の鐘がふたつ
        tone(262, 2.8, 0.022, "sine", 0, 0, 0.02);
        tone(524, 1.2, 0.006, "sine", 0, 0, 0.02);
        tone(262, 2.8, 0.02, "sine", 0, 1.6, 0.02);
        tone(524, 1.2, 0.005, "sine", 0, 1.6, 0.02);
        break;
      case 1: // みなとまち:遠い汽笛
        tone(104, 2.6, 0.03, "triangle", 0.97, 0, 0.5);
        tone(156, 2.6, 0.012, "triangle", 0.97, 0, 0.6);
        break;
      case 2: // ゆうぐれのまち:教会の鐘が下りてくる
        tone(392, 2.2, 0.02, "sine", 0, 0, 0.02);
        tone(784, 1, 0.006, "sine", 0, 0, 0.02);
        tone(330, 2.6, 0.02, "sine", 0, 1.3, 0.02);
        tone(660, 1.1, 0.005, "sine", 0, 1.3, 0.02);
        break;
      default: // ゆきのまち:そりの鈴
        tone(1568, 0.5, 0.008, "sine", 0, 0, 0.008);
        tone(1568, 0.5, 0.007, "sine", 0, 0.35, 0.008);
        tone(1760, 0.6, 0.007, "sine", 0, 0.7, 0.008);
        break;
    }
  }
  let autoMode = false;

  /* ================= 雫 ================= */
  const stuck: Stuck[] = [],
    fallers: Faller[] = [];
  const TARGET = 210,
    INITIAL = 88,
    BASE_R = 7; // 最初はまばら、雨で増えていく
  let BREAK_R = 15; // 落下サイズは以前の7割
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);

  function randR() {
    // たまに大粒も混ざる
    const q = Math.random();
    return q < 0.76 ? rnd(4.8, 7) : q < 0.93 ? rnd(6, 9.5) : rnd(10, 16);
  }
  function spawnStuck(
    x?: number | null,
    y?: number | null,
    r?: number | null,
    fade?: boolean,
  ) {
    const nx = x ?? rnd(6, W - 6),
      ny = y ?? rnd(60, H - 10),
      nr = r ?? randR();
    // 同じ場所に降ったら、そこにある雫と合体する(指で集める時と同じ)
    for (let i = 0; i < stuck.length; i++) {
      const s = stuck[i];
      if (Math.hypot(s.x - nx, s.y - ny) < s.r * 0.92 + nr) {
        s.r = Math.min(50, Math.sqrt(s.r * s.r + nr * nr * 0.95));
        if (s.r >= BREAK_R) {
          // 重くなりすぎたら、ひとりでに流れ出す
          stuck.splice(i, 1);
          breakFree(s.x, s.y, s.r, true);
        }
        return;
      }
    }
    stuck.push({
      x: nx,
      y: ny,
      r: nr,
      a: fade ? 0 : 1,
      tail: rnd(0.4, 1.1),
      sq: rnd(0.88, 1.12),
      rot: rnd(-0.3, 0.3),
    });
  }
  for (let i = 0; i < INITIAL; i++) spawnStuck();

  const collector = {
    active: false,
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    vx: 0,
    vy: 0,
    rot: 0,
    r: BASE_R,
    wob: 0,
    wobA: 0,
    speed: 0,
  };

  function absorbInto(
    t: { x: number; y: number; r: number },
    silent?: boolean,
  ) {
    let got = false;
    for (let i = stuck.length - 1; i >= 0; i--) {
      const s = stuck[i];
      if (Math.hypot(t.x - s.x, t.y - s.y) < t.r * 0.92 + s.r) {
        t.r = Math.min(50, Math.sqrt(t.r * t.r + s.r * s.r * 0.95));
        stuck.splice(i, 1);
        if (!silent) tickSound(t.r); // 音が鳴るのは指で集めた時だけ
        got = true;
      }
    }
    return got;
  }
  function breakFree(x: number, y: number, r: number, silent?: boolean) {
    fallers.push({
      x,
      y,
      r,
      vy: rnd(0.15, 0.35),
      sway: Math.random() * 6.28,
      trail: [],
      lastTrail: 0,
    });
    if (!silent) {
      slipSound();
      if (navigator.vibrate) navigator.vibrate([8, 50, 12]);
    }
  }

  /* ================= 入力 ================= */
  let hintShown = true;
  const pointer = { down: false, x: 0, y: 0 };
  let wipePX = -1, // 曇り拭きの前回位置(-1=拭いていない)
    wipePY = 0;
  function sag() {
    return 14 + collector.r * 0.5;
  }
  function tryGrab(x: number, y: number) {
    // 触れた場所に雫があれば掴む。なければ何も起きない
    for (let i = stuck.length - 1; i >= 0; i--) {
      const s = stuck[i];
      if (Math.hypot(s.x - x, s.y - y) < s.r + 16) {
        stuck.splice(i, 1);
        collector.active = true;
        collector.r = Math.max(4.5, s.r);
        collector.px = x;
        collector.py = y;
        collector.x = s.x;
        collector.y = s.y;
        collector.vx = 0;
        collector.vy = 0;
        collector.rot = 0;
        collector.wobA = 1.5;
        collector.wob = 0;
        collector.speed = 0;
        tickSound(collector.r);
        if (navigator.vibrate) navigator.vibrate(5);
        return true;
      }
    }
    return false;
  }
  function onPointerDown(e: PointerEvent) {
    ac();
    pointer.down = true;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    tryGrab(e.clientX, e.clientY);
    if (hintShown) {
      hintShown = false;
      hooks.fadeHint();
    }
  }
  function onPointerMove(e: PointerEvent) {
    if (!pointer.down) return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    if (collector.active) {
      collector.px = e.clientX;
      collector.py = e.clientY;
    } else {
      tryGrab(e.clientX, e.clientY); // なぞる途中で雫に触れたら拾う
    }
  }
  function onPointerUp() {
    pointer.down = false;
    if (!collector.active) return;
    collector.active = false;
    if (collector.r > 5) {
      stuck.push({
        x: collector.x,
        y: collector.y,
        r: collector.r,
        a: 1,
        tail: 0.8,
        sq: 1,
        rot: 0,
      });
    }
  }
  cv.addEventListener("pointerdown", onPointerDown);
  cv.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  // タブが隠れているあいだは音ごと眠る
  function onVisibility() {
    if (!AC) return;
    if (document.hidden) void AC.suspend();
    else void AC.resume();
  }
  document.addEventListener("visibilitychange", onVisibility);

  /* ================= 更新 ================= */
  let last = performance.now(),
    autoTimer = rnd(2500, 6000);
  let litCount = 0,
    celebrated = false,
    fogRegrow = 0,
    wakeT = -1; // まちの目覚め演出の経過時間(-1=なし)
  let townVoiceTimer = rnd(90000, 150000);
  function shortestAngle(a: number, b: number) {
    return Math.atan2(Math.sin(b - a), Math.cos(b - a));
  }

  function tryLight(x: number, y: number) {
    if (townBlend < 1) return; // 景色が流れている間は灯らない
    for (const L of LIGHTS) {
      if (L.stage >= 2 || L.cool > 0) continue;
      if (Math.hypot(L.x - x, L.y - y) < 58) {
        L.stage++;
        L.cool = 1500;
        if (L.stage === 1) {
          revealSound(L.note); // 消えたランプが姿を見せる
        } else {
          lampSound(L.note); // 灯る
          litCount++;
          if (navigator.vibrate) navigator.vibrate(12);
          if (litCount === LIGHTS.length && !celebrated) {
            celebrated = true;
            chordSound();
            wakeT = 0; // まち全体がひと呼吸ぶん明るくなる
            if (!FLAVORS) FLAVORS = [...WAKE_TEXTS, ...TRAVEL_TEXTS];
            hooks.showFlavor(pick(FLAVORS));
            later(() => hooks.fadeHint(), 7400); // 移動が終わる頃まで
            later(nextTown, 3200); // 余韻のあとで次のまちへ
          }
        }
      }
    }
  }

  function update(dt: number) {
    const TR = TOWNS[townIdx].rain; // このまちの雨の表情
    // 雨脚はゆっくり強まったり弱まったりする(0=こぬか雨、1=本降り)
    const rainy = 0.5 + 0.5 * Math.sin(last * 0.00011);
    // 雨が降り続ける:結露がどんどん増える(雨脚とまちの気候しだい)
    if (stuck.length < TARGET && Math.random() < (0.08 + 0.3 * rainy) * TR.pace)
      spawnStuck(null, null, null, true);
    for (const s of stuck) if (s.a < 1) s.a = Math.min(1, s.a + dt * 0.002);

    // まちの移り変わりを進める
    if (townBlend < 1) {
      townBlend = Math.min(1, townBlend + dt / 5200);
      if (townBlend >= 1) prevLights.length = 0; // 前のまちのあかりは見えなくなった
    }

    // 曇りは初期の濃さを上限にじんわり戻る(全部拭いても30秒ほどで元どおり)
    fogRegrow += dt;
    if (fogRegrow > 200) {
      fogRegrow = 0;
      fgx.fillStyle = "rgba(148,174,190,.02)";
      fgx.fillRect(0, 0, W, H);
    }
    for (const L of LIGHTS) {
      if (L.cool > 0) L.cool -= dt;
      // 灯るときはぱっとではなく、ふわっと明るくなる
      if (L.stage >= 2 && L.glow < 1) L.glow = Math.min(1, L.glow + dt / 280);
    }
    if (wakeT >= 0) {
      wakeT += dt;
      if (wakeT > 3600) wakeT = -1;
    }

    // まちの音:2〜3分に一度だけ、移動中でなければ
    townVoiceTimer -= dt;
    if (townVoiceTimer < 0) {
      townVoiceTimer = rnd(120000, 180000);
      if (townBlend >= 1) townSound();
    }

    autoTimer -= dt;
    if (autoTimer < 0) {
      // 本降りのときほど、ひとりでに流れる雫も増える
      autoTimer =
        ((autoMode ? rnd(700, 1900) : rnd(3000, 7000)) * (1.4 - 0.8 * rainy)) /
        TR.pace;
      breakFree(
        rnd(6, W - 6),
        rnd(-20, 40),
        autoMode ? rnd(6, 13) : rnd(7, 12),
        true,
      );
    }

    // 雫を持っていない指は、窓の曇りを拭く(らくがきができる)
    if (pointer.down && !collector.active) {
      if (wipePX < 0) {
        wipePX = pointer.x;
        wipePY = pointer.y;
      }
      // 速く動かしても線がとぎれないように、前回位置から補間して拭く
      const dx = pointer.x - wipePX,
        dy = pointer.y - wipePY;
      const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 7));
      for (let i = 1; i <= steps; i++)
        wipeFog(wipePX + (dx * i) / steps, wipePY + (dy * i) / steps, 20, 0.3);
      wipePX = pointer.x;
      wipePY = pointer.y;
    } else {
      wipePX = -1;
    }

    if (collector.active) {
      const k = 1 - Math.pow(0.93, dt / 16.7);
      const tx = collector.px,
        ty = collector.py + sag();
      const nx = collector.x + (tx - collector.x) * k;
      const ny = collector.y + (ty - collector.y) * k;
      collector.vx = ((nx - collector.x) / Math.max(dt, 1)) * 16.7;
      collector.vy = ((ny - collector.y) / Math.max(dt, 1)) * 16.7;
      collector.x = nx;
      collector.y = ny;
      const sp = Math.hypot(collector.vx, collector.vy);
      collector.speed = sp;
      const targetRot =
        sp > 1.2 ? Math.atan2(collector.vy, collector.vx) - PI / 2 : 0;
      collector.rot +=
        shortestAngle(collector.rot, targetRot) * Math.min(1, dt * 0.005);

      wipeFog(collector.x, collector.y, collector.r * 1.3, 0.1);
      if (absorbInto(collector)) {
        collector.wobA = Math.min(5, 2 + collector.r * 0.06);
        collector.wob = 0;
        if (navigator.vibrate) navigator.vibrate(4);
      }
      if (collector.wobA > 0.02) {
        collector.wob += dt * 0.02;
        collector.wobA *= Math.pow(0.994, dt);
      }
      if (collector.r >= BREAK_R) {
        breakFree(collector.x, collector.y, collector.r, true); // 音は立てずに
        if (navigator.vibrate) navigator.vibrate([8, 50, 12]);
        collector.active = false; // 指からするっと抜けて、手には何も残らない
        BREAK_R = 15;
      }
    }

    for (let i = fallers.length - 1; i >= 0; i--) {
      const f = fallers[i];
      f.vy = Math.min(
        f.vy + dt * 0.0018 * TR.fall,
        (0.9 + f.r * 0.008) * TR.fall,
      );
      f.sway += dt * 0.003;
      f.x += Math.sin(f.sway) * 0.35;
      f.y += f.vy * dt * 0.35;
      absorbInto(f, true);
      wipeFog(f.x, f.y, f.r * 1.6, 0.28);
      tryLight(f.x, f.y);
      f.lastTrail += dt;
      if (f.lastTrail > 60) {
        f.lastTrail = 0;
        f.trail.push({
          x: f.x + rnd(-f.r * 0.3, f.r * 0.3),
          y: f.y - f.r * 0.8,
          r: rnd(3, 4.8),
          a: 0.9,
        });
        if (Math.random() < 0.5)
          spawnStuck(
            f.x + rnd(-f.r * 0.4, f.r * 0.4),
            f.y - f.r,
            rnd(3.6, 5.2),
            false,
          );
      }
      for (const t of f.trail) t.a -= dt * 0.0006;
      f.trail = f.trail.filter((t) => t.a > 0);
      if (f.y - f.r > H) {
        plopSound(f.r, f.x);
        fallers.splice(i, 1);
      }
    }
  }

  /* ================= 描画 ================= */
  function lampGlow(x: number, y: number, c: string, glow: number) {
    // glow: 0〜1
    const R = 50 + glow * 70;
    const g = scx.createRadialGradient(x, y, 0, x, y, R);
    g.addColorStop(0, `rgba(${c},${0.5 * glow})`);
    g.addColorStop(0.4, `rgba(${c},${0.2 * glow})`);
    g.addColorStop(1, `rgba(${c},0)`);
    scx.fillStyle = g;
    scx.beginPath();
    scx.arc(x, y, R, 0, 6.2832);
    scx.fill();
    scx.beginPath();
    scx.arc(x, y, 3 + glow * 2.5, 0, 6.2832);
    scx.fillStyle = `rgba(255,252,240,${0.25 + 0.6 * glow})`;
    scx.fill();
  }
  function lampDark(x: number, y: number, a = 1) {
    // 消えたランプ:灯るランプのグレー版
    const R = 30;
    const g = scx.createRadialGradient(x, y, 0, x, y, R);
    g.addColorStop(0, `rgba(152,166,178,${0.15 * a})`);
    g.addColorStop(0.4, `rgba(152,166,178,${0.06 * a})`);
    g.addColorStop(1, "rgba(152,166,178,0)");
    scx.fillStyle = g;
    scx.beginPath();
    scx.arc(x, y, R, 0, 6.2832);
    scx.fill();
    scx.beginPath();
    scx.arc(x, y, 3.5, 0, 6.2832);
    scx.fillStyle = `rgba(188,198,208,${0.32 * a})`;
    scx.fill();
  }
  function drawLamp(x: number, y: number, L: Light, fade = 1) {
    if (L.stage === 1) lampDark(x, y, fade);
    else if (L.stage >= 2) {
      const g = L.glow * (2 - L.glow);
      if (g < 1) lampDark(x, y, fade * (1 - g)); // グレーのランプからふわっと灯る
      lampGlow(x, y, L.c, fade * g);
    }
  }
  function composeScene() {
    // 背景+あかり+曇り → 雫はこれを映す
    if (townBlend < 1) {
      // 車窓のように、景色が右へ流れて次のまちが来る
      const e = (1 - Math.cos(townBlend * PI)) / 2;
      const off = e * W;
      scx.drawImage(bgPrev, 0, 0, bgPrev.width, bgPrev.height, off, 0, W, H);
      scx.drawImage(bg, 0, 0, bg.width, bg.height, off - W, 0, W, H);
      // まちとまちの間は深い夜霧:境目そのものを見せない
      // 移行の入りと終わりでは霧自体を薄くして、消える瞬間を見せない
      const bandA = Math.min(1, townBlend * 5, (1 - townBlend) * 3.5);
      const MW = W * 0.8,
        x0 = off - MW / 2;
      const hz = scx.createLinearGradient(x0, 0, x0 + MW, 0);
      hz.addColorStop(0, "rgba(7,12,19,0)");
      hz.addColorStop(0.35, `rgba(7,12,19,${0.72 * bandA})`);
      hz.addColorStop(0.5, `rgba(7,12,19,${0.92 * bandA})`);
      hz.addColorStop(0.65, `rgba(7,12,19,${0.72 * bandA})`);
      hz.addColorStop(1, "rgba(7,12,19,0)");
      scx.fillStyle = hz;
      scx.fillRect(x0, 0, MW, H);
      const fz = scx.createLinearGradient(x0, 0, x0 + MW, 0);
      fz.addColorStop(0, "rgba(125,155,175,0)");
      fz.addColorStop(0.5, `rgba(125,155,175,${0.11 * bandA})`);
      fz.addColorStop(1, "rgba(125,155,175,0)");
      scx.fillStyle = fz;
      scx.fillRect(x0, 0, MW, H);
      // 前のまちのあかりは、景色と一緒に流れながらだんだん暗くなっていく
      const lampFade = Math.max(0, 1 - townBlend * 1.6);
      for (const L of prevLights) {
        if (L.stage <= 0 || L.x + off > W + 120 || lampFade <= 0) continue;
        drawLamp(L.x + off, L.y, L, lampFade);
      }
    } else {
      scx.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, W, H);
    }
    for (const L of LIGHTS) {
      if (L.stage <= 0) continue;
      drawLamp(L.x, L.y, L);
    }
    if (wakeT >= 0) {
      // まちの目覚め:全部灯った瞬間、まち全体がゆっくり息を吸って吐く
      const a = Math.sin(PI * Math.min(1, wakeT / 3600)) * 0.1;
      const g = scx.createLinearGradient(0, H, 0, H * 0.2);
      g.addColorStop(0, `rgba(255,215,150,${a})`);
      g.addColorStop(1, "rgba(255,215,150,0)");
      scx.fillStyle = g;
      scx.fillRect(0, 0, W, H);
    }
    scx.globalAlpha = FOGA;
    scx.drawImage(fog, 0, 0, fog.width, fog.height, 0, 0, W, H);
    scx.globalAlpha = 1;
  }
  function dropBody(r: number, stretch: number) {
    ctx.beginPath();
    ctx.ellipse(0, r * stretch * 0.06, r, r * stretch, 0, 0, 6.2832);
  }
  function drawSmear(
    r: number,
    stretch: number,
    tailLen: number,
    alpha: number,
  ) {
    if (tailLen <= 0.01) return;
    const top = -r * stretch - r * tailLen,
      base = -r * stretch * 0.55;
    const wTop = r * 0.42,
      wBase = r * 0.8;
    const g = ctx.createLinearGradient(0, top, 0, base);
    g.addColorStop(0, "rgba(185,215,232,0)");
    g.addColorStop(1, `rgba(185,215,232,${0.14 * alpha})`);
    ctx.beginPath();
    ctx.moveTo(-wTop, top);
    ctx.quadraticCurveTo(-wBase, (top + base) / 2, -wBase, base);
    ctx.lineTo(wBase, base);
    ctx.quadraticCurveTo(wBase, (top + base) / 2, wTop, top);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
  }
  function drawRefract(
    x: number,
    y: number,
    r: number,
    stretch: number,
    tailLen: number,
    alpha: number,
    rot = 0,
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    const sh = ctx.createRadialGradient(
      r * 0.1,
      r * 0.34,
      r * 0.2,
      r * 0.1,
      r * 0.34,
      r * 1.3,
    );
    sh.addColorStop(0, `rgba(0,0,0,${0.28 * alpha})`);
    sh.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sh;
    ctx.beginPath();
    ctx.arc(r * 0.1, r * 0.34, r * 1.3, 0, 6.2832);
    ctx.fill();
    drawSmear(r, stretch, tailLen, alpha);
    dropBody(r, stretch);
    ctx.clip();
    // 曇りごと映す:雫の色が窓に馴染む
    ctx.globalAlpha = alpha;
    ctx.rotate(-rot);
    ctx.scale(1.22, -1.22);
    ctx.drawImage(scene, 0, 0, scene.width, scene.height, -x, -y, W, H);
    ctx.restore();

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    dropBody(r, stretch);
    ctx.clip();
    const g = ctx.createLinearGradient(0, -r * stretch, 0, r * stretch);
    g.addColorStop(0, "rgba(5,9,15,.45)");
    g.addColorStop(0.5, "rgba(5,9,15,0)");
    g.addColorStop(1, "rgba(220,242,252,.08)");
    ctx.fillStyle = g;
    ctx.fillRect(-r, -r * stretch - 1, r * 2, r * stretch * 2 + 2);
    const cg = ctx.createRadialGradient(
      0,
      r * stretch * 0.5,
      0,
      0,
      r * stretch * 0.5,
      r * 0.85,
    );
    cg.addColorStop(0, `rgba(226,246,255,${0.26 * alpha})`);
    cg.addColorStop(1, "rgba(226,246,255,0)");
    ctx.fillStyle = cg;
    ctx.fillRect(-r, -r * stretch, r * 2, r * stretch * 2);
    ctx.restore();

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    dropBody(r, stretch);
    ctx.strokeStyle = `rgba(8,14,22,${0.36 * alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(
      -r * 0.34,
      -r * stretch * 0.3,
      r * 0.13,
      r * 0.24,
      -0.5,
      0,
      6.2832,
    );
    ctx.fillStyle = `rgba(240,250,255,${0.65 * alpha})`;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(
      r * 0.28,
      r * stretch * 0.42,
      r * 0.09,
      r * 0.05,
      0.4,
      0,
      6.2832,
    );
    ctx.fillStyle = `rgba(240,250,255,${0.25 * alpha})`;
    ctx.fill();
    ctx.restore();
  }
  function drawDot(
    x: number,
    y: number,
    r: number,
    a: number,
    sq = 1,
    rot = 0,
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(1, sq);
    const sh = ctx.createRadialGradient(
      r * 0.12,
      r * 0.3,
      0,
      r * 0.12,
      r * 0.3,
      r * 1.15,
    );
    sh.addColorStop(0, `rgba(0,0,0,${0.22 * a})`);
    sh.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sh;
    ctx.beginPath();
    ctx.arc(r * 0.12, r * 0.3, r * 1.15, 0, 6.2832);
    ctx.fill();
    const g = ctx.createRadialGradient(0, r * 0.2, 0, 0, 0, r);
    g.addColorStop(0, `rgba(205,232,246,${0.2 * a})`);
    g.addColorStop(0.6, `rgba(150,190,214,${0.1 * a})`);
    g.addColorStop(1, `rgba(10,18,28,${0.3 * a})`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 6.2832);
    ctx.fill();
    const cg = ctx.createRadialGradient(0, r * 0.35, 0, 0, r * 0.35, r * 0.8);
    cg.addColorStop(0, `rgba(232,248,255,${0.26 * a})`);
    cg.addColorStop(1, "rgba(232,248,255,0)");
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 6.2832);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-r * 0.34, -r * 0.36, Math.max(0.5, r * 0.18), 0, 6.2832);
    ctx.fillStyle = `rgba(248,252,255,${0.6 * a})`;
    ctx.fill();
    ctx.restore();
  }

  function render() {
    composeScene();
    ctx.drawImage(scene, 0, 0, scene.width, scene.height, 0, 0, W, H);

    for (const s of stuck) {
      if (s.r < 6) drawDot(s.x, s.y, s.r, s.a, s.sq, s.rot);
      else drawRefract(s.x, s.y, s.r, s.sq, s.tail * 0.5, s.a, s.rot * 0.4);
    }
    for (const f of fallers) {
      for (const t of f.trail) drawDot(t.x, t.y, t.r, t.a);
      const st = Math.min(1.5, 1 + f.vy * 0.45);
      drawRefract(f.x, f.y, f.r / Math.sqrt(st), st, 0.6 + f.vy * 0.9, 1);
    }
    if (collector.active) {
      const sq = 1 + Math.sin(collector.wob) * collector.wobA * 0.02;
      const move = Math.min(0.4, collector.speed * 0.045);
      drawRefract(
        collector.x,
        collector.y,
        (collector.r * sq) / (1 + move * 0.5),
        (1 + move) / sq,
        0.25 + move * 1.6,
        1,
        collector.rot,
      );
      if (collector.r > BREAK_R * 0.8) {
        ctx.beginPath();
        ctx.ellipse(
          collector.x,
          collector.y + collector.r * 1.05,
          collector.r * 0.5,
          collector.r * 0.14,
          0,
          0,
          6.2832,
        );
        ctx.fillStyle = "rgba(200,230,245,.10)";
        ctx.fill();
      }
    }
  }

  let rafId = 0;
  function loop(t: number) {
    const dt = Math.min(50, t - last);
    last = t;
    update(dt);
    render();
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);

  return {
    setMuted(m: boolean) {
      muted = m;
      if (master) master.gain.value = m ? 0 : 0.55;
    },
    setAuto(a: boolean) {
      ac();
      autoMode = a;
      if (a) autoTimer = 0; // すぐ降り始める
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerup", onPointerUp);
      cv.removeEventListener("pointerdown", onPointerDown);
      cv.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const id of timeouts) clearTimeout(id);
      timeouts.clear();
      if (AC) void AC.close();
      AC = null;
    },
  };
}
