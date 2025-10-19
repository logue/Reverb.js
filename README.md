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

## Testing

This project includes a comprehensive test suite to ensure reliability and code quality.

### Test Coverage

- **Statement Coverage**: 100%
- **Function Coverage**: 100%
- **Branch Coverage**: 90.56%
- **Line Coverage**: 100%

### Test Structure

The test suite is organized into several categories:

- **Unit Tests**: Individual method and property testing
  - `src/__tests__/Reverb.test.ts` - Main Reverb class tests
  - `src/__tests__/NoiseType.test.ts` - Noise type definition tests
  - `src/__tests__/OptionInterface.test.ts` - Configuration interface tests

- **Integration Tests**: Component interaction testing
  - `src/__tests__/integration.test.ts` - Cross-component integration tests

- **End-to-End Tests**: Real-world usage scenarios
  - `src/__tests__/e2e.test.ts` - Practical implementation scenarios

### Test Features

The test suite covers:

- ✅ Constructor with default and custom options
- ✅ Audio node connection and disconnection
- ✅ Parameter validation and error handling
- ✅ All reverb parameters (mix, time, decay, delay, reverse)
- ✅ Filter configurations (type, frequency, Q-factor)
- ✅ Noise algorithm variations (white, pink, brown, blue, violet, red, green)
- ✅ Performance testing with multiple instances
- ✅ Edge cases and boundary conditions
- ✅ Real-world scenarios (guitar, vocal, drum reverb settings)

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage report
pnpm test:coverage
```

### Test Environment

- **Vitest** - Fast Vite-based test framework
- **Happy-DOM** - Browser environment simulation
- **Web Audio API Mocking** - Complete audio context simulation
- **TypeScript Support** - Full type checking during tests

### CDN Usage

Not really intended for use with a CDN.

The dependent libraries [@thi.ng/colored-noise](https://www.jsdelivr.com/package/npm/@thi.ng/colored-noise), [@thi.ng/random](https://www.jsdelivr.com/package/npm/@thi.ng/random) and [@thi.ng/transducers](https://www.jsdelivr.com/package/npm/@thi.ng/transducers) need to be loaded separately.

## Reference

- [Web Audio API](https://www.w3.org/TR/webaudio/)
  - [Web Audio API 日本語訳](https://g200kg.github.io/web-audio-api-ja/)
- [コンボルバーの使い方](https://www.g200kg.com/jp/docs/webaudio/convolver.html)
- [WebAudio の闇](https://qiita.com/zprodev/items/7fcd8335d7e8e613a01f)
- [@thi.ng/colored-noise](https://github.com/thi-ng/umbrella/tree/develop/packages/colored-noise)

## License

©2019-2025 by Logue. Licensed under the [MIT License](LICENSE).
