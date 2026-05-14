import { white, type ColoredNoiseOpts } from '@thi.ng/colored-noise';
import { take } from '@thi.ng/transducers';

import type OptionInterface from '@/interfaces/OptionInterface';
import type { INorm } from '@thi.ng/random';

import Meta from '@/Meta';
import { NoiseType as NoiseTypeMap, type NoiseType } from '@/NoiseType';
import { defaults } from '@/interfaces/OptionInterface';

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
  /** Noise Generator */
  private noise: (
    _opts?: Partial<ColoredNoiseOpts>
  ) => Generator<number, void, unknown> = white;
  /**
   * Map of noise types to their respective generator functions.
   */
  private readonly noiseMap: Record<
    NoiseType,
    (opts?: Partial<ColoredNoiseOpts>) => Generator<number, void, unknown>
  > = NoiseTypeMap;

  /**
   * Constructor
   *
   * @param ctx - Root AudioContext
   * @param options - Configure
   */
  constructor(ctx: AudioContext, options: Partial<OptionInterface> = {}) {
    // Store the master AudioContext.
    this.ctx = ctx;
    // Keep shared defaults immutable across instances/tests.
    this.options = Object.assign({}, defaults, options);
    // Initialize audio nodes.
    this.wetGainNode = this.ctx.createGain();
    this.dryGainNode = this.ctx.createGain();
    this.filterNode = this.ctx.createBiquadFilter();
    this.convolverNode = this.ctx.createConvolver();
    this.outputNode = this.ctx.createGain();
    // Reset connected flag.
    this.isConnected = false;
    this.filterType(this.options.filterType);
    this.setNoise(this.options.noise);
    // Generate the impulse response.
    this.buildImpulse();
    // Set the initial dry/wet ratio.
    this.mix(this.options.mix);
  }

  /**
   * Connect the node for the reverb effect to the original sound node.
   *
   * @param sourceNode - Input source node
   */
  public connect(sourceNode: AudioNode): AudioNode {
    if (this.isConnected && this.options.once) {
      // Already connected: reset flag and return the output node as-is.
      this.isConnected = false;
      return this.outputNode;
    }
    // Connect convolver to filter node.
    this.convolverNode.connect(this.filterNode);
    // Connect filter node to wet gain.
    this.filterNode.connect(this.wetGainNode);
    // Connect source to convolver (wet path).
    sourceNode.connect(this.convolverNode);
    // Connect source to dry gain.
    sourceNode.connect(this.dryGainNode);
    // Connect source directly to wet gain.
    sourceNode.connect(this.wetGainNode);
    // Connect dry gain to output.
    this.dryGainNode.connect(this.outputNode);
    // Connect wet gain to output.
    this.wetGainNode.connect(this.outputNode);
    // Mark as connected.
    this.isConnected = true;

    return this.outputNode;
  }

  /**
   * Disconnect the reverb node
   *
   * @param sourceNode - Input source node
   */
  public disconnect(sourceNode?: AudioNode): AudioNode | undefined {
    // Nodes are not connected in the initial state; skip disconnect to avoid errors.
    if (this.isConnected) {
      // Disconnect convolver from filter node.
      this.convolverNode.disconnect(this.filterNode);
      // Disconnect filter node from wet gain.
      this.filterNode.disconnect(this.wetGainNode);
    }
    // Clear connected flag.
    this.isConnected = false;

    // Return the source node to mirror common Web Audio API patterns.
    return sourceNode;
  }

  /**
   * Dry/Wet ratio
   *
   * @param mix - Ratio (0~1)
   */
  public mix(mix: number): void {
    if (!Reverb.inRange(mix, 0, 1)) {
      throw new RangeError('[Reverb.js] Dry/Wet ratio must be between 0 to 1.');
    }
    this.options.mix = mix;
    this.dryGainNode.gain.value = 1 - mix;
    this.wetGainNode.gain.value = mix;
    console.debug(`[Reverb.js] Set dry/wet ratio to ${mix * 100}%`);
  }

  /**
   * Set Impulse Response time length (second)
   *
   * @param value - IR length
   */
  public time(value: number): void {
    if (!Reverb.inRange(value, 1, 50)) {
      throw new RangeError(
        '[Reverb.js] Time length of impulse response must be less than 50sec.'
      );
    }
    this.options.time = value;
    this.buildImpulse();
    console.debug(
      `[Reverb.js] Set impulse response time length to ${value}sec.`
    );
  }

  /**
   * Impulse response decay rate.
   *
   * @param value - Decay value
   */
  public decay(value: number): void {
    if (!Reverb.inRange(value, 0, 100)) {
      throw new RangeError(
        '[Reverb.js] Impulse Response decay level must be less than 100.'
      );
    }
    this.options.decay = value;
    this.buildImpulse();
    console.debug(`[Reverb.js] Set impulse response decay level to ${value}.`);
  }

  /**
   * Delay before reverberation starts
   *
   * @param value - Time[ms]
   */
  public delay(value: number): void {
    if (!Reverb.inRange(value, 0, 100)) {
      throw new RangeError(
        '[Reverb.js] Impulse Response delay time must be less than 100.'
      );
    }
    this.options.delay = value;
    this.buildImpulse();
    console.debug(
      `[Reverb.js] Set impulse response delay time to ${value}sec.`
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
      `[Reverb.js] Inpulse response is ${reverse ? '' : 'not '}reversed.`
    );
  }

  /**
   * Filter for impulse response
   *
   * @param type - Filiter Type
   */
  public filterType(type: BiquadFilterType = 'allpass'): void {
    this.filterNode.type = this.options.filterType = type;
    console.debug(`[Reverb.js] Set filter type to ${type}`);
  }

  /**
   * Filter frequency applied to impulse response
   *
   * @param freq - Frequency
   */
  public filterFreq(freq: number): void {
    if (!Reverb.inRange(freq, 20, 20000)) {
      throw new RangeError(
        '[Reverb.js] Filter frequrncy must be between 20 and 20000.'
      );
    }
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
    if (!Reverb.inRange(q, 0, 10)) {
      throw new RangeError(
        '[Reverb.js] Filter Q value must be between 0 and 10.'
      );
    }
    this.options.filterQ = q;
    this.filterNode.Q.value = this.options.filterQ;
    console.debug(`[Reverb.js] Set filter Q to ${q}.`);
  }

  /**
   * set IR source noise peaks
   *
   * @param p - Peaks
   */
  public peaks(p: number): void {
    this.options.peaks = p;
    this.buildImpulse();
    console.debug(`[Reverb.js] Set IR source noise peaks to ${p}.`);
  }

  /**
   * set IR source noise scale.
   *
   * @param s - Scale
   */
  public scale(s: number): void {
    this.options.scale = s;
    this.buildImpulse();
    console.debug(`[Reverb.js] Set IR source noise scale to ${s}.`);
  }

  /**
   * Noise source
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
        })
      ),
    ];
  }

  /**
   * Inpulse Response Noise algorithm.
   *
   * @param type - IR noise algorithm type.
   */
  public setNoise(type: NoiseType): void {
    this.options.noise = type;
    switch (type) {
      case 'blue':
        this.noise = this.noiseMap.blue;
        break;
      case 'brown':
        this.noise = this.noiseMap.brown;
        break;
      case 'green':
        this.noise = this.noiseMap.green;
        break;
      case 'pink':
        this.noise = this.noiseMap.pink;
        break;
      case 'red':
        this.noise = this.noiseMap.red;
        break;
      case 'violet':
        this.noise = this.noiseMap.violet;
        break;
      case 'white':
        this.noise = this.noiseMap.white;
        break;
      default:
        this.noise = white;
        break;
    }
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
    console.debug(`[Reverb.js] Set IR source noise generator.`);
  }

  /**
   * Return true if in range, otherwise false
   *
   * @param x - Target value
   * @param min - Minimum value
   * @param max - Maximum value
   */
  private static inRange(x: number, min: number, max: number): boolean {
    return x >= min && x <= max;
  }

  /** Builds the impulse response buffer from the current options. */
  private buildImpulse(): void {
    /** Sample rate of the AudioContext. */
    const rate: number = this.ctx.sampleRate;
    /** Total IR length in samples. */
    const duration: number = Math.max(rate * this.options.time, 1);
    /** Delay before IR onset, in samples. */
    const delayDuration: number = rate * this.options.delay;
    /** IR audio buffer (stereo). */
    const impulse: AudioBuffer = this.ctx.createBuffer(2, duration, rate);
    /** Left channel sample array. */
    const impulseL: Float32Array = new Float32Array(duration);
    /** Right channel sample array. */
    const impulseR: Float32Array = new Float32Array(duration);
    /** Temporary single-sample buffers used with Float32Array.set(). */
    const sampleL = new Float32Array(1);
    const sampleR = new Float32Array(1);
    /** Noise source for left channel. */
    const noiseL: number[] = this.getNoise(duration);
    /** Noise source for right channel. */
    const noiseR: number[] = this.getNoise(duration);

    for (let i = 0; i < duration; i++) {
      /** Decay position index (accounts for reverse and delay). */
      let n: number;

      if (i < delayDuration) {
        // Zero out samples within the delay period.
        sampleL[0] = 0;
        sampleR[0] = 0;
        impulseL.set(sampleL, i);
        impulseR.set(sampleR, i);
        n =
          (this.options.reverse ?? false)
            ? duration - (i - delayDuration)
            : i - delayDuration;
      } else {
        n = (this.options.reverse ?? false) ? duration - i : i;
      }
      // Apply exponential decay to the noise source over time.
      sampleL[0] =
        (noiseL.at(i) ?? 0) * (1 - n / duration) ** this.options.decay;
      sampleR[0] =
        (noiseR.at(i) ?? 0) * (1 - n / duration) ** this.options.decay;
      impulseL.set(sampleL, i);
      impulseR.set(sampleR, i);
    }

    // Write the generated wave table into the IR buffer.
    impulse.getChannelData(0).set(impulseL);
    impulse.getChannelData(1).set(impulseR);

    this.convolverNode.buffer = impulse;
  }
}
