/// <reference path="./env.d.ts" />
import { type ColoredNoiseOpts, white } from '@thi.ng/colored-noise';
import type { INorm } from '@thi.ng/random';
import { take } from '@thi.ng/transducers';
import { defaults, type OptionInterface } from '@/interfaces/OptionInterface';
import Meta from '@/Meta';
import { type NoiseType, NoiseType as NoiseTypeMap } from '@/NoiseType';

type NoiseGenerator = (
  opts?: Partial<ColoredNoiseOpts>,
) => Generator<number, void, unknown>;

/**
 * Reverb effect class
 */
export default class Reverb {
  /** Version strings */
  static readonly version: string = Meta.version;
  /** Build date */
  static readonly build: string = Meta.date;
  /** AudioContext */
  private readonly ctx: AudioContext;
  /** Wet Level (Reverberated node) */
  private readonly wetGainNode: GainNode;
  /** Dry Level (Original sound node) */
  private readonly dryGainNode: GainNode;
  /** Impulse response filter */
  private readonly filterNode: BiquadFilterNode;
  /** Convolution node for applying impulse response */
  private readonly convolverNode: ConvolverNode;
  /** Output gain node */
  private readonly outputNode: GainNode;
  /** Option */
  private readonly options: OptionInterface;
  /** Connected flag */
  private isConnected: boolean;
  /** Noise generator */
  private noise: NoiseGenerator = white;
  /** Map of noise types to their respective generator functions. */
  private readonly noiseMap: Record<NoiseType, NoiseGenerator> = NoiseTypeMap;

  /**
   * Constructor
   *
   * @param ctx - Root AudioContext
   * @param options - Configure
   */
  constructor(ctx: AudioContext, options: Partial<OptionInterface> = {}) {
    this.ctx = ctx;
    this.options = { ...defaults, ...options };

    this.wetGainNode = this.ctx.createGain();
    this.dryGainNode = this.ctx.createGain();
    this.filterNode = this.ctx.createBiquadFilter();
    this.convolverNode = this.ctx.createConvolver();
    this.outputNode = this.ctx.createGain();
    this.isConnected = false;

    this.initializeAudioChain();
  }

  private initializeAudioChain(): void {
    this.filterType(this.options.filterType);
    this.setNoise(this.options.noise);
    this.buildImpulse();
    this.mix(this.options.mix);
  }

  /**
   * Connect the node for the reverb effect to the original sound node.
   *
   * @param sourceNode - Input source node
   */
  public connect(sourceNode: AudioNode): AudioNode {
    if (this.isConnected && this.options.once) {
      return this.outputNode;
    }

    if (this.isConnected) {
      this.disconnect(sourceNode);
    }

    this.convolverNode.connect(this.filterNode);
    this.filterNode.connect(this.wetGainNode);
    sourceNode.connect(this.convolverNode);
    sourceNode.connect(this.dryGainNode);
    sourceNode.connect(this.wetGainNode);
    this.dryGainNode.connect(this.outputNode);
    this.wetGainNode.connect(this.outputNode);
    this.isConnected = true;

    return this.outputNode;
  }

  /**
   * Disconnect the reverb node.
   *
   * @param sourceNode - Input source node
   */
  public disconnect(sourceNode?: AudioNode): AudioNode | undefined {
    if (this.isConnected) {
      this.convolverNode.disconnect(this.filterNode);
      this.filterNode.disconnect(this.wetGainNode);
    }
    this.isConnected = false;
    return sourceNode;
  }

  /**
   * Dry/Wet ratio.
   *
   * @param mix - Ratio (0~1)
   */
  public mix(mix: number): void {
    this.assertRange(
      mix,
      0,
      1,
      '[Reverb.js] Dry/Wet ratio must be between 0 to 1.',
    );
    this.options.mix = mix;
    this.dryGainNode.gain.value = 1 - mix;
    this.wetGainNode.gain.value = mix;
    console.debug(`[Reverb.js] Set dry/wet ratio to ${mix * 100}%`);
  }

  /**
   * Set Impulse Response time length (second).
   *
   * @param value - IR length
   */
  public time(value: number): void {
    this.assertRange(
      value,
      1,
      50,
      '[Reverb.js] Time length of impulse response must be less than 50sec.',
    );
    this.options.time = value;
    this.buildImpulse();
    console.debug(
      `[Reverb.js] Set impulse response time length to ${value}sec.`,
    );
  }

  /**
   * Impulse response decay rate.
   *
   * @param value - Decay value
   */
  public decay(value: number): void {
    this.assertRange(
      value,
      0,
      100,
      '[Reverb.js] Impulse Response decay level must be less than 100.',
    );
    this.options.decay = value;
    this.buildImpulse();
    console.debug(`[Reverb.js] Set impulse response decay level to ${value}.`);
  }

  /**
   * Delay before reverberation starts.
   *
   * @param value - Time[ms]
   */
  public delay(value: number): void {
    this.assertRange(
      value,
      0,
      100,
      '[Reverb.js] Impulse Response delay time must be less than 100.',
    );
    this.options.delay = value;
    this.buildImpulse();
    console.debug(
      `[Reverb.js] Set impulse response delay time to ${value}sec.`,
    );
  }

  /**
   * Reverse the impulse response.
   *
   * @param reverse - Reverse IR
   */
  public reverse(reverse: boolean): void {
    this.options.reverse = reverse;
    this.buildImpulse();
    console.debug(
      `[Reverb.js] Impulse response is ${reverse ? '' : 'not '}reversed.`,
    );
  }

  /**
   * Filter for impulse response.
   *
   * @param type - Filter type
   */
  public filterType(type: BiquadFilterType = 'allpass'): void {
    this.filterNode.type = this.options.filterType = type;
    console.debug(`[Reverb.js] Set filter type to ${type}`);
  }

  /**
   * Filter frequency applied to impulse response.
   *
   * @param freq - Frequency
   */
  public filterFreq(freq: number): void {
    this.assertRange(
      freq,
      20,
      20000,
      'Filter frequrncy must be between 20 and 20000.',
    );
    this.options.filterFreq = freq;
    this.filterNode.frequency.value = this.options.filterFreq;
    console.debug(`[Reverb.js] Set filter frequency to ${freq}Hz.`);
  }

  /**
   * Filter quality.
   *
   * @param q - Quality
   */
  public filterQ(q: number): void {
    this.assertRange(
      q,
      0,
      10,
      '[Reverb.js] Filter Q value must be between 0 and 10.',
    );
    this.options.filterQ = q;
    this.filterNode.Q.value = this.options.filterQ;
    console.debug(`[Reverb.js] Set filter Q to ${q}.`);
  }

  /**
   * Set IR source noise peaks.
   *
   * @param p - Peaks
   */
  public peaks(p: number): void {
    this.options.peaks = p;
    this.buildImpulse();
    console.debug(`[Reverb.js] Set IR source noise peaks to ${p}.`);
  }

  /**
   * Set IR source noise scale.
   *
   * @param s - Scale
   */
  public scale(s: number): void {
    this.options.scale = s;
    this.buildImpulse();
    console.debug(`[Reverb.js] Set IR source noise scale to ${s}.`);
  }

  /**
   * Noise source.
   *
   * @param duration - length of IR.
   */
  private getNoise(duration: number): number[] {
    return [
      ...take<number>(
        duration,
        this.noise({
          bins: this.options.peaks,
          scale: this.options.scale,
          rnd: this.options.randomAlgorithm,
        }),
      ),
    ];
  }

  /**
   * Inpulse Response noise algorithm.
   *
   * @param type - IR noise algorithm type.
   */
  public setNoise(type: NoiseType): void {
    this.options.noise = type;
    this.noise = this.resolveNoiseGenerator(type);
    this.buildImpulse();
    console.debug(`[Reverb.js] Set IR generator source noise type to ${type}.`);
  }

  /**
   * Set the random number algorithm used for noise generation.
   *
   * @param algorithm - Random algorithm implementing {@link INorm}
   */
  public setRandomAlgorithm(algorithm: INorm): void {
    this.options.randomAlgorithm = algorithm;
    this.buildImpulse();
    console.debug('[Reverb.js] Set IR source noise generator.');
  }

  /**
   * Return true if in range, otherwise false.
   *
   * @param x - Target value
   * @param min - Minimum value
   * @param max - Maximum value
   */
  private static inRange(x: number, min: number, max: number): boolean {
    return x >= min && x <= max;
  }

  private assertRange(
    value: number,
    min: number,
    max: number,
    message: string,
  ): void {
    if (!Reverb.inRange(value, min, max)) {
      throw new RangeError(message);
    }
  }

  private resolveNoiseGenerator(type: NoiseType): NoiseGenerator {
    switch (type) {
      case 'blue':
        return this.noiseMap.blue;
      case 'brown':
        return this.noiseMap.brown;
      case 'green':
        return this.noiseMap.green;
      case 'pink':
        return this.noiseMap.pink;
      case 'red':
        return this.noiseMap.red;
      case 'violet':
        return this.noiseMap.violet;
      case 'white':
        return this.noiseMap.white;
      default:
        return white;
    }
  }

  /** Builds the impulse response buffer from the current options. */
  private buildImpulse(): void {
    const rate: number = this.ctx.sampleRate;
    const duration: number = Math.max(Math.floor(rate * this.options.time), 1);
    const delayDuration: number = Math.max(
      0,
      Math.floor(rate * this.options.delay),
    );
    const impulse: AudioBuffer = this.ctx.createBuffer(2, duration, rate);
    const impulseL: Float32Array = new Float32Array(duration);
    const impulseR: Float32Array = new Float32Array(duration);
    const sampleL = new Float32Array(1);
    const sampleR = new Float32Array(1);
    const noiseL: number[] = this.getNoise(duration);
    const noiseR: number[] = this.getNoise(duration);

    for (let index = 0; index < duration; index += 1) {
      let decayIndex: number;

      if (index < delayDuration) {
        sampleL[0] = 0;
        sampleR[0] = 0;
        impulseL.set(sampleL, index);
        impulseR.set(sampleR, index);
        decayIndex = this.options.reverse
          ? duration - (index - delayDuration)
          : index - delayDuration;
      } else {
        decayIndex = this.options.reverse ? duration - index : index;
      }

      const decayLevel = Math.max(0, 1 - decayIndex / duration);
      sampleL[0] = (noiseL.at(index) ?? 0) * decayLevel ** this.options.decay;
      sampleR[0] = (noiseR.at(index) ?? 0) * decayLevel ** this.options.decay;
      impulseL.set(sampleL, index);
      impulseR.set(sampleR, index);
    }

    impulse.getChannelData(0).set(impulseL);
    impulse.getChannelData(1).set(impulseR);
    this.convolverNode.buffer = impulse;
  }
}
