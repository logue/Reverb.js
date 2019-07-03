/*! @logue/reverb v0.1.0 | Logue | license: MIT */
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

/***/ "./src/reverb.js":
/*!***********************!*\
  !*** ./src/reverb.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Reverb; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * JS reverb effect class
 *
 * @author    Logue
 * @copyright 2019 Logue <logue@hotmail.co.jp>
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

    /** @type {AudioContext} */
    this.ctx = ctx;
    /** @type {GainNode} */

    this.wetGainNode = this.ctx.createGain();
    /** @type {GainNode} */

    this.dryGainNode = this.ctx.createGain();
    /** @type {ConvolverNode} */

    this.node = this.ctx.createConvolver();
    /** @type {BiquadFilterNode} */

    this.filterNode = this.ctx.createBiquadFilter(); // デフォルト値

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

    this._time = options.time || 1; // エフェクタに反映

    this.mix(this._mix);
    this.filterType(this._filterType);
    this.freq(this._freq); // インパルス応答を生成

    this.buildImpulse(); // エフェクトのかかり方の接続

    this.node.connect(this.dryGainNode);
    this.node.connect(this.wetGainNode); // エフェクトを接続

    this.node.connect(this.filterNode);
    this.dryGainNode.connect(this.node);
    this.wetGainNode.connect(this.node); // フィルタを接続

    this.filterNode.connect(this.node);
  }

  _createClass(Reverb, [{
    key: "mix",

    /** @param {number} mix */
    value: function mix(_mix) {
      this._mix = _mix;
      this.dryGainNode.gain.setTargetAtTime(this.getDryLevel(_mix) / 127, this.ctx.currentTime, 0.015);
      this.wetGainNode.gain.setTargetAtTime(this.getWetLevel(_mix) / 127, this.ctx.currentTime, 0.015);
    }
    /** @param {number} time */

  }, {
    key: "time",
    value: function time(_time) {
      this._time = _time;
      this.buildImpulse();
    }
    /**
     * Impulse response decay rate.
     * @param {number} decay
     */

  }, {
    key: "decay",
    value: function decay(_decay) {
      this._decay = _decay;
      this.buildImpulse();
    }
    /**
     * Impulse response delay rate.
     * @param {number} delay
     */

  }, {
    key: "delay",
    value: function delay(_delay) {
      this._delay = _delay;
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
    }
    /**
     * Filter Type.
     * @param {BiquadFilterNode|null} type
     */

  }, {
    key: "filterType",
    value: function filterType(type) {
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
      /** @type {number} */
      var rate = this.ctx.sampleRate;
      /** @type {number} */

      var length = Math.max(rate * this._time, 1);
      /** @type {number} */

      var delayDuration = rate * this._delay;
      /** @type {AudioBuffer} */

      var impulse = this.ctx.createBuffer(2, length, rate);
      /** @type {Array<number>|ArrayBufferView} */

      var impulseL = new Float32Array(length);
      /** @type {Array<number>|ArrayBufferView} */

      var impulseR = new Float32Array(length);

      for (var i = 0; i < length; i++) {
        /** @var {number} */
        var n = 0;
        /** @var {number} */

        var pow = 0;

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
      } // Generate stereo inpulse response data.


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

  }, {
    key: "getDryLevel",
    value: function getDryLevel(value) {
      if (value > 1 || value < 0) {
        return 0;
      }

      if (value <= 0.5) {
        return 1;
      }

      return 1 - (value - 0.5) * 2;
    }
    /**
     * Set Wet level.
     * @param {number} value
     * @return {number}
     * @private
     */

  }, {
    key: "getWetLevel",
    value: function getWetLevel(value) {
      if (value > 1 || value < 0) {
        return 0;
      }

      if (value >= 0.5) {
        return 1;
      }

      return 1 - (value - 0.5) * 2;
    }
  }]);

  return Reverb;
}();


;

/***/ })

/******/ });
});
//# sourceMappingURL=reverb.js.map