/*! @logue/reverb v0.3.0 | Logue | license: MIT | build: 2020-11-04T10:02:01.717Z */
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/reverb.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/OptionInterface.ts":
/*!********************************!*\
  !*** ./src/OptionInterface.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.optionDefaults = void 0;
/**
 * デフォルト値
 */
exports.optionDefaults = {
    decay: 5,
    delay: 0,
    reverse: false,
    time: 3,
    filterType: 'lowpass',
    filterFreq: 2200,
    filterQ: 1,
    mix: 0.5,
};


/***/ }),

/***/ "./src/meta.ts":
/*!*********************!*\
  !*** ./src/meta.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Meta = {
    // This file is auto-generated by the build system.
    version: '0.3.0',
    date: '2020-11-04T10:02:01.717Z',
};
exports.default = Meta;


/***/ }),

/***/ "./src/reverb.ts":
/*!***********************!*\
  !*** ./src/reverb.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const meta_1 = __webpack_require__(/*! ./meta */ "./src/meta.ts");
const OptionInterface_1 = __webpack_require__(/*! ./OptionInterface */ "./src/OptionInterface.ts");
/**
 * JS reverb effect class
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019-2020 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 * @see       {@link https://github.com/logue/Reverb.js}
 *            {@link https://github.com/web-audio-components/simple-reverb}
 */
class Reverb {
    /**
     * constructor
     * @param {AudioContext} ctx
     * @param {Option} options
     */
    constructor(ctx, options) {
        // バージョン情報など
        this.version = meta_1.default.version;
        this.build = new Date(meta_1.default.date);
        // デフォルト値をマージ
        this.ctx = ctx;
        this._options = { ...OptionInterface_1.optionDefaults, ...options };
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
    connect(sourceNode) {
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
    disconnect(sourceNode) {
        // 畳み込みノードをウェットレベルから切断
        this.convolverNode.disconnect(this.filterNode);
        // フィルタノードをウェットレベルから切断
        this.filterNode.disconnect(this.wetGainNode);
        // 入力ノードを畳み込みノードから切断
        sourceNode.disconnect(this.convolverNode);
        // 接続済みフラグを解除
        this.isConnected = false;
        return sourceNode;
    }
    /**
     * Mixing Dry and Wet Level.
     * @param {number} mix
     */
    mix(mix) {
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
    time(value) {
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
    decay(value) {
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
    delay(value) {
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
    reverse(reverse) {
        this._options.reverse = reverse;
        this.buildImpulse();
        console.debug(`Inpulse response is ${reverse ? '' : 'not '}reversed.`);
    }
    /**
     * Filter type.
     * @param {BiquadFilterType} type
     */
    filterType(type) {
        this.filterNode.type = this._options.filterType = type;
        console.debug(`Set filter type to ${type}`);
    }
    /**
     * Filter frequency.
     * @param {number} freq
     */
    filterFreq(freq) {
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
    filterQ(q) {
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
    inRange(x, min, max) {
        return (x - min) * (x - max) <= 0;
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
        const length = Math.max(rate * this._options.time, 1);
        /** @type {number} インパルス応答が始まるまでの遅延時間 */
        const delayDuration = rate * this._options.delay;
        /** @type {AudioBuffer} インパルス応答バッファ（今の所ステレオのみ） */
        const impulse = this.ctx.createBuffer(2, length, rate);
        /** @type {Array<number>|ArrayBufferView} 左チャンネル */
        const impulseL = new Float32Array(length);
        /** @type {Array<number>|ArrayBufferView} 右チャンネル*/
        const impulseR = new Float32Array(length);
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
            }
            else {
                n = this._options.reverse ? length - i : i;
            }
            /** @type {number} 平方根を利用した減衰曲線 */
            const pow = (1 - n / length) ** this._options.decay;
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
    getNoise(rate) {
        // TODO: 他のカラードノイズを指定できるように
        return (Math.random() * 2 - 1) * rate;
    }
}
exports.default = Reverb;


/***/ })

/******/ });
});
//# sourceMappingURL=reverb.js.map