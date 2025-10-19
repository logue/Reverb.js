/**
 * Reverb class unit tests
 */
import { beforeEach, describe, expect, it } from 'vitest';

import { createMockAudioContext, createMockAudioNode } from './setup.js';

import type { NoiseType } from '@/NoiseType';

import Reverb from '@/Reverb';

describe('Reverb', () => {
  let audioContext: AudioContext;
  let reverb: Reverb;

  beforeEach(() => {
    audioContext = createMockAudioContext();
    reverb = new Reverb(audioContext, {});
  });

  describe('constructor', () => {
    it('should create a Reverb instance with default options', () => {
      expect(reverb).toBeInstanceOf(Reverb);
      expect(Reverb.version).toBeDefined();
      expect(Reverb.build).toBeDefined();
    });

    it('should create a Reverb instance with custom options', () => {
      const customOptions = {
        time: 3,
        decay: 5,
        mix: 0.7,
        filterType: 'lowpass' as BiquadFilterType,
        noise: 'pink' as NoiseType,
      };
      const customReverb = new Reverb(audioContext, customOptions);
      expect(customReverb).toBeInstanceOf(Reverb);
    });
  });

  describe('connect', () => {
    it('should connect an audio node and return the output node', () => {
      const sourceNode = createMockAudioNode();
      const outputNode = reverb.connect(sourceNode);

      expect(outputNode).toBeDefined();
      expect(sourceNode.connect).toHaveBeenCalled();
    });

    it('should handle once option correctly', () => {
      const onceReverb = new Reverb(audioContext, { once: true });
      const sourceNode = createMockAudioNode();

      const outputNode1 = onceReverb.connect(sourceNode);
      const outputNode2 = onceReverb.connect(sourceNode);

      expect(outputNode1).toBeDefined();
      expect(outputNode2).toBeDefined();
    });
  });

  describe('disconnect', () => {
    it('should disconnect the reverb node', () => {
      const sourceNode = createMockAudioNode();
      reverb.connect(sourceNode);

      const result = reverb.disconnect(sourceNode);
      expect(result).toBe(sourceNode);
    });

    it('should handle disconnection when not connected', () => {
      const sourceNode = createMockAudioNode();
      const result = reverb.disconnect(sourceNode);
      expect(result).toBe(sourceNode);
    });
  });

  describe('mix', () => {
    it('should set dry/wet ratio correctly', () => {
      expect(() => reverb.mix(0.3)).not.toThrow();
      expect(() => reverb.mix(0)).not.toThrow();
      expect(() => reverb.mix(1)).not.toThrow();
    });

    it('should throw error for invalid mix values', () => {
      expect(() => reverb.mix(-0.1)).toThrow(RangeError);
      expect(() => reverb.mix(1.1)).toThrow(RangeError);
    });
  });

  describe('time', () => {
    it('should set impulse response time correctly', () => {
      expect(() => reverb.time(2.5)).not.toThrow();
      expect(() => reverb.time(1)).not.toThrow();
      expect(() => reverb.time(50)).not.toThrow();
    });

    it('should throw error for invalid time values', () => {
      expect(() => reverb.time(0.5)).toThrow(RangeError);
      expect(() => reverb.time(51)).toThrow(RangeError);
    });
  });

  describe('decay', () => {
    it('should set decay value correctly', () => {
      expect(() => reverb.decay(5)).not.toThrow();
      expect(() => reverb.decay(0)).not.toThrow();
      expect(() => reverb.decay(100)).not.toThrow();
    });

    it('should throw error for invalid decay values', () => {
      expect(() => reverb.decay(-1)).toThrow(RangeError);
      expect(() => reverb.decay(101)).toThrow(RangeError);
    });
  });

  describe('delay', () => {
    it('should set delay value correctly', () => {
      expect(() => reverb.delay(50)).not.toThrow();
      expect(() => reverb.delay(0)).not.toThrow();
      expect(() => reverb.delay(100)).not.toThrow();
    });

    it('should throw error for invalid delay values', () => {
      expect(() => reverb.delay(-1)).toThrow(RangeError);
      expect(() => reverb.delay(101)).toThrow(RangeError);
    });
  });

  describe('reverse', () => {
    it('should set reverse option correctly', () => {
      expect(() => reverb.reverse(true)).not.toThrow();
      expect(() => reverb.reverse(false)).not.toThrow();
    });
  });

  describe('filterType', () => {
    it('should set filter type correctly', () => {
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

      for (const type of filterTypes) {
        expect(() => reverb.filterType(type)).not.toThrow();
      }
    });
  });

  describe('filterFreq', () => {
    it('should set filter frequency correctly', () => {
      expect(() => reverb.filterFreq(1000)).not.toThrow();
      expect(() => reverb.filterFreq(20)).not.toThrow();
      expect(() => reverb.filterFreq(20000)).not.toThrow();
    });

    it('should throw error for invalid frequency values', () => {
      expect(() => reverb.filterFreq(19)).toThrow(RangeError);
      expect(() => reverb.filterFreq(20001)).toThrow(RangeError);
    });
  });

  describe('filterQ', () => {
    it('should set filter Q correctly', () => {
      expect(() => reverb.filterQ(1)).not.toThrow();
      expect(() => reverb.filterQ(0)).not.toThrow();
      expect(() => reverb.filterQ(10)).not.toThrow();
    });

    it('should throw error for invalid Q values', () => {
      expect(() => reverb.filterQ(-1)).toThrow(RangeError);
      expect(() => reverb.filterQ(11)).toThrow(RangeError);
    });
  });

  describe('peaks', () => {
    it('should set peaks value correctly', () => {
      expect(() => reverb.peaks(5)).not.toThrow();
    });
  });

  describe('scale', () => {
    it('should set scale value correctly', () => {
      expect(() => reverb.scale(0.5)).not.toThrow();
      expect(() => reverb.scale(2)).not.toThrow();
    });
  });

  describe('setNoise', () => {
    it('should set noise type correctly', () => {
      const noiseTypes: NoiseType[] = [
        'blue',
        'brown',
        'green',
        'pink',
        'red',
        'violet',
        'white',
      ];

      for (const type of noiseTypes) {
        expect(() => reverb.setNoise(type)).not.toThrow();
      }
    });
  });

  describe('setRandomAlgorithm', () => {
    it('should set random algorithm correctly', () => {
      // Using a mock random algorithm
      const mockRandom = {
        norm: () => Math.random(),
        int: () => Math.floor(Math.random() * 100),
        float: () => Math.random(),
        probability: () => Math.random() < 0.5,
      };

      expect(() => reverb.setRandomAlgorithm(mockRandom)).not.toThrow();
    });
  });

  describe('static properties', () => {
    it('should have version and build properties', () => {
      expect(typeof Reverb.version).toBe('string');
      expect(typeof Reverb.build).toBe('string');
    });
  });
});
