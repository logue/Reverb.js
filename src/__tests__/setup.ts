/**
 * Test setup and utility functions
 */
import { vi } from 'vitest';

// Mock Web Audio API for testing
export const createMockAudioContext = (): AudioContext => {
  const mockAudioContext = {
    sampleRate: 44100,
    state: 'running',
    createBuffer: vi
      .fn()
      .mockImplementation(
        (channels: number, length: number, sampleRate: number) => ({
          numberOfChannels: channels,
          length,
          sampleRate,
          getChannelData: vi.fn().mockReturnValue(new Float32Array(length)),
        })
      ),
    createGain: vi.fn().mockReturnValue({
      gain: { value: 1 },
      connect: vi.fn(),
      disconnect: vi.fn(),
    }),
    createBiquadFilter: vi.fn().mockReturnValue({
      type: 'allpass',
      frequency: { value: 350 },
      Q: { value: 1 },
      connect: vi.fn(),
      disconnect: vi.fn(),
    }),
    createConvolver: vi.fn().mockReturnValue({
      buffer: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    }),
    close: vi.fn(),
    resume: vi.fn(),
    suspend: vi.fn(),
  } as unknown as AudioContext;

  return mockAudioContext;
};

// Mock Audio Node for testing
export const createMockAudioNode = (): AudioNode => {
  const mockAudioNode = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    context: createMockAudioContext(),
    numberOfInputs: 1,
    numberOfOutputs: 1,
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
  } as unknown as AudioNode;

  return mockAudioNode;
};
