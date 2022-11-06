import Noise, { type NoiseType } from '../NoiseType';

import { SYSTEM } from '@thi.ng/random';
import type { INorm } from '@thi.ng/random';

/** Reverb Option */
export default interface OptionInterface {
  /**
   * IR (Inpulse Response) colord noise algorithm (BLUE, GREEN, PINK, RED, VIOLET, WHITE)
   * @see {@link https://github.com/thi-ng/umbrella/tree/develop/packages/colored-noise}
   */
  noise: NoiseType;
  /** IR source noise scale */
  scale: number;
  /** Number of IR source noise peaks */
  peaks: number;
  /**
   * Randam noise algorythm
   * @see {@link https://github.com/thi-ng/umbrella/tree/develop/packages/random}
   */
  randomAlgorithm: INorm;
  /** Decay */
  decay: number;
  /** Delay until impulse response is generated */
  delay: number;
  /** Filter frequency applied to impulse response[Hz] */
  filterFreq: number;
  /** Filter quality for impulse response */
  filterQ: number;
  /** Filter type for impulse response */
  filterType: BiquadFilterType;
  /** Dry/Wet ratio */
  mix: number;
  /** Invert the impulse response */
  reverse: boolean;
  /** Impulse response length */
  time: number;
  /** Prevents multiple effectors from being connected. */
  once: boolean;
}

/** デフォルト値 */
export const defaults: OptionInterface = {
  noise: Noise.WHITE,
  scale: 1,
  peaks: 2,
  randomAlgorithm: SYSTEM,
  decay: 2,
  delay: 0,
  reverse: false,
  time: 2,
  filterType: 'allpass',
  filterFreq: 2200,
  filterQ: 1,
  mix: 0.5,
  once: false,
};
