import type { RainTexts } from "../engine";

/** エンジンに渡すことば一式 + UI(aria-label)のことば */
export interface RainLocale extends RainTexts {
  ui: {
    /** canvas(窓ガラス)の説明 */
    stage: string;
    /** 雨がふるモード切替ボタン */
    auto: string;
    /** 音の切替ボタン */
    sound: string;
  };
}
