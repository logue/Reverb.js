(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Reverb", [], factory);
	else if(typeof exports === 'object')
		exports["Reverb"] = factory();
	else
		root["Reverb"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/reverb.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/meta.js":
/*!*********************!*\
  !*** ./src/meta.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// This file is auto-generated by the build system.
var Meta = {
  version: '0.2.0',
  date: '2019-12-22T15:29:41.879Z'
};
/* harmony default export */ __webpack_exports__["default"] = (Meta);

/***/ }),

/***/ "./src/reverb.js":
/*!***********************!*\
  !*** ./src/reverb.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Reverb; });
/* harmony import */ var _meta__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./meta */ "./src/meta.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


/**
 * JS reverb effect class
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 * @see       {@link https://github.com/logue/Reverb.js}
 *            {@link https://github.com/web-audio-components/simple-reverb}
 */

var Reverb =
/*#__PURE__*/
function () {
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
  function Reverb(ctx) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Reverb);

    /** @type {number} バージョン */
    this.version = _meta__WEBPACK_IMPORTED_MODULE_0__["default"].version;
    /** @type {Date} ビルド日時 */

    this.build = _meta__WEBPACK_IMPORTED_MODULE_0__["default"].date;
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

    this.outputNode = this.ctx.createGain(); // デフォルト値

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

    this._time = options.time | 0 || 3; // エフェクタに反映

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


  _createClass(Reverb, [{
    key: "connect",
    value: function connect(sourceNode) {
      this.isConnected = true; // 畳み込みノードをウェットレベルに接続

      this.convolverNode.connect(this.wetGainNode); // フィルタノードをウェットレベルに接続

      this.filterNode.connect(this.wetGainNode); // 入力ノードを畳み込みノードに接続

      sourceNode.connect(this.convolverNode); // ドライレベルを出力ノードに接続

      sourceNode.connect(this.dryGainNode).connect(this.outputNode); // ウェットレベルを出力ノードに接続

      sourceNode.connect(this.wetGainNode).connect(this.outputNode);
      return this.outputNode;
    }
    /**
     * disconnect
     * @param {GainNode} sourceNode
     * @return {GainNode}
     */

  }, {
    key: "disconnect",
    value: function disconnect(sourceNode) {
      // 初期状態で接続されていない可能性があるためエラーを消す
      try {
        // 畳み込みノードをウェットレベルから切断
        this.convolverNode.disconnect(this.wetGainNode); // フィルタノードをウェットレベルから切断

        this.filterNode.disconnect(this.wetGainNode); // 入力ノードを畳み込みノードから切断

        sourceNode.disconnect(this.convolverNode); // ドライレベルを出力ノードから切断

        sourceNode.disconnect(this.dryGainNode).disconnect(this.outputNode); // ウェットレベルを出力ノードから切断

        sourceNode.disconnect(this.wetGainNode).disconnect(this.outputNode);
      } catch (e) {}

      this.isConnected = false;
      return sourceNode;
    }
    /**
     * Mixing Dry and Wet Level.
     * @param {number} mix
     */

  }, {
    key: "mix",
    value: function mix(_mix) {
      console.info("set dry/wet level to ".concat(_mix * 100, "%"));
      this._mix = _mix;
      this.dryGainNode.gain.value = 1 - this._mix;
      this.wetGainNode.gain.value = this._mix;
    }
    /**
     * Set Impulse Response length (second)
     * @param {number} value
     */

  }, {
    key: "time",
    value: function time(value) {
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

  }, {
    key: "decay",
    value: function decay(value) {
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

  }, {
    key: "delay",
    value: function delay(value) {
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

  }, {
    key: "reverse",
    value: function reverse(_reverse) {
      this._reverse = _reverse;
      this.buildImpulse();
    }
    /**
     * Frequency.
     * @param {number} freq
     */

  }, {
    key: "freq",
    value: function freq(_freq) {
      this._freq = _freq;
      this.filterNode.frequency.setTargetAtTime(this._freq, this.ctx.currentTime, 0.015);
      console.info("set frequency to ".concat(_freq, "Hz."));
    }
    /**
     * Filter Type.
     * @param {BiquadFilterNode|null} type
     */

  }, {
    key: "filterType",
    value: function filterType(type) {
      console.info("set filter type to ".concat(type));
      this.filterNode.type = this._filterType = type;
    }
    /**
     * Utility function for building an impulse response
     * from the module parameters.
     * @private
     */

  }, {
    key: "buildImpulse",
    value: function buildImpulse() {
      // インパルス応答生成ロジック

      /** @type {number} サンプリングレート */
      var rate = this.ctx.sampleRate;
      /** @type {number} インパルス応答の演奏時間 */

      var length = Math.max(rate * this._time, 1);
      /** @type {number} インパルス応答が始まるまでの遅延時間 */

      var delayDuration = rate * this._delay;
      /** @type {AudioBuffer} インパルス応答バッファ */

      var impulse = this.ctx.createBuffer(2, length, rate);
      /** @type {Array<number>|ArrayBufferView} 左チャンネル */

      var impulseL = new Float32Array(length);
      /** @type {Array<number>|ArrayBufferView} 右チャンネル*/

      var impulseR = new Float32Array(length);

      for (var i = 0; i < length; i++) {
        /** @type {number} */
        var n = 0;
        /** @type {number} 平方根を利用して減衰 */

        var pow = Math.pow(1 - n / length, this._decay); // なお、インパルス応答の中身は単にノイズを入れているだけ

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
      } // インパルス応答のバッファを生成


      impulse.getChannelData(0).set(impulseL);
      impulse.getChannelData(1).set(impulseR);
      this.convolverNode.buffer = impulse;
      console.info("Inpulse Response is updated.");
    }
  }]);

  return Reverb;
}();


;

/***/ })

/******/ });
});
//# sourceMappingURL=reverb.js.map