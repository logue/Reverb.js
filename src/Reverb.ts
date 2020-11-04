import Meta from './Meta';
import {Option, optionDefaults} from './OptionInterface';

/**
 * JS reverb effect class
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019-2020 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 * @see       {@link https://github.com/logue/Reverb.js}
 *            {@link https://github.com/web-audio-components/simple-reverb}
 */
export default class Reverb {
  /** @type {string} バージョン */
  public version: string;
  /** @type {Date} ビルド日時 */
  public build: Date;
  /** @type {AudioContext} AudioContext */
  public ctx: AudioContext;
  /** @type {GainNode} ウェットレベル */
  public wetGainNode: GainNode;
  /** @type {GainNode} ドライレベル */
  public dryGainNode: GainNode;
  /** @type {BiquadFilterNode} インパルス応答用フィルタ */
  public filterNode: BiquadFilterNode;
  /** @type {ConvolverNode} 畳み込みノード */
  public convolverNode: ConvolverNode;
  /** @type {GainNode} 出力ノード */
  public outputNode: GainNode;
  /** @type {Option} 変数 */
  private _options: Option;
  /** @type {boolean} 接続済みフラグ */
  public isConnected: boolean;

  /**
   * constructor
   * @param {AudioContext} ctx
   * @param {Option} options
   */
  constructor(ctx: AudioContext, options: Option) {
    // バージョン情報など
    this.version = Meta.version;
    this.build = new Date(Meta.date);
    // デフォルト値をマージ
    this.ctx = ctx;
    this._options = {...optionDefaults, ...options};
    // 初期化
    this.wetGainNode = this.ctx.createGain();
    this.dryGainNode = this.ctx.createGain();
    this.filterNode = this.ctx.createBiquadFilter();
    this.convolverNode = this.ctx.createConvolver();
    this.outputNode = this.ctx.createGain();
    this.isConnected = false;
    // インパルス応答を生成
    this.buildImpulse();
  }

  /**
   * connect
   * @param {AudioNode} sourceNode
   * @return {AudioNode}
   */
  public connect(sourceNode: AudioNode): AudioNode {
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
   * disconnect
   * @param {AudioNode} sourceNode
   * @return {AudioNode}
   */
  public disconnect(sourceNode: AudioNode): AudioNode {
    if (this.isConnected) {
      // 畳み込みノードをウェットレベルから切断
      this.convolverNode.disconnect(this.filterNode);
      // フィルタノードをウェットレベルから切断
      this.filterNode.disconnect(this.wetGainNode);
    }
    // 接続済みフラグを解除
    this.isConnected = false;

    return sourceNode;
  }

  /**
   * Mixing Dry and Wet Level.
   * @param {number} mix
   */
  public mix(mix: number) {
    if (!this.inRange(mix, 0, 1)) {
      console.warn('Dry/Wet level must be between 0 to 1.');
      return;
    }
    this._options.mix = mix;
    this.dryGainNode.gain.value = 1 - this._options.mix;
    this.wetGainNode.gain.value = this._options.mix;
    console.debug(`Set dry/wet level to ${mix * 100}%`);
  }

  /**
   * Set Impulse Response time length (second)
   * @param {number} value
   */
  public time(value: number) {
    if (!this.inRange(value, 1, 50)) {
      console.warn('Time length of inpulse response must be less than 50sec.');
      return;
    }
    this._options.time = value;
    this.buildImpulse();
    console.info(`Set inpulse response time length to ${value}sec.`);
  }

  /**
   * Impulse response decay rate.
   * @param {number} value
   */
  public decay(value: number) {
    if (!this.inRange(value, 0, 100)) {
      console.warn('Inpulse Response decay level must be less than 100.');
      return;
    }
    this._options.decay = value;
    this.buildImpulse();
    console.debug(`Set inpulse response decay level to ${value}.`);
  }

  /**
   * Impulse response delay time. (NOT deley effect)
   * @param {number} value
   */
  public delay(value: number) {
    if (!this.inRange(value, 0, 100)) {
      console.warn('Inpulse Response delay time must be less than 100.');
      return;
    }
    this._options.delay = value;
    this.buildImpulse();
    console.debug(`Set inpulse response delay time to ${value}sec.`);
  }

  /**
   * Reverse the impulse response.
   * @param {boolean} reverse
   */
  public reverse(reverse: boolean) {
    this._options.reverse = reverse;
    this.buildImpulse();
    console.debug(`Inpulse response is ${reverse ? '' : 'not '}reversed.`);
  }

  /**
   * Filter type.
   * @param {BiquadFilterType} type
   */
  public filterType(type: BiquadFilterType) {
    this.filterNode.type = this._options.filterType = type;
    console.debug(`Set filter type to ${type}`);
  }

  /**
   * Filter frequency.
   * @param {number} freq
   */
  public filterFreq(freq: number) {
    if (!this.inRange(freq, 20, 5000)) {
      console.warn('Filter frequrncy must be between 20 and 5000.');
      return;
    }
    this._options.filterFreq = freq;
    this.filterNode.frequency.value = this._options.filterFreq;
    console.debug(`Set filter frequency to ${freq}Hz.`);
  }

  /**
   * Filter quality.
   * @param {number} q
   */
  public filterQ(q: number) {
    if (!this.inRange(q, 0, 10)) {
      console.warn('Filter quality value must be between 0 and 1.');
      return;
    }
    this._options.filterQ = q;
    this.filterNode.Q.value = this._options.filterQ;
    console.debug(`Set filter quality to ${q}.`);
  }

  /**
   * return true if in range, otherwise false
   * @private
   * @param {number} x Target value
   * @param {number} min Minimum value
   * @param {number} max Maximum value
   * @return {bool}
   */
  private inRange(x: number, min: number, max: number) {
    return (x - min) * (x - max) <= 0;
  }

  /**
   * Utility function for building an impulse response
   * from the module parameters.
   * @private
   */
  private buildImpulse() {
    // インパルス応答生成ロジック

    /** @type {number} サンプリングレート */
    const rate: number = this.ctx.sampleRate;
    /** @type {number} インパルス応答の演奏時間 */
    const length: number = Math.max(rate * this._options.time, 1);
    /** @type {number} インパルス応答が始まるまでの遅延時間 */
    const delayDuration: number = rate * this._options.delay;
    /** @type {AudioBuffer} インパルス応答バッファ（今の所ステレオのみ） */
    const impulse: AudioBuffer = this.ctx.createBuffer(2, length, rate);
    /** @type {Array<number>|ArrayBufferView} 左チャンネル */
    const impulseL: Float32Array = new Float32Array(length);
    /** @type {Array<number>|ArrayBufferView} 右チャンネル*/
    const impulseR: Float32Array = new Float32Array(length);

    for (let i = 0; i < length; i++) {
      /** @type {number} */
      let n = 0;

      if (i < delayDuration) {
        // Delay Effect
        impulseL[i] = 0;
        impulseR[i] = 0;
        n = this._options.reverse
          ? length - (i - delayDuration)
          : i - delayDuration;
      } else {
        n = this._options.reverse ? length - i : i;
      }

      /** @type {number} 平方根を利用した減衰曲線 */
      const pow: number = (1 - n / length) ** this._options.decay;
      impulseL[i] = this.getNoise(pow);
      impulseR[i] = this.getNoise(pow);
    }

    // インパルス応答のバッファに生成したWaveTableを代入
    impulse.getChannelData(0).set(impulseL);
    impulse.getChannelData(1).set(impulseR);

    this.convolverNode.buffer = impulse;
  }
  /**
   * Generate white noise
   * @param {number} rate Attenuation rate
   * @return {number}
   * @private
   */
  private getNoise(rate: number): number {
    // TODO: 他のカラードノイズを指定できるように
    return (Math.random() * 2 - 1) * rate;
  }
}
