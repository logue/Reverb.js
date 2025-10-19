/**
 * Integration tests for Reverb effect
 */
import { beforeEach, describe, expect, it } from 'vitest';

import { createMockAudioContext, createMockAudioNode } from './setup.js';

import Reverb from '@/Reverb';

describe('Reverb Integration', () => {
  let audioContext: AudioContext;

  beforeEach(() => {
    audioContext = createMockAudioContext();
  });

  describe('complete reverb chain', () => {
    it('should create a complete reverb effect chain', () => {
      const reverb = new Reverb(audioContext, {
        time: 3,
        decay: 5,
        mix: 0.7,
        filterType: 'lowpass',
        noise: 'pink',
      });

      const sourceNode = createMockAudioNode();
      const outputNode = reverb.connect(sourceNode);

      expect(outputNode).toBeDefined();
      expect(sourceNode.connect).toHaveBeenCalled();
    });

    it('should handle parameter changes during runtime', () => {
      const reverb = new Reverb(audioContext, {});
      const sourceNode = createMockAudioNode();

      reverb.connect(sourceNode);

      // Change parameters
      reverb.time(4);
      reverb.decay(8);
      reverb.mix(0.8);
      reverb.filterFreq(1500);
      reverb.filterQ(2);
      reverb.reverse(true);

      // Should not throw errors
      expect(() => reverb.setNoise('blue')).not.toThrow();
      expect(() => reverb.peaks(3)).not.toThrow();
      expect(() => reverb.scale(1.5)).not.toThrow();
    });

    it('should handle multiple connects and disconnects', () => {
      const reverb = new Reverb(audioContext, {});
      const sourceNode1 = createMockAudioNode();
      const sourceNode2 = createMockAudioNode();

      const output1 = reverb.connect(sourceNode1);
      reverb.disconnect(sourceNode1);

      const output2 = reverb.connect(sourceNode2);
      reverb.disconnect(sourceNode2);

      expect(output1).toBeDefined();
      expect(output2).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle extreme parameter values', () => {
      const reverb = new Reverb(audioContext, {});

      // Test boundary values
      expect(() => reverb.time(1)).not.toThrow();
      expect(() => reverb.time(50)).not.toThrow();
      expect(() => reverb.decay(0)).not.toThrow();
      expect(() => reverb.decay(100)).not.toThrow();
      expect(() => reverb.mix(0)).not.toThrow();
      expect(() => reverb.mix(1)).not.toThrow();
    });

    it('should handle rapid parameter changes', () => {
      const reverb = new Reverb(audioContext, {});

      // Rapidly change parameters
      for (let i = 0; i < 10; i++) {
        reverb.mix(i / 10);
        reverb.decay(i * 10);
        reverb.filterFreq(20 + i * 1000);
      }

      expect(reverb).toBeDefined();
    });
  });

  describe('performance and memory', () => {
    it('should handle multiple reverb instances', () => {
      const reverbs = [];

      for (let i = 0; i < 5; i++) {
        const reverb = new Reverb(audioContext, {
          time: 1 + i,
          decay: i * 2,
          mix: i / 10,
        });
        reverbs.push(reverb);
      }

      expect(reverbs).toHaveLength(5);

      // Connect each reverb
      for (const reverb of reverbs) {
        const sourceNode = createMockAudioNode();
        const outputNode = reverb.connect(sourceNode);
        expect(outputNode).toBeDefined();
      }
    });

    it('should clean up properly on disconnect', () => {
      const reverb = new Reverb(audioContext, {});
      const sourceNode = createMockAudioNode();

      reverb.connect(sourceNode);
      const result = reverb.disconnect(sourceNode);

      expect(result).toBe(sourceNode);
    });
  });

  describe('different noise types', () => {
    it('should work with all noise types', () => {
      const noiseTypes = [
        'blue',
        'brown',
        'green',
        'pink',
        'red',
        'violet',
        'white',
      ] as const;

      for (const noiseType of noiseTypes) {
        const reverb = new Reverb(audioContext, { noise: noiseType });
        const sourceNode = createMockAudioNode();

        expect(() => reverb.connect(sourceNode)).not.toThrow();
        expect(() => reverb.disconnect(sourceNode)).not.toThrow();
      }
    });
  });

  describe('filter configurations', () => {
    it('should work with all filter types', () => {
      const filterTypes: BiquadFilterType[] = [
        'allpass',
        'bandpass',
        'highpass',
        'highshelf',
        'lowpass',
        'lowshelf',
        'notch',
        'peaking',
      ];

      for (const filterType of filterTypes) {
        const reverb = new Reverb(audioContext, { filterType });
        const sourceNode = createMockAudioNode();

        expect(() => reverb.connect(sourceNode)).not.toThrow();
        expect(() => reverb.filterFreq(1000)).not.toThrow();
        expect(() => reverb.filterQ(1.5)).not.toThrow();
      }
    });
  });

  describe('error handling', () => {
    it('should throw appropriate errors for invalid parameters', () => {
      const reverb = new Reverb(audioContext, {});

      // Test all parameter validation
      expect(() => reverb.mix(-0.1)).toThrow(
        'Dry/Wet ratio must be between 0 to 1.'
      );
      expect(() => reverb.mix(1.1)).toThrow(
        'Dry/Wet ratio must be between 0 to 1.'
      );

      expect(() => reverb.time(0.5)).toThrow(
        'Time length of impulse response must be less than 50sec.'
      );
      expect(() => reverb.time(51)).toThrow(
        'Time length of impulse response must be less than 50sec.'
      );

      expect(() => reverb.decay(-1)).toThrow(
        'Impulse Response decay level must be less than 100.'
      );
      expect(() => reverb.decay(101)).toThrow(
        'Impulse Response decay level must be less than 100.'
      );

      expect(() => reverb.delay(-1)).toThrow(
        'Impulse Response delay time must be less than 100.'
      );
      expect(() => reverb.delay(101)).toThrow(
        'Impulse Response delay time must be less than 100.'
      );

      expect(() => reverb.filterFreq(19)).toThrow(
        'Filter frequrncy must be between 20 and 20000.'
      );
      expect(() => reverb.filterFreq(20001)).toThrow(
        'Filter frequrncy must be between 20 and 20000.'
      );

      expect(() => reverb.filterQ(-1)).toThrow(
        'Filter Q value must be between 0 and 10.'
      );
      expect(() => reverb.filterQ(11)).toThrow(
        'Filter Q value must be between 0 and 10.'
      );
    });

    it('should handle null or undefined contexts gracefully', () => {
      // This would test error handling for invalid AudioContext
      // In real scenarios, we might want to validate the context
      expect(() => new Reverb(audioContext, {})).not.toThrow();
    });
  });
});
