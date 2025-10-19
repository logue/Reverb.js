/**
 * End-to-end tests for Reverb.js
 * These tests simulate real-world usage scenarios
 */
import { beforeEach, describe, expect, it } from 'vitest';

import { createMockAudioContext, createMockAudioNode } from './setup.js';

import Reverb from '@/Reverb';

describe('Reverb E2E', () => {
  let audioContext: AudioContext;

  beforeEach(() => {
    audioContext = createMockAudioContext();
  });

  describe('real-world scenarios', () => {
    it('should create a simple reverb effect for a guitar track', () => {
      // Simulate a guitar reverb setup
      const guitarReverb = new Reverb(audioContext, {
        time: 2.5,
        decay: 3,
        mix: 0.3,
        filterType: 'highpass',
        filterFreq: 100,
        noise: 'white',
      });

      const guitarTrack = createMockAudioNode();
      const output = guitarReverb.connect(guitarTrack);

      expect(output).toBeDefined();
      expect(guitarTrack.connect).toHaveBeenCalled();

      // Adjust reverb during playback
      guitarReverb.mix(0.4);
      guitarReverb.filterFreq(120);

      guitarReverb.disconnect(guitarTrack);
    });

    it('should create a vocal reverb with specific characteristics', () => {
      // Simulate a vocal reverb setup
      const vocalReverb = new Reverb(audioContext, {
        time: 1.8,
        decay: 2.5,
        mix: 0.25,
        filterType: 'lowpass',
        filterFreq: 8000,
        filterQ: 0.7,
        noise: 'pink',
        delay: 15,
      });

      const vocalTrack = createMockAudioNode();
      const output = vocalReverb.connect(vocalTrack);

      expect(output).toBeDefined();

      // Test parameter automation
      const automationSteps = [0.15, 0.2, 0.3, 0.25, 0.2];
      for (const mixValue of automationSteps) {
        vocalReverb.mix(mixValue);
      }

      vocalReverb.disconnect(vocalTrack);
    });

    it('should create a drum room reverb', () => {
      // Simulate a drum room reverb
      const drumReverb = new Reverb(audioContext, {
        time: 0.8,
        decay: 1.5,
        mix: 0.15,
        filterType: 'allpass',
        noise: 'brown',
        peaks: 4,
        scale: 0.8,
      });

      const drumTrack = createMockAudioNode();
      const output = drumReverb.connect(drumTrack);

      expect(output).toBeDefined();

      // Test quick parameter changes (like a live performance)
      drumReverb.time(1.2);
      drumReverb.mix(0.2);
      drumReverb.decay(2);

      drumReverb.disconnect(drumTrack);
    });

    it('should create an experimental reverse reverb effect', () => {
      // Simulate an experimental reverse reverb
      const reverseReverb = new Reverb(audioContext, {
        time: 4,
        decay: 6,
        mix: 0.6,
        reverse: true,
        filterType: 'bandpass',
        filterFreq: 2000,
        filterQ: 3,
        noise: 'violet',
        delay: 50,
      });

      const sourceTrack = createMockAudioNode();
      const output = reverseReverb.connect(sourceTrack);

      expect(output).toBeDefined();

      // Test extreme parameter changes
      reverseReverb.mix(0.8);
      reverseReverb.filterFreq(500);
      reverseReverb.filterQ(8);

      reverseReverb.disconnect(sourceTrack);
    });
  });

  describe('performance scenarios', () => {
    it('should handle multiple reverb sends efficiently', () => {
      // Create multiple sends like in a mixing console
      const sends = [
        new Reverb(audioContext, { time: 1.2, mix: 0.2, noise: 'white' }),
        new Reverb(audioContext, { time: 2.5, mix: 0.3, noise: 'pink' }),
        new Reverb(audioContext, { time: 4.0, mix: 0.4, noise: 'brown' }),
      ];

      const tracks = [
        createMockAudioNode(),
        createMockAudioNode(),
        createMockAudioNode(),
      ];

      // Connect tracks to different reverb sends
      for (let i = 0; i < sends.length; i++) {
        const output = sends[i].connect(tracks[i]);
        expect(output).toBeDefined();
      }

      // Disconnect all
      for (let i = 0; i < sends.length; i++) {
        sends[i].disconnect(tracks[i]);
      }
    });

    it('should handle rapid parameter automation', () => {
      const reverb = new Reverb(audioContext, {});
      const sourceNode = createMockAudioNode();

      reverb.connect(sourceNode);

      // Simulate rapid automation (like from a MIDI controller)
      for (let i = 0; i < 100; i++) {
        const mixValue = Math.sin(i * 0.1) * 0.5 + 0.5; // Oscillating between 0 and 1
        reverb.mix(mixValue);

        const freqValue = 1000 + Math.sin(i * 0.05) * 500; // Oscillating frequency
        reverb.filterFreq(freqValue);
      }

      reverb.disconnect(sourceNode);
    });
  });

  describe('edge case scenarios', () => {
    it('should handle very short reverb times', () => {
      const shortReverb = new Reverb(audioContext, {
        time: 1, // Minimum time
        decay: 0, // Minimum decay
        mix: 0, // Dry signal only
      });

      const sourceNode = createMockAudioNode();
      const output = shortReverb.connect(sourceNode);

      expect(output).toBeDefined();
      shortReverb.disconnect(sourceNode);
    });

    it('should handle very long reverb times', () => {
      const longReverb = new Reverb(audioContext, {
        time: 50, // Maximum time
        decay: 100, // Maximum decay
        mix: 1, // Wet signal only
      });

      const sourceNode = createMockAudioNode();
      const output = longReverb.connect(sourceNode);

      expect(output).toBeDefined();
      longReverb.disconnect(sourceNode);
    });

    it('should handle connect/disconnect cycles', () => {
      const reverb = new Reverb(audioContext, {});
      const sourceNode = createMockAudioNode();

      // Multiple connect/disconnect cycles
      for (let i = 0; i < 5; i++) {
        const output = reverb.connect(sourceNode);
        expect(output).toBeDefined();
        reverb.disconnect(sourceNode);
      }
    });
  });

  describe('filter scenarios', () => {
    it('should work with different filter configurations for different genres', () => {
      const filterConfigs = [
        // Rock/Metal - High-pass to remove muddiness
        {
          filterType: 'highpass' as BiquadFilterType,
          filterFreq: 150,
          filterQ: 0.7,
        },
        // Jazz/Classical - Low-pass for warmth
        {
          filterType: 'lowpass' as BiquadFilterType,
          filterFreq: 8000,
          filterQ: 1.0,
        },
        // Electronic - Bandpass for specific frequency ranges
        {
          filterType: 'bandpass' as BiquadFilterType,
          filterFreq: 2000,
          filterQ: 2.0,
        },
        // Experimental - Notch filter
        {
          filterType: 'notch' as BiquadFilterType,
          filterFreq: 1000,
          filterQ: 5.0,
        },
      ];

      for (const config of filterConfigs) {
        const reverb = new Reverb(audioContext, {
          filterType: config.filterType,
          filterFreq: config.filterFreq,
          filterQ: config.filterQ,
        });

        const sourceNode = createMockAudioNode();
        const output = reverb.connect(sourceNode);

        expect(output).toBeDefined();
        reverb.disconnect(sourceNode);
      }
    });
  });

  describe('noise algorithm scenarios', () => {
    it('should produce different characteristics with different noise types', () => {
      const noiseConfigs = [
        { noise: 'white', use: 'General purpose reverb' },
        { noise: 'pink', use: 'Warmer, more natural reverb' },
        { noise: 'brown', use: 'Very warm, dark reverb' },
        { noise: 'blue', use: 'Bright, crisp reverb' },
        { noise: 'violet', use: 'Very bright reverb' },
        { noise: 'red', use: 'Alternative to brown' },
        { noise: 'green', use: 'Balanced frequency response' },
      ] as const;

      for (const config of noiseConfigs) {
        const reverb = new Reverb(audioContext, {
          noise: config.noise,
          time: 2,
          decay: 3,
          mix: 0.4,
        });

        const sourceNode = createMockAudioNode();
        const output = reverb.connect(sourceNode);

        expect(output).toBeDefined();
        reverb.disconnect(sourceNode);
      }
    });
  });
});
