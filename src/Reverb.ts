import Meta from './Meta';
import type OptionInterface from './interfaces/OptionInterface';
import Noise, { type NoiseType } from './NoiseType';
import { take } from '@thi.ng/transducers';
import { blue, green, pink, red, violet, white } from '@thi.ng/colored-noise';

/**
 * Reverb effect class
 */
export default class Reverb {
  /** Version strings */
  static version: string = Meta.version;
  /** Build date */
  static build: string = Meta.date;
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
  /** Output nodse */
  private readonly outputNode: GainNode;
  /** Option */
  private readonly options: OptionInterface;
  /** Connected flag */
  private isConnected: boolean;
  /** Noise Generator */
  private noise: Function = white;

  /**
   * Constructor
   *
   * @param ctx - Root AudioContext
   * @param options - Configure
   */
  constructor(ctx: AudioContext, options?: OptionInterface) {
    // マスターのAudioContextを取得
    this.ctx = ctx;
    // デフォルト値をマージ
    this.options = { ...optionDefaults, ...options };
    // 初期化
    this.wetGainNode = this.ctx.createGain();
    this.dryGainNode = this.ctx.createGain();
    this.filterNode = this.ctx.createBiquadFilter();
    this.convolverNode = this.ctx.createConvolver();
    this.outputNode = this.ctx.createGain();
    // 接続済みフラグを落とす
    this.isConnected = false;
    this.setNoise(this.options.noise);
    // インパルス応答を生成
    this.buildImpulse();
    // トライ／ウェットノードの量を調整
    this.mix(this.options.mix);
  }

  /**
   * Connect the node for the reverb effect to the original sound node.
   *
   * @param sourceNode - Input source node
   */
  public connect(sourceNode: AudioNode): AudioNode {
    if (this.isConnected && this.options.once) {
      // 接続済みだった場合、フラグを落としてそのまま出力ノードを返す
      this.isConnected = false;
      return this.outputNode;
    }
    // 畳み込みノードをウェットレベルに接続
    this.convolverNode.connect(this.filterNode);
    // フィルタノードをウェットレベルに接続
    this.filterNode.connect(this.wetGainNode);
    // 入力ノードを畳み込みノードに接続
    sourceNode.connect(this.convolverNode);
    // ドライレベルを出力ノードに接続
    sourceNode.connect(this.dryGainNode).connect(this.outputNode);
    // ウェットレベルを出力ノードに接続
    sourceNode.connect(this.wetGainNode).connect(this.outputNode);
    // 接続済みフラグを立てる
    this.isConnected = true;

    return this.outputNode;
  }

  /**
   * Disconnect the reverb node
   *
   * @param sourceNode - Input source node
   */
  public disconnect(sourceNode: AudioNode | undefined): AudioNode | undefined {
    // 初期状態ではノードがつながっていないためエラーになる
    if (this.isConnected) {
      // 畳み込みノードをウェットレベルから切断
      this.convolverNode.disconnect(this.filterNode);
      // フィルタノードをウェットレベルから切断
      this.filterNode.disconnect(this.wetGainNode);
    }
    // 接続済みフラグを解除
    this.isConnected = false;

    // そのままノードを返す（他のAPIに似せるため）
    return sourceNode;
  }

  /**
   * Dry/Wet ratio
   *
   * @param mix - Ratio (0~1)
   */
  public mix(mix: number): void {
    if (!this.inRange(mix, 0, 1)) {
      throw new RangeError('[Reverb.js] Dry/Wet ratio must be between 0 to 1.');
    }
    this.options.mix = mix;
    this.dryGainNode.gain.value = 1 - this.options.mix;
    this.wetGainNode.gain.value = this.options.mix;
    console.debug(`[Reverb.js] Set dry/wet ratio to ${mix * 100}%`);
  }

  /**
   * Set Impulse Response time length (second)
   *
   * @param value - IR length
   */
  public time(value: number): void {
    if (!this.inRange(value, 1, 50)) {
      throw new RangeError(
        '[Reverb.js] Time length of inpulse response must be less than 50sec.'
      );
    }
    this.options.time = value;
    this.buildImpulse();
    console.debug(
      `[Reverb.js] Set inpulse response time length to ${value}sec.`
    );
  }

  /**
   * Impulse response decay rate.
   *
   * @param value - Decay value
   */
  public decay(value: number): void {
    if (!this.inRange(value, 0, 100)) {
      throw new RangeError(
        '[Reverb.js] Inpulse Response decay level must be less than 100.'
      );
    }
    this.options.decay = value;
    this.buildImpulse();
    console.debug(`[Reverb.js] Set inpulse response decay level to ${value}.`);
  }

  /**
   * Delay before reverberation starts
   *
   * @param value - Time[ms]
   */
  public delay(value: number): void {
    if (!this.inRange(value, 0, 100)) {
      throw new RangeError(
        '[Reverb.js] Inpulse Response delay time must be less than 100.'
      );
    }
    this.options.delay = value;
    this.buildImpulse();
    console.debug(
      `[Reverb.js] Set inpulse response delay time to ${value}sec.`
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
  public filterType(type: BiquadFilterType): void {
    this.filterNode.type = this.options.filterType = type;
    console.debug(`[Reverb.js] Set filter type to ${type}`);
  }

  /**
   * Filter frequency applied to impulse response
   *
   * @param freq - Frequency
   */
  public filterFreq(freq: number): void {
    if (!this.inRange(freq, 20, 20000)) {
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
    if (!this.inRange(q, 0, 10)) {
      throw new RangeError(
        '[Reverb.js] Filter quality value must be between 0 and 10.'
      );
    }
    this.options.filterQ = q;
    this.filterNode.Q.value = this.options.filterQ;
    console.debug(`[Reverb.js] Set filter Q to ${q}.`);
  }

  /**
   * set IR noise power multiplier.
   *
   * @param p - Power
   */
  public power(p: number): void {
    this.options.power = p;
    this.buildImpulse();
    console.debug(`[Reverb.js] Set IR power multiplier to ${p}.`);
  }

  /**
   * Inpulse Response Noise algorithm.
   *
   * @param type - IR noise algorithm type.
   */
  public setNoise(type: NoiseType) {
    this.options.noise = type;
    switch (type) {
      case Noise.BLUE:
        this.noise = blue;
        break;
      case Noise.GREEN:
        this.noise = green;
        break;
      case Noise.PINK:
        this.noise = pink;
        break;
      case Noise.RED:
      case Noise.BROWN:
        this.noise = red;
        break;
      case Noise.VIOLET:
        this.noise = violet;
        break;
      default:
        this.noise = white;
        break;
    }
    this.buildImpulse();
    console.debug(`[Reverb.js] Set IR generator source noise type to ${type}.`);
  }

  /**
   * Return true if in range, otherwise false
   *
   * @param x - Target value
   * @param min - Minimum value
   * @param max - Maximum value
   */
  private inRange(x: number, min: number, max: number): boolean {
    return (x - min) * (x - max) <= 0;
  }

  /** Utility function for building an impulse response from the module parameters. */
  private buildImpulse(): void {
    // インパルス応答生成ロジック

    /** サンプリングレート */
    const rate: number = this.ctx.sampleRate;
    /** インパルス応答の演奏時間 */
    const duration: number = Math.max(rate * this.options.time, 1);
    /** インパルス応答が始まるまでの遅延時間 */
    const delayDuration: number = rate * this.options.delay;
    /** インパルス応答バッファ（今の所ステレオのみ） */
    const impulse: AudioBuffer = this.ctx.createBuffer(2, duration, rate);
    /** 左チャンネル */
    const impulseL: Float32Array = new Float32Array(duration);
    /** 右チャンネル */
    const impulseR: Float32Array = new Float32Array(duration);
    /** 左チャンネルのオーディオソース */
    const noiseL: number[] = this.getNoise(duration);
    /** 右チャンネルのオーディオソース */
    const noiseR: number[] = this.getNoise(duration);

    for (let i = 0; i < duration; i++) {
      /** 減衰率 */
      let n: number = 0;

      if (i < delayDuration) {
        // Delay Effect
        impulseL[i] = 0;
        impulseR[i] = 0;
        n = this.options.reverse
          ? duration - (i - delayDuration)
          : i - delayDuration;
      } else {
        n = this.options.reverse ? duration - i : i;
      }
      // 元の音（ノイズ）を時間経過とともに減衰させる
      impulseL[i] = noiseL[i] * (1 - n / duration) ** this.options.decay;
      impulseR[i] = noiseR[i] * (1 - n / duration) ** this.options.decay;
    }

    // インパルス応答のバッファに生成したWaveTableを代入
    impulse.getChannelData(0).set(impulseL);
    impulse.getChannelData(1).set(impulseR);

    this.convolverNode.buffer = impulse;
  }
  /**
   * Noise source
   *
   * @param duration - length of IR.
   */
  private getNoise(duration: number): number[] {
    return [...take<number>(duration, this.noise())].map(
      x => x * this.options.power
    );
  }
}

/** デフォルト値 */
const optionDefaults: OptionInterface = {
  noise: Noise.WHITE,
  power: 2,
  decay: 2,
  delay: 0,
  reverse: false,
  time: 2,
  filterType: 'lowpass',
  filterFreq: 2200,
  filterQ: 1,
  mix: 0.5,
  once: false,
};

export { Noise, type NoiseType, type OptionInterface };

// For CDN.
// @ts-ignore
if (!window.Reverb) {
  // @ts-ignore
  window.Reverb = Reverb;
}
