/**
 * OptionInterface tests
 */
import { describe, expect, it } from '@rstest/core';

import { ReverbOptions } from '../types/ReverbOptions';

describe('OptionInterface', () => {
  describe('ReverbOptions', () => {
    it('should have all required properties with valid default values', () => {
      expect(ReverbOptions).toBeDefined();
      expect(typeof ReverbOptions).toBe('object');

      // Check all required properties exist
      expect(ReverbOptions).toHaveProperty('noise');
      expect(ReverbOptions).toHaveProperty('scale');
      expect(ReverbOptions).toHaveProperty('peaks');
      expect(ReverbOptions).toHaveProperty('randomAlgorithm');
      expect(ReverbOptions).toHaveProperty('decay');
      expect(ReverbOptions).toHaveProperty('delay');
      expect(ReverbOptions).toHaveProperty('reverse');
      expect(ReverbOptions).toHaveProperty('time');
      expect(ReverbOptions).toHaveProperty('filterType');
      expect(ReverbOptions).toHaveProperty('filterFreq');
      expect(ReverbOptions).toHaveProperty('filterQ');
      expect(ReverbOptions).toHaveProperty('mix');
      expect(ReverbOptions).toHaveProperty('once');
    });

    it('should have valid default noise type', () => {
      expect(ReverbOptions.noise).toBe('white');
      expect([
        'blue',
        'brown',
        'green',
        'pink',
        'red',
        'violet',
        'white',
      ]).toContain(ReverbOptions.noise);
    });

    it('should have valid numeric ReverbOptions', () => {
      expect(typeof ReverbOptions.scale).toBe('number');
      expect(ReverbOptions.scale).toBe(1);

      expect(typeof ReverbOptions.peaks).toBe('number');
      expect(ReverbOptions.peaks).toBe(2);

      expect(typeof ReverbOptions.decay).toBe('number');
      expect(ReverbOptions.decay).toBe(2);

      expect(typeof ReverbOptions.delay).toBe('number');
      expect(ReverbOptions.delay).toBe(0);

      expect(typeof ReverbOptions.time).toBe('number');
      expect(ReverbOptions.time).toBe(2);

      expect(typeof ReverbOptions.filterFreq).toBe('number');
      expect(ReverbOptions.filterFreq).toBe(2200);

      expect(typeof ReverbOptions.filterQ).toBe('number');
      expect(ReverbOptions.filterQ).toBe(1);

      expect(typeof ReverbOptions.mix).toBe('number');
      expect(ReverbOptions.mix).toBe(0.5);
    });

    it('should have valid boolean ReverbOptions', () => {
      expect(typeof ReverbOptions.reverse).toBe('boolean');
      expect(ReverbOptions.reverse).toBe(false);

      expect(typeof ReverbOptions.once).toBe('boolean');
      expect(ReverbOptions.once).toBe(false);
    });

    it('should have valid filter type default', () => {
      expect(ReverbOptions.filterType).toBe('allpass');
      const validFilterTypes = [
        'allpass',
        'bandpass',
        'highpass',
        'highshelf',
        'lowpass',
        'lowshelf',
        'notch',
        'peaking',
      ];
      expect(validFilterTypes).toContain(ReverbOptions.filterType);
    });

    it('should have randomAlgorithm defined', () => {
      expect(ReverbOptions.randomAlgorithm).toBeDefined();
      expect(typeof ReverbOptions.randomAlgorithm).toBe('object');
    });
  });

  describe('interface validation', () => {
    it('should accept valid option objects', () => {
      const validOptions: Partial<ReverbOptions> = {
        noise: 'pink',
        scale: 1.5,
        peaks: 3,
        decay: 5,
        delay: 10,
        reverse: true,
        time: 3,
        filterType: 'lowpass',
        filterFreq: 1000,
        filterQ: 2,
        mix: 0.7,
        once: true,
      };

      // Test that the object conforms to the interface
      expect(validOptions).toBeDefined();
      expect(typeof validOptions).toBe('object');
    });

    it('should work with partial options', () => {
      const partialOptions: Partial<ReverbOptions> = {
        mix: 0.8,
        time: 4,
      };

      expect(partialOptions).toBeDefined();
      expect(partialOptions.mix).toBe(0.8);
      expect(partialOptions.time).toBe(4);
    });

    it('should work with empty options object', () => {
      const emptyOptions: Partial<ReverbOptions> = {};
      expect(emptyOptions).toBeDefined();
      expect(typeof emptyOptions).toBe('object');
    });
  });

  describe('default value ranges', () => {
    it('should have default values within valid ranges', () => {
      // Mix should be between 0 and 1
      expect(ReverbOptions.mix).toBeGreaterThanOrEqual(0);
      expect(ReverbOptions.mix).toBeLessThanOrEqual(1);

      // Time should be between 1 and 50
      expect(ReverbOptions.time).toBeGreaterThanOrEqual(1);
      expect(ReverbOptions.time).toBeLessThanOrEqual(50);

      // Decay should be between 0 and 100
      expect(ReverbOptions.decay).toBeGreaterThanOrEqual(0);
      expect(ReverbOptions.decay).toBeLessThanOrEqual(100);

      // Delay should be between 0 and 100
      expect(ReverbOptions.delay).toBeGreaterThanOrEqual(0);
      expect(ReverbOptions.delay).toBeLessThanOrEqual(100);

      // Filter frequency should be between 20 and 20000
      expect(ReverbOptions.filterFreq).toBeGreaterThanOrEqual(20);
      expect(ReverbOptions.filterFreq).toBeLessThanOrEqual(20000);

      // Filter Q should be between 0 and 10
      expect(ReverbOptions.filterQ).toBeGreaterThanOrEqual(0);
      expect(ReverbOptions.filterQ).toBeLessThanOrEqual(10);
    });
  });
});
