# Reverb.js

Append reverb effect to audio source.

This script is originally a spin out of [sf2synth.js](https://github.com/logue/smfplayer.js)'s reverb effect.

# Sample

<https://logue.github.io/Reverb.js>

# Usage

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
const src = ctx.createBufferSource();
src.buffer = [AudioBuffer];

// Connect Reverb
src.connect(reverb.node);
reverb.node.connect(ctx.destination);

// fire
src.play();
```

# Reference

* [Web Audio API](https://www.w3.org/TR/webaudio/)
 * [Web Audio API日本語訳](https://g200kg.github.io/web-audio-api-ja/)
* [コンボルバーの使い方](https://www.g200kg.com/jp/docs/webaudio/convolver.html)
* [WebAudioの闇](https://qiita.com/zprodev/items/7fcd8335d7e8e613a01f)

# License

[MIT](LICENSE)