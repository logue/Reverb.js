/**
 * オプションのインターフェース
 */
export interface Option extends Object {
  /** @type {number?} ディケイ */
  decay: number;
  /** @type {number?} ディレイ */
  delay: number;
  /** @type {number?} フィルタ周波数(Hz) */
  filterFreq: number;
  /** @type {number?} フィルタ品質 */
  filterQ: number;
  /** @type {BiquadFilterType?} フィルタの種類 */
  filterType: BiquadFilterType;
  /** @type {number?} ドライ／ウェット比 */
  mix: number;
  /** @type {boolean?} レスポンス応答を反転 */
  reverse: boolean;
  /** @type {number?} レスポンス応答の時間（秒） */
  time: number;
}

/**
 * デフォルト値
 */
export const optionDefaults: Option = {
  decay: 5,
  delay: 0,
  reverse: false,
  time: 3,
  filterType: 'lowpass',
  filterFreq: 2200,
  filterQ: 1,
  mix: 0.5,
};
