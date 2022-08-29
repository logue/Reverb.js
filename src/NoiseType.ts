/** Impulse response noise generation algorithm */
const Noise: Record<string, string> = {
  BLUE: 'blue',
  GREEN: 'green',
  PINK: 'pink',
  RED: 'red',
  VIOLET: 'violet',
  WHITE: 'white',
} as const;

/** Noise Type */
export type NoiseType = typeof Noise[keyof typeof Noise];

/** Noise */
export default Noise;
