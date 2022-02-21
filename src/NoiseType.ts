/** Impulse response noise generation algorithm */
const Noise = {
  /** White noise */
  WHITE: 'white',
  /** Pink noise */
  PINK: 'pink',
  /** Brown Noise */
  BROWN: 'brown',
  // BLUE: 'blue',
} as const;

/** Noise Type */
export type NoiseType = typeof Noise[keyof typeof Noise];

/** Noise */
export default Noise;
