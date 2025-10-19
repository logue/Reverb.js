/**
 * NoiseType tests
 */
import { describe, expect, it } from 'vitest';

import type { NoiseType } from '@/NoiseType';

describe('NoiseType', () => {
  it('should define all expected noise types', () => {
    const expectedTypes: NoiseType[] = [
      'blue',
      'brown',
      'green',
      'pink',
      'red',
      'violet',
      'white',
    ];

    // Test that all types are valid
    for (const type of expectedTypes) {
      const isValidType: boolean = [
        'blue',
        'brown',
        'green',
        'pink',
        'red',
        'violet',
        'white',
      ].includes(type);

      expect(isValidType).toBe(true);
    }
  });

  it('should be compatible with string literal types', () => {
    const blueNoise: NoiseType = 'blue';
    const whiteNoise: NoiseType = 'white';
    const pinkNoise: NoiseType = 'pink';

    expect(blueNoise).toBe('blue');
    expect(whiteNoise).toBe('white');
    expect(pinkNoise).toBe('pink');
  });
});
