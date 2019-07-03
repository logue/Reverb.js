/**
 * JS reverb effect class
 *
 * @author    Logue
 * @copyright 2019 Logue <logue@hotmail.co.jp>
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
    /** @type {AudioContext} */
    this.ctx = ctx;
    /** @type {GainNode} */
    this.wetGainNode = this.ctx.createGain();
    /** @type {GainNode} */
    this.dryGainNode = this.ctx.createGain();
    /** @type {ConvolverNode} */
    this.node = this.ctx.createConvolver();
    /** @type {BiquadFilterNode} */
    this.filterNode = this.ctx.createBiquadFilter();

    // デフォルト値
    /** @type {number} */
    this._freq = options.freq || 440;
    /** @type {number} */
    this._decay = options.decay || 1;
    /** @type {number} */
    this._delay = options.delay || 0.5;
    /** @type {BiquadFilterNode|null} */
    this._filterType = options.filterType || 'bandpass';
    /** @type {number} */
    this._mix = options.mix || 0.5;
    /** @type {boolean} */
    this._reverse = options.reverse || false;
    /** @type {number} */
    this._time = options.time || 1;

    // エフェクタに反映
    this.mix(this._mix);
    this.filterType(this._filterType);
    this.freq(this._freq);
    // インパルス応答を生成
    this.buildImpulse();

    // エフェクトのかかり方の接続
    this.node.connect(this.dryGainNode);
    this.node.connect(this.wetGainNode);
    // エフェクトを接続
    this.node.connect(this.filterNode);
    this.dryGainNode.connect(this.node);
    this.wetGainNode.connect(this.node);
    // フィルタを接続
    this.filterNode.connect(this.node);
  };

  /** @param {number} mix */
  mix(mix) {
    this._mix = mix;
    this.dryGainNode.gain.setTargetAtTime(this.getDryLevel(mix) / 127, this.ctx.currentTime, 0.015);
    this.wetGainNode.gain.setTargetAtTime(this.getWetLevel(mix) / 127, this.ctx.currentTime, 0.015);
  }

  /** @param {number} time */
  time(time) {
    this._time = time;
    this.buildImpulse();
  }

  /**
   * Impulse response decay rate.
   * @param {number} decay
   */
  decay(decay) {
    this._decay = decay;
    this.buildImpulse();
  }

  /**
   * Impulse response delay rate.
   * @param {number} delay
   */
  delay(delay) {
    this._delay = delay;
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
  }

  /**
   * Filter Type.
   * @param {BiquadFilterNode|null} type
   */
  filterType(type) {
    this.filterNode.type = this._filterType = type;
  }

  /**
   * Utility function for building an impulse response
   * from the module parameters.
   * @private
   */
  buildImpulse() {
    /** @type {number} */
    const rate = this.ctx.sampleRate;
    /** @type {number} */
    const length = Math.max(rate * this._time, 1);
    /** @type {number} */
    const delayDuration = rate * this._delay;
    /** @type {AudioBuffer} */
    const impulse = this.ctx.createBuffer(2, length, rate);
    /** @type {Array<number>|ArrayBufferView} */
    const impulseL = new Float32Array(length);
    /** @type {Array<number>|ArrayBufferView} */
    const impulseR = new Float32Array(length);

    for (let i = 0; i < length; i++) {
      /** @var {number} */
      let n = 0;
      /** @var {number} */
      let pow = 0;
      if (i < delayDuration) {
        // Delay Effect
        impulseL[i] = 0;
        impulseR[i] = 0;
        n = this._reverse ? length - (i - delayDuration) : i - delayDuration;
      } else {
        n = this._reverse ? length - i : i;
      }
      pow = Math.pow(1 - n / length, this._decay);
      impulseL[i] = (Math.random() * 2 - 1) * pow;
      impulseR[i] = (Math.random() * 2 - 1) * pow;
    }

    // Generate stereo inpulse response data.
    impulse.getChannelData(0).set(impulseL);
    impulse.getChannelData(1).set(impulseR);

    this.node.buffer = impulse;
  }

  /**
   * Set Dry level.
   * @param {number} value
   * @return {number}
   * @private
   */
  getDryLevel(value) {
    if (value > 1 || value < 0) {
      return 0;
    }

    if (value <= 0.5) {
      return 1;
    }

    return 1 - ((value - 0.5) * 2);
  }

  /**
   * Set Wet level.
   * @param {number} value
   * @return {number}
   * @private
   */
  getWetLevel(value) {
    if (value > 1 || value < 0) {
      return 0;
    }

    if (value >= 0.5) {
      return 1;
    }

    return 1 - ((value - 0.5) * 2);
  }
};
