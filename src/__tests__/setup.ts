/**
 * Test setup and utility functions
 */
import { rs } from '@rstest/core';

// Mock Web Audio API for testing
export const createMockAudioContext = (): AudioContext => {
  const mockAudioContext = {
    sampleRate: 44100,
    state: 'running',
    createBuffer: rs
      .fn()
      .mockImplementation(
        (channels: number, length: number, sampleRate: number) => ({
          numberOfChannels: channels,
          length,
          sampleRate,
          getChannelData: rs.fn().mockReturnValue(new Float32Array(length)),
        }),
      ),
    createGain: rs.fn().mockReturnValue({
      gain: { value: 1 },
      connect: rs.fn(),
      disconnect: rs.fn(),
    }),
    createBiquadFilter: rs.fn().mockReturnValue({
      type: 'allpass',
      frequency: { value: 350 },
      Q: { value: 1 },
      connect: rs.fn(),
      disconnect: rs.fn(),
    }),
    createConvolver: rs.fn().mockReturnValue({
      buffer: null,
      connect: rs.fn(),
      disconnect: rs.fn(),
    }),
    close: rs.fn(),
    resume: rs.fn(),
    suspend: rs.fn(),
  } as unknown as AudioContext;

  return mockAudioContext;
};

// Mock Audio Node for testing
export const createMockAudioNode = (): AudioNode => {
  const mockAudioNode = {
    connect: rs.fn(),
    disconnect: rs.fn(),
    context: createMockAudioContext(),
    numberOfInputs: 1,
    numberOfOutputs: 1,
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
  } as unknown as AudioNode;

  return mockAudioNode;
};
