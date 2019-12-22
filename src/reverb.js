import Meta from './meta';
/**
 * JS reverb effect class
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 * @see       {@link https://github.com/logue/Reverb.js}
 *            {@link https://github.com/web-audio-components/simple-reverb}
 */
export default class Reverb {
  /**
   * constructor
   * @param {AudioContext} ctx
   * @param {{
   *   freq: (number|undefined),
   *   decay: (number|undefined),
   *   delay: (number|undefined),
   *   filterType: (string|undefined),
   *   mix: (number|undefined),
   *   reverse: (boolean|undefined),
   *   time: (number|undefined)
   * }} options
   */
  constructor(ctx, options = {}) {
    /** @type {number} バージョン */
    this.version = Meta.version;
    /** @type {Date} ビルド日時 */
    this.build = Meta.date;
    /** @type {AudioContext} */
    this.ctx = ctx;
    /** @type {GainNode} ウェットレベル */
    this.wetGainNode = this.ctx.createGain();
    /** @type {GainNode} ドライレベル */
    this.dryGainNode = this.ctx.createGain();
    /** @type {BiquadFilterNode} インパルス応答用フィルタ */
    this.filterNode = this.ctx.createBiquadFilter();
    /** @type {ConvolverNode} 畳み込みノード */
    this.convolverNode = this.ctx.createConvolver();
    /** @type {GainNode} 出力ノード */
    this.outputNode = this.ctx.createGain();

    // デフォルト値
    /** @type {number} 周波数*/
    this._freq = options.freq | 0 || 440;
    /** @type {number} ディケイ */
    this._decay = options.decay | 0 || 2;
    /** @type {number} ディレイ */
    this._delay = options.delay | 0 || 0;
    /** @type {BiquadFilterNode|null} フィルタの種類 */
    this._filterType = options.filterType || 'bandpass';
    /** @type {number} ドライ／ウェット比 */
    this._mix = options.mix || 0.5;
    /** @type {boolean} レスポンス応答を反転 */
    this._reverse = options.reverse || false;
    /** @type {number} レスポンス応答の時間（秒） */
    this._time = options.time | 0 || 3;

    // エフェクタに反映
    this.filterType(this._filterType);
    this.mix(this._mix);
    this.freq(this._freq);

    /** @type {bool} 接続済みフラグ */
    this.isConnected = false;

    this.buildImpulse();
  }

  /**
   * connect
   * @param {GainNode} sourceNode
   * @return {GainNode}
   */
  connect(sourceNode) {
    this.isConnected = true;
    // 畳み込みノードをウェットレベルに接続
    this.convolverNode.connect(this.wetGainNode);
    // フィルタノードをウェットレベルに接続
    this.filterNode.connect(this.wetGainNode);
    // 入力ノードを畳み込みノードに接続
    sourceNode.connect(this.convolverNode);
    // ドライレベルを出力ノードに接続
    sourceNode.connect(this.dryGainNode).connect(this.outputNode);
    // ウェットレベルを出力ノードに接続
    sourceNode.connect(this.wetGainNode).connect(this.outputNode);
    return this.outputNode;
  }

  /**
   * disconnect
   * @param {GainNode} sourceNode
   * @return {GainNode}
   */
  disconnect(sourceNode) {
    // 初期状態で接続されていない可能性があるためエラーを消す
    try {
      // 畳み込みノードをウェットレベルから切断
      this.convolverNode.disconnect(this.wetGainNode);
      // フィルタノードをウェットレベルから切断
      this.filterNode.disconnect(this.wetGainNode);
      // 入力ノードを畳み込みノードから切断
      sourceNode.disconnect(this.convolverNode);
      // ドライレベルを出力ノードから切断
      sourceNode.disconnect(this.dryGainNode).disconnect(this.outputNode);
      // ウェットレベルを出力ノードから切断
      sourceNode.disconnect(this.wetGainNode).disconnect(this.outputNode);
    } catch (e) { }
    this.isConnected = false;
    return sourceNode;
  }

  /**
   * Mixing Dry and Wet Level.
   * @param {number} mix
   */
  mix(mix) {
    console.info(`set dry/wet level to ${mix * 100}%`);
    this._mix = mix;
    this.dryGainNode.gain.value = (1 - this._mix);
    this.wetGainNode.gain.value = this._mix;
  }

  /**
   * Set Impulse Response length (second)
   * @param {number} value
   */
  time(value) {
    if (!(value > 1 || value < 50)) {
      console.warn('time must be less than 50.');
      return;
    }
    this._time = value;
    this.buildImpulse();
  }

  /**
   * Impulse response decay rate.
   * @param {number} value
   */
  decay(value) {
    if (!(value > 0 || value < 100)) {
      console.warn('decay level must be less than 100.');
      return;
    }
    this._decay = value;
    this.buildImpulse();
  }

  /**
   * Impulse response delay rate.
   * @param {number} value
   */
  delay(value) {
    if (!(value > 0 || value < 100)) {
      console.warn('delay level must be less than 100.');
      return;
    }
    this._delay = value;
    this.buildImpulse();
  }

  /**
   * Reverse the impulse response.
   * @param {boolean} reverse
   */
  reverse(reverse) {
    this._reverse = reverse;
    this.buildImpulse();
  }

  /**
   * Frequency.
   * @param {number} freq
   */
  freq(freq) {
    this._freq = freq;
    this.filterNode.frequency.setTargetAtTime(this._freq, this.ctx.currentTime, 0.015);
    console.info(`set frequency to ${freq}Hz.`);
  }

  /**
   * Filter Type.
   * @param {BiquadFilterNode|null} type
   */
  filterType(type) {
    console.info(`set filter type to ${type}`);
    this.filterNode.type = this._filterType = type;
  }

  /**
   * Utility function for building an impulse response
   * from the module parameters.
   * @private
   */
  buildImpulse() {
    // インパルス応答生成ロジック
    /** @type {number} サンプリングレート */
    const rate = this.ctx.sampleRate;
    /** @type {number} インパルス応答の演奏時間 */
    const length = Math.max(rate * this._time, 1);
    /** @type {number} インパルス応答が始まるまでの遅延時間 */
    const delayDuration = rate * this._delay;
    /** @type {AudioBuffer} インパルス応答バッファ */
    const impulse = this.ctx.createBuffer(2, length, rate);
    /** @type {Array<number>|ArrayBufferView} 左チャンネル */
    const impulseL = new Float32Array(length);
    /** @type {Array<number>|ArrayBufferView} 右チャンネル*/
    const impulseR = new Float32Array(length);

    for (let i = 0; i < length; i++) {
      /** @type {number} */
      let n = 0;

      /** @type {number} 平方根を利用して減衰 */
      const pow = Math.pow(1 - n / length, this._decay);
      // なお、インパルス応答の中身は単にノイズを入れているだけ
      impulseL[i] = (Math.random() * 2 - 1) * pow;
      impulseR[i] = (Math.random() * 2 - 1) * pow;

      if (i < delayDuration) {
        // Delay Effect
        impulseL[i] = 0;
        impulseR[i] = 0;
        n = this._reverse ? length - (i - delayDuration) : i - delayDuration;
      } else {
        n = this._reverse ? length - i : i;
      }
    }

    // インパルス応答のバッファを生成
    impulse.getChannelData(0).set(impulseL);
    impulse.getChannelData(1).set(impulseR);

    this.convolverNode.buffer = impulse;
    console.info(`Inpulse Response is updated.`);
  }
};
