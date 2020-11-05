import Meta from './Meta';
import OptionInterface from './interfaces/OptionInterface';

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
  public readonly version: string;
  /** @type {string} ビルド日時 */
  public readonly build: string;
  /** @type {AudioContext} AudioContext */
  private readonly ctx: AudioContext;
  /** @type {GainNode} ウェットレベル（エフェクターをかけたレベル） */
  private readonly wetGainNode: GainNode;
  /** @type {GainNode} ドライレベル（原音レベル） */
  private readonly dryGainNode: GainNode;
  /** @type {BiquadFilterNode} インパルス応答用フィルタ */
  private readonly filterNode: BiquadFilterNode;
  /** @type {ConvolverNode} 畳み込みノード */
  private readonly convolverNode: ConvolverNode;
  /** @type {GainNode} 出力ノード */
  private readonly outputNode: GainNode;
  /** @type {Option} 変数 */
  private readonly _options: OptionInterface;
  /** @type {boolean} 接続済みフラグ */
  private isConnected: boolean;

  /**
   * constructor
   * @param {AudioContext} ctx Root AudioContext
   * @param {OptionInterface} options Configure
   */
  constructor(ctx: AudioContext, options: OptionInterface | undefined) {
    // バージョン情報など
    this.version = Meta.version;
    this.build = Meta.date;
    // マスターのAudioContextを取得
    this.ctx = ctx;
    // デフォルト値をマージ
    this._options = {...optionDefaults, ...options} as const;
    // 初期化
    this.wetGainNode = this.ctx.createGain();
    this.dryGainNode = this.ctx.createGain();
    this.filterNode = this.ctx.createBiquadFilter();
    this.convolverNode = this.ctx.createConvolver();
    this.outputNode = this.ctx.createGain();
    // 接続済みフラグを落とす
    this.isConnected = false;
    // インパルス応答を生成
    this.buildImpulse();
  }

  /**
   * connect
   * @param {AudioNode} sourceNode 原音ノード
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
   * @param {AudioNode} sourceNode 原音のノード
   * @return {AudioNode}
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
   * @param {number} mix
   */
  public mix(mix: number) {
    if (!this.inRange(mix, 0, 1)) {
      throw new RangeError('Reverb.js: Dry/Wet ratio must be between 0 to 1.');
    }
    this._options.mix = mix;
    this.dryGainNode.gain.value = 1 - this._options.mix;
    this.wetGainNode.gain.value = this._options.mix;
    console.debug(`Reverb.js: Set dry/wet ratio to ${mix * 100}%`);
  }

  /**
   * Set Impulse Response time length (second)
   * @param {number} value
   */
  public time(value: number) {
    if (!this.inRange(value, 1, 50)) {
      throw new RangeError(
        'Reverb.js: Time length of inpulse response must be less than 50sec.'
      );
    }
    this._options.time = value;
    this.buildImpulse();
    console.info(`Reverb.js: Set inpulse response time length to ${value}sec.`);
  }

  /**
   * Impulse response decay rate.
   * @param {number} value
   */
  public decay(value: number) {
    if (!this.inRange(value, 0, 100)) {
      throw new RangeError(
        'Reverb.js: Inpulse Response decay level must be less than 100.'
      );
    }
    this._options.decay = value;
    this.buildImpulse();
    console.debug(`Reverb.js: Set inpulse response decay level to ${value}.`);
  }

  /**
   * Impulse response delay time. (NOT deley effect)
   * @param {number} value
   */
  public delay(value: number) {
    if (!this.inRange(value, 0, 100)) {
      throw new RangeError(
        'Reverb.js: Inpulse Response delay time must be less than 100.'
      );
    }
    this._options.delay = value;
    this.buildImpulse();
    console.debug(`Reverb.js: Set inpulse response delay time to ${value}sec.`);
  }

  /**
   * Reverse the impulse response.
   * @param {boolean} reverse
   */
  public reverse(reverse: boolean) {
    this._options.reverse = reverse;
    this.buildImpulse();
    console.debug(
      `Reverb.js: Inpulse response is ${reverse ? '' : 'not '}reversed.`
    );
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
      throw new RangeError(
        'Reverb.js: Filter frequrncy must be between 20 and 5000.'
      );
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
      throw new RangeError(
        'Reverb.js: Filter quality value must be between 0 and 10.'
      );
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
      /** @type {number} 減衰率 */
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

/**
 * デフォルト値
 */
const optionDefaults: OptionInterface = {
  decay: 5,
  delay: 0,
  reverse: false,
  time: 3,
  filterType: 'lowpass',
  filterFreq: 2200,
  filterQ: 1,
  mix: 0.5,
};
