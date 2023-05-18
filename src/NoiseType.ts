/** Impulse response noise generation algorithm */
const Noise: Record<NoiseType, string> = {
  /** Blue noise */
  blue: 'blue',
  /** Brown noise (same as red noise) */
  brown: 'red',
  /** Green noise */
  green: 'green',
  /** Pink noise */
  pink: 'pink',
  /** Red noise */
  red: 'red',
  /** Violet noise */
  violet: 'violet',
  /** White noise */
  white: 'white',
} as const;

/** Noise Type */
export type NoiseType =
  | 'blue'
  | 'brown'
  | 'green'
  | 'pink'
  | 'red'
  | 'violet'
  | 'white';

/** Noise */
export default Noise;
