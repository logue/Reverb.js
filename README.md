# Reverb.js

[![jsdelivr CDN](https://data.jsdelivr.com/v1/package/npm/@logue/reverb/badge?style=rounded)](https://www.jsdelivr.com/package/npm/@logue/reverb)
[![NPM Downloads](https://img.shields.io/npm/dm/@logue/reverb.svg?style=flat)](https://www.npmjs.com/package/@logue/reverb)
[![Open in unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/@logue/reverb/file/README.md)
[![npm version](https://img.shields.io/npm/v/@logue/reverb.svg)](https://www.npmjs.com/package/@logue/reverb)
[![Open in Gitpod](https://shields.io/badge/Open%20in-Gitpod-green?logo=Gitpod)](https://gitpod.io/#https://github.com/logue/Reverb.js)
[![Twitter Follow](https://img.shields.io/twitter/follow/logue256?style=plastic)](https://twitter.com/logue256)

Append reverb effect to audio source.

This script is originally a spin out of [sf2synth.js](https://github.com/logue/smfplayer.js)'s reverb effect.

## Sample

- <https://logue.dev/Reverb.js/>
- <https://logue.dev/Reverb.js/localaudio.html>

## Syntax

```js
const reverb = new Reverb(ctx, {
  /**
   * Randam noise algorythm
   * @see {@link https://github.com/thi-ng/umbrella/tree/develop/packages/random}
   */
  randomAlgorithm: SYSTEM;
  /**
   * IR (Inpulse Response) colord noise algorithm (BLUE, GREEN, PINK, RED, VIOLET, WHITE)
   * @see {@link https://github.com/thi-ng/umbrella/tree/develop/packages/colored-noise}
   */
  noise: Noise.WHITE,
  /** IR source noise scale */
  scale: 1;
  /** Number of IR source noise peaks */
  peaks: 2;
  /** Amount of IR decay. 0~100 */
  decay: 5,
  /** Delay time o IR. (NOT delay effect) 0~100 [sec] */
  delay: 0,
  /** Filter frequency. 20~5000 [Hz] */
  filterFreq: 2200,
  /** Filter Q. 0~10 */
  filterQ: 1,
  /**
   * Filter type. 'bandpass' etc.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type}
   */
  filterType: 'lowpass',
  /** Dry (Original Sound) and Wet (Effected sound) raito. 0~1 */
  mix: 0.5,
  /** Reverse IR. */
  reverse: false,
  /** Time length of IR. 0~50 [sec] */
  time: 3,
});
```

## Usage

```js
// Setup Audio Context
const ctx = new window.AudioContext();

// iOS fix.
document.addEventListener('touchstart', initAudioContext);
function initAudioContext() {
  document.removeEventListener('touchstart', initAudioContext);
  // wake up AudioContext
  const emptySource = ctx.createBufferSource();
  emptySource.start();
  emptySource.stop();
}

// Setup Reverb Class
const reverb = new Reverb(ctx, {});

// put Audio data to audio buffer source
const sourceNode = ctx.createBufferSource();
sourceNode.buffer = [AudioBuffer];

// Connect Reverb
reverb.connect(sourceNode);
sourceNode.connect(ctx.destination);

// fire
sourceNode.play();
```

## Reference

- [Web Audio API](https://www.w3.org/TR/webaudio/)
  - [Web Audio API 日本語訳](https://g200kg.github.io/web-audio-api-ja/)
- [コンボルバーの使い方](https://www.g200kg.com/jp/docs/webaudio/convolver.html)
- [WebAudio の闇](https://qiita.com/zprodev/items/7fcd8335d7e8e613a01f)
- [@thi.ng/colored-noise](https://github.com/thi-ng/umbrella/tree/develop/packages/colored-noise)

## License

[MIT](LICENSE)
