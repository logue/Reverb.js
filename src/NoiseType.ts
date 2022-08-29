/** Impulse response noise generation algorithm */
const Noise: Record<string, string> = {
  /** Blue noise */
  BLUE: 'blue',
  /** Green noise */
  GREEN: 'green',
  /** Pink noise */
  PINK: 'pink',
  /** Red noise */
  RED: 'red',
  /** Violet noise */
  VIOLET: 'violet',
  /** White noise */
  WHITE: 'white',
  /** Brown noise (same as red noise) */
  BROWN: 'red',
} as const;

/** Noise Type */
export type NoiseType = typeof Noise[keyof typeof Noise];

/** Noise */
export default Noise;
