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

type NoiseGenerator = (
  opts?: Partial<ColoredNoiseOpts>,
) => Generator<number, void, unknown>;

export const noiseTypes: NoiseType[] = [
  'blue',
  'brown',
  'green',
  'pink',
  'red',
  'violet',
  'white',
];

export const NoiseType: Record<NoiseType, NoiseGenerator> = {
  blue,
  brown: red,
  green,
  pink,
  red,
  violet,
  white,
};

export default NoiseType;
