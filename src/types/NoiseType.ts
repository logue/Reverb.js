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
export type NoiseType =
  | 'blue'
  | 'brown'
  | 'green'
  | 'pink'
  | 'red'
  | 'violet'
  | 'white';

/** All valid {@link NoiseType} values. */
export const noiseTypes: NoiseType[] = [
  'blue',
  'brown',
  'green',
  'pink',
  'red',
  'violet',
  'white',
];

/** Map of noise types to their respective generator functions. */
export const NoiseType: Record<NoiseType, NoiseGenerator> = {
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

export default NoiseType;
