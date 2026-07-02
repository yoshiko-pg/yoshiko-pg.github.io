import { useEffect, useRef, useState, type ReactNode } from "react";
import { createRainEngine, type RainEngine } from "./engine";
import styles from "./RainApp.module.css";

const DEFAULT_HINT = (
  <>
    しずくに ふれて つれていって
    <br />
    おもくなると ひとりでに おちる
  </>
);

function RainApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RainEngine | null>(null);
  const [muted, setMuted] = useState(false);
  // 横長の画面(PCなど)では、ながめるモードで始める
  const [autoMode, setAutoMode] = useState(
    () => window.innerWidth > window.innerHeight,
  );
  const [hint, setHint] = useState<ReactNode>(DEFAULT_HINT);
  const [hintFaded, setHintFaded] = useState(false);
  const [title, setTitle] = useState("RAIN.");
  const [titleFaded, setTitleFaded] = useState(false);
  const titleTimers = useRef<number[]>([]);

  useEffect(() => {
    document.title = "RAIN.";
    const engine = createRainEngine(canvasRef.current!, {
      showFlavor(text) {
        setHint(text);
        setHintFaded(false);
      },
      fadeHint() {
        setHintFaded(true);
      },
      showTown(name) {
        // タイトルがふわっと街名になり、しばらくしてRAIN.に戻る
        titleTimers.current.forEach(clearTimeout);
        titleTimers.current = [];
        const push = (fn: () => void, ms: number) =>
          titleTimers.current.push(window.setTimeout(fn, ms));
        setTitleFaded(true);
        push(() => {
          setTitle(name);
          setTitleFaded(false);
        }, 1000);
        push(() => setTitleFaded(true), 7000);
        push(() => {
          setTitle("RAIN.");
          setTitleFaded(false);
        }, 8000);
      },
    });
    engineRef.current = engine;
    if (window.innerWidth > window.innerHeight) engine.setAuto(true);
    return () => {
      engine.destroy();
      engineRef.current = null;
      titleTimers.current.forEach(clearTimeout);
      titleTimers.current = [];
    };
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    engineRef.current?.setMuted(next);
  };
  const toggleAuto = () => {
    const next = !autoMode;
    setAutoMode(next);
    engineRef.current?.setAuto(next);
  };

  return (
    <div className={styles.root}>
      <canvas
        ref={canvasRef}
        className={styles.stage}
        aria-label="雨の日の窓ガラス。なぞって雫を集める画面"
      />
      <header className={styles.header}>
        <h1 className={`${styles.title} ${titleFaded ? styles.fade : ""}`}>
          {title}
        </h1>
        <div className={styles.btns}>
          <button
            type="button"
            className={`${styles.ctl} ${autoMode ? styles.on : ""}`}
            aria-pressed={autoMode}
            aria-label="オートモード切替"
            onClick={toggleAuto}
          >
            <span className={styles.ic}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                <circle cx="12" cy="12" r="2.6" />
              </svg>
            </span>
            <span className={styles.lbl}>AUTO</span>
          </button>
          <button
            type="button"
            className={`${styles.ctl} ${muted ? styles.dim : ""}`}
            aria-pressed={muted}
            aria-label="音の切替"
            onClick={toggleMute}
          >
            <span className={styles.ic}>
              {muted ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" />
                  <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" />
                  <path d="M15.5 9a4.2 4.2 0 0 1 0 6" />
                  <path d="M17.8 7a7.2 7.2 0 0 1 0 10" />
                </svg>
              )}
            </span>
            <span className={styles.lbl}>SOUND</span>
          </button>
        </div>
      </header>
      <div className={`${styles.hint} ${hintFaded ? styles.fade : ""}`}>
        {hint}
      </div>
    </div>
  );
}

export default RainApp;
