import {NoiseType} from '../NoiseType';

/**
 * Reverb Option
 */
export default interface OptionInterface {
  /** Types of impulse response noise generation algorithms */
  noise: NoiseType;
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
}
