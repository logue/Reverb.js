/** Impulse response noise generation algorithm */
const Noise: Record<NoiseType, string> = {
  /** Blue noise */
  blue: 'blue',
  /** Green noise */
  green: 'green',
  /** Pink noise */
  pink: 'pink',
  /** Red noise */
  brown: 'red',
  /** Violet noise */
  violet: 'violet',
  /** White noise */
  white: 'white',
  /** Brown noise (same as red noise) */
  red: 'red',
} as const;

/** Noise Type */
export type NoiseType =
  | 'blue'
  | 'green'
  | 'pink'
  | 'red'
  | 'violet'
  | 'white'
  | 'brown';

/** Noise */
export default Noise;
