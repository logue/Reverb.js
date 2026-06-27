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

export const NoiseType: Record<
  NoiseType,
  (opts?: Partial<ColoredNoiseOpts>) => Generator<number, void, unknown>
> = {
  blue,
  brown: red,
  green,
  pink,
  red,
  violet,
  white,
};
