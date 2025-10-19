/**
 * OptionInterface tests
 */
import { describe, expect, it } from 'vitest';

import type OptionInterface from '@/interfaces/OptionInterface';

import { defaults } from '@/interfaces/OptionInterface';

describe('OptionInterface', () => {
  describe('defaults', () => {
    it('should have all required properties with valid default values', () => {
      expect(defaults).toBeDefined();
      expect(typeof defaults).toBe('object');

      // Check all required properties exist
      expect(defaults).toHaveProperty('noise');
      expect(defaults).toHaveProperty('scale');
      expect(defaults).toHaveProperty('peaks');
      expect(defaults).toHaveProperty('randomAlgorithm');
      expect(defaults).toHaveProperty('decay');
      expect(defaults).toHaveProperty('delay');
      expect(defaults).toHaveProperty('reverse');
      expect(defaults).toHaveProperty('time');
      expect(defaults).toHaveProperty('filterType');
      expect(defaults).toHaveProperty('filterFreq');
      expect(defaults).toHaveProperty('filterQ');
      expect(defaults).toHaveProperty('mix');
      expect(defaults).toHaveProperty('once');
    });

    it('should have valid default noise type', () => {
      expect(defaults.noise).toBe('white');
      expect([
        'blue',
        'brown',
        'green',
        'pink',
        'red',
        'violet',
        'white',
      ]).toContain(defaults.noise);
    });

    it('should have valid numeric defaults', () => {
      expect(typeof defaults.scale).toBe('number');
      expect(defaults.scale).toBe(1);

      expect(typeof defaults.peaks).toBe('number');
      expect(defaults.peaks).toBe(2);

      expect(typeof defaults.decay).toBe('number');
      expect(defaults.decay).toBe(2);

      expect(typeof defaults.delay).toBe('number');
      expect(defaults.delay).toBe(0);

      expect(typeof defaults.time).toBe('number');
      expect(defaults.time).toBe(2);

      expect(typeof defaults.filterFreq).toBe('number');
      expect(defaults.filterFreq).toBe(2200);

      expect(typeof defaults.filterQ).toBe('number');
      expect(defaults.filterQ).toBe(1);

      expect(typeof defaults.mix).toBe('number');
      expect(defaults.mix).toBe(0.5);
    });

    it('should have valid boolean defaults', () => {
      expect(typeof defaults.reverse).toBe('boolean');
      expect(defaults.reverse).toBe(false);

      expect(typeof defaults.once).toBe('boolean');
      expect(defaults.once).toBe(false);
    });

    it('should have valid filter type default', () => {
      expect(defaults.filterType).toBe('allpass');
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
      expect(validFilterTypes).toContain(defaults.filterType);
    });

    it('should have randomAlgorithm defined', () => {
      expect(defaults.randomAlgorithm).toBeDefined();
      expect(typeof defaults.randomAlgorithm).toBe('object');
    });
  });

  describe('interface validation', () => {
    it('should accept valid option objects', () => {
      const validOptions: Partial<OptionInterface> = {
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
      const partialOptions: Partial<OptionInterface> = {
        mix: 0.8,
        time: 4,
      };

      expect(partialOptions).toBeDefined();
      expect(partialOptions.mix).toBe(0.8);
      expect(partialOptions.time).toBe(4);
    });

    it('should work with empty options object', () => {
      const emptyOptions: Partial<OptionInterface> = {};
      expect(emptyOptions).toBeDefined();
      expect(typeof emptyOptions).toBe('object');
    });
  });

  describe('default value ranges', () => {
    it('should have default values within valid ranges', () => {
      // Mix should be between 0 and 1
      expect(defaults.mix).toBeGreaterThanOrEqual(0);
      expect(defaults.mix).toBeLessThanOrEqual(1);

      // Time should be between 1 and 50
      expect(defaults.time).toBeGreaterThanOrEqual(1);
      expect(defaults.time).toBeLessThanOrEqual(50);

      // Decay should be between 0 and 100
      expect(defaults.decay).toBeGreaterThanOrEqual(0);
      expect(defaults.decay).toBeLessThanOrEqual(100);

      // Delay should be between 0 and 100
      expect(defaults.delay).toBeGreaterThanOrEqual(0);
      expect(defaults.delay).toBeLessThanOrEqual(100);

      // Filter frequency should be between 20 and 20000
      expect(defaults.filterFreq).toBeGreaterThanOrEqual(20);
      expect(defaults.filterFreq).toBeLessThanOrEqual(20000);

      // Filter Q should be between 0 and 10
      expect(defaults.filterQ).toBeGreaterThanOrEqual(0);
      expect(defaults.filterQ).toBeLessThanOrEqual(10);
    });
  });
});
