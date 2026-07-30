import {
  blue,
  type ColoredNoiseOpts,
  green,
  pink,
  red,
  violet,
  white,
} from '@thi.ng/colored-noise';

/** Noise Type */
export type Noise =
  | 'blue'
  | 'brown'
  | 'green'
  | 'pink'
  | 'red'
  | 'violet'
  | 'white';

/** All valid {@link NoiseType} values. */
export const noiseTypes: Noise[] = [
  'blue',
  'brown',
  'green',
  'pink',
  'red',
  'violet',
  'white',
];

/** Map of noise types to their respective generator functions. */
export const Noise: Record<Noise, NoiseGenerator> = {
  blue,
  brown: red,
  green,
  pink,
  red,
  violet,
  white,
};

/** A colored-noise generator function. */
export type NoiseGenerator = (
  opts?: Partial<ColoredNoiseOpts>,
) => Generator<number, void, unknown>;

export default Noise;
