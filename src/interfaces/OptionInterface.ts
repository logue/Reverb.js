import {NoiseType} from '../NoiseType';

/**
 * オプションのインターフェース
 */
export default interface OptionInterface {
  /** @type ノイズ種別 */
  noise: NoiseType;
  /** @type ディケイ */
  decay: number;
  /** @type ディレイ */
  delay: number;
  /** @type フィルタ周波数(Hz) */
  filterFreq: number;
  /** @type フィルタ品質 */
  filterQ: number;
  /** @type {BiquadFilterType?} フィルタの種類 */
  filterType: BiquadFilterType;
  /** @type ドライ／ウェット比 */
  mix: number;
  /** @type レスポンス応答を反転 */
  reverse: boolean;
  /** @type レスポンス応答の時間（秒） */
  time: number;
}
