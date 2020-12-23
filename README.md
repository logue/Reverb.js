# Reverb.js

[![npm version](https://badge.fury.io/js/%40logue%2Freverb.svg)](https://badge.fury.io/js/%40logue%2Freverb)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

Append reverb effect to audio source.

This script is originally a spin out of [sf2synth.js](https://github.com/logue/smfplayer.js)'s reverb effect.


## Sample

* <https://logue.github.io/Reverb.js/>
* <https://logue.github.io/Reverb.js/localaudio.html>

## Syntax

```js
const reverb = new Reverb.default(ctx, {
  decay: 5,                 // Amount of IR (Inpulse Response) decay. 0~100
  delay: 0,                 // Delay time o IR. (NOT delay effect) 0~100 [sec] 
  filterFreq: 2200,         // Filter frequency. 20~5000 [Hz]
  filterQ: 1,               // Filter quality. 0~10
  filterType: 'lowpass',    // Filter type. 'bandpass' etc. See https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode/type .
  mix: 0.5,                 // Dry (Original Sound) and Wet (Effected sound) raito. 0~1
  reverse: false,           // Reverse IR.
  time: 3                   // Time length of IR. 0~50 [sec]
});
```

## Usage

```js
// Setup Audio Context
const ctx = new (window.AudioContext || window.webkitAudioContext)();

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
const reverb = new Reverb.default(ctx, {});

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

* [Web Audio API](https://www.w3.org/TR/webaudio/)
 * [Web Audio API日本語訳](https://g200kg.github.io/web-audio-api-ja/)
* [コンボルバーの使い方](https://www.g200kg.com/jp/docs/webaudio/convolver.html)
* [WebAudioの闇](https://qiita.com/zprodev/items/7fcd8335d7e8e613a01f)

## License

[MIT](LICENSE)