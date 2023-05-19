true&&(function polyfill() {
    const relList = document.createElement('link').relList;
    if (relList && relList.supports && relList.supports('modulepreload')) {
        return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
    }
    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'LINK' && node.rel === 'modulepreload')
                    processPreload(node);
            }
        }
    }).observe(document, { childList: true, subtree: true });
    function getFetchOpts(link) {
        const fetchOpts = {};
        if (link.integrity)
            fetchOpts.integrity = link.integrity;
        if (link.referrerPolicy)
            fetchOpts.referrerPolicy = link.referrerPolicy;
        if (link.crossOrigin === 'use-credentials')
            fetchOpts.credentials = 'include';
        else if (link.crossOrigin === 'anonymous')
            fetchOpts.credentials = 'omit';
        else
            fetchOpts.credentials = 'same-origin';
        return fetchOpts;
    }
    function processPreload(link) {
        if (link.ep)
            // ep marker = processed
            return;
        link.ep = true;
        // prepopulate the load record
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
    }
}());

const INV_MAX = 1 / 2 ** 32;
class ARandom {
    float(norm = 1) {
        return this.int() * INV_MAX * norm;
    }
    norm(norm = 1) {
        return (this.int() * INV_MAX - 0.5) * 2 * norm;
    }
    normMinMax(min, max) {
        const x = this.minmax(min, max);
        return this.float() < 0.5 ? x : -x;
    }
    minmax(min, max) {
        return this.float() * (max - min) + min;
    }
    minmaxInt(min, max) {
        min |= 0;
        max |= 0;
        return min + ((this.float() * (max - min)) | 0);
    }
}

const random = Math.random;
/**
 * A `Math.random()` based {@link IRandom} implementation. Also @see
 * {@link SYSTEM}.
 */
class SystemRandom extends ARandom {
    int() {
        return (random() * 4294967296) /* 2**32 */ >>> 0;
    }
    float(norm = 1) {
        return random() * norm;
    }
    norm(norm = 1) {
        return (random() - 0.5) * 2 * norm;
    }
}
/**
 * Used as default PRNG throughout most other thi.ng projects, though usually is
 * configurable.
 */
const SYSTEM = new SystemRandom();

const defaults = {
  noise: "white",
  scale: 1,
  peaks: 2,
  randomAlgorithm: SYSTEM,
  decay: 2,
  delay: 0,
  reverse: false,
  time: 2,
  filterType: "allpass",
  filterFreq: 2200,
  filterQ: 1,
  mix: 0.5,
  once: false
};

const meta = {
  version: "1.2.13",
  date: "2023-05-19T02:41:14.414Z"
};
const Meta = meta;

const Noise = {
  /** Blue noise */
  blue: "blue",
  /** Brown noise (same as red noise) */
  brown: "red",
  /** Green noise */
  green: "green",
  /** Pink noise */
  pink: "pink",
  /** Red noise */
  red: "red",
  /** Violet noise */
  violet: "violet",
  /** White noise */
  white: "white"
};
const Noise$1 = Noise;

const DEFAULT_OPTS = {
    bins: 2,
    scale: 1,
    rnd: SYSTEM,
};

const preseed = (n, scale, rnd) => {
    const state = new Array(n);
    for (let i = 0; i < n; i++) {
        state[i] = rnd.norm(scale);
    }
    return state;
};
const sum = (src) => src.reduce((sum, x) => sum + x, 0);
function* interleave(a, b) {
    const src = [a[Symbol.iterator](), b[Symbol.iterator]()];
    for (let i = 0; true; i ^= 1) {
        const next = src[i].next();
        if (next.done)
            return;
        yield next.value;
    }
}

/**
 * High-pass filtered noise. Opposite of {@link red}.
 *
 * @param opts -
 */
function* blue(opts) {
    const { bins, scale, rnd } = {
        ...DEFAULT_OPTS,
        ...opts,
    };
    const state = preseed(bins, scale, rnd);
    state.forEach((x, i) => (state[i] = i & 1 ? x : -x));
    const invN = 1 / bins;
    let acc = sum(state);
    for (let i = 0, sign = -1; true; ++i >= bins && (i = 0)) {
        acc -= state[i];
        acc += state[i] = sign * rnd.norm(scale);
        sign ^= 0xfffffffe;
        yield sign * acc * invN;
    }
}

/**
 * Band-pass filtered noise (interleaved blue noise). Opposite of
 * {@link violet}.
 *
 * @param opts -
 */
const green = (opts) => interleave(blue(opts), blue(opts));

/**
 * Returns number of 1 bits in `x`.
 *
 * @param x -
 */
const ctz32 = (x) => {
    let c = 32;
    x &= -x;
    x && c--;
    x & 0x0000ffff && (c -= 16);
    x & 0x00ff00ff && (c -= 8);
    x & 0x0f0f0f0f && (c -= 4);
    x & 0x33333333 && (c -= 2);
    x & 0x55555555 && (c -= 1);
    return c;
};

/**
 * Exponential decay (1/f) noise, based on Voss-McCarthy algorithm.
 *
 * @remarks
 * The number of internal states should be in the [4..32] range (default: 8).
 * Due to JS integer limitations, `n` > 32 are meaningless.
 *
 * References:
 *
 * - https://www.dsprelated.com/showarticle/908.php
 * - https://www.firstpr.com.au/dsp/pink-noise/#Voss-McCartney
 *
 * @param opts -
 */
function* pink(opts) {
    const { bins, scale, rnd } = {
        ...DEFAULT_OPTS,
        bins: 8,
        ...opts,
    };
    const state = preseed(bins, scale, rnd);
    const invN = 1 / bins;
    let acc = sum(state);
    for (let i = 0; true; i = (i + 1) >>> 0) {
        const id = ctz32(i) % bins;
        acc -= state[id];
        acc += state[id] = rnd.norm(scale);
        yield acc * invN;
    }
}

/**
 * Low-pass filtered noise (same as brown noise). Opposite of {@link blue}.
 *
 * @param opts -
 */
function* red(opts) {
    const { bins, scale, rnd } = {
        ...DEFAULT_OPTS,
        ...opts,
    };
    const state = preseed(bins, scale, rnd);
    const invN = 1 / bins;
    let acc = sum(state);
    for (let i = 0; true; ++i >= bins && (i = 0)) {
        acc -= state[i];
        acc += state[i] = rnd.norm(scale);
        yield acc * invN;
    }
}

/**
 * Band-stop filtered noise (interleaved red noise). Opposite of {@link green}.
 *
 * @param opts -
 */
const violet = (opts) => interleave(red(opts), red(opts));

/**
 * Unfiltered noise w/ uniform distribution. Merely yields samples from
 * given PRNG.
 *
 * @param opts -
 */
function* white(opts) {
    const { scale, rnd } = { ...DEFAULT_OPTS, ...opts };
    while (true) {
        yield rnd.norm(scale);
    }
}

const implementsFunction = (x, fn) => x != null && typeof x[fn] === "function";

const ensureTransducer = (x) => implementsFunction(x, "xform") ? x.xform() : x;

const isIterable = (x) => x != null && typeof x[Symbol.iterator] === "function";

class Reduced {
    constructor(val) {
        this.value = val;
    }
    deref() {
        return this.value;
    }
}
const reduced = (x) => new Reduced(x);
const isReduced = (x) => x instanceof Reduced;
const ensureReduced = (x) => x instanceof Reduced ? x : new Reduced(x);
const unreduced = (x) => (x instanceof Reduced ? x.deref() : x);

/**
 * Convenience helper for building a full {@link Reducer} using the identity
 * function (i.e. `(x) => x`) as completion step (true for 90% of all
 * bundled transducers).
 *
 * @param init - init step of reducer
 * @param rfn - reduction step of reducer
 */
const reducer = (init, rfn) => [init, (acc) => acc, rfn];

function push(xs) {
    return xs
        ? [...xs]
        : reducer(() => [], (acc, x) => (acc.push(x), acc));
}

/**
 * Takes a transducer and input iterable. Returns iterator of
 * transformed results.
 *
 * @param xform -
 * @param xs -
 */
function* iterator(xform, xs) {
    const rfn = ensureTransducer(xform)(push());
    const complete = rfn[1];
    const reduce = rfn[2];
    for (let x of xs) {
        const y = reduce([], x);
        if (isReduced(y)) {
            yield* unreduced(complete(y.deref()));
            return;
        }
        if (y.length) {
            yield* y;
        }
    }
    yield* unreduced(complete([]));
}

/**
 * Reducer composition helper, internally used by various transducers
 * during initialization. Takes existing reducer `rfn` (a 3-tuple) and a
 * reducing function `fn`. Returns a new reducer tuple.
 *
 * @remarks
 * `rfn[2]` reduces values of type `B` into an accumulator of type `A`.
 * `fn` accepts values of type `C` and produces interim results of type
 * `B`, which are then (possibly) passed to the "inner" `rfn[2]`
 * function. Therefore the resulting reducer takes inputs of `C` and an
 * accumulator of type `A`.
 *
 * It is assumed that `fn` internally calls `rfn[2]` to pass its own
 * results for further processing by the nested reducer `rfn`.
 *
 * @example
 * ```ts
 * compR(rfn, fn)
 * // [rfn[0], rfn[1], fn]
 * ```
 *
 * @param rfn -
 * @param fn -
 */
const compR = (rfn, fn) => [rfn[0], rfn[1], fn];

function take(n, src) {
    return isIterable(src)
        ? iterator(take(n), src)
        : (rfn) => {
            const r = rfn[2];
            let m = n;
            return compR(rfn, (acc, x) => --m > 0
                ? r(acc, x)
                : m === 0
                    ? ensureReduced(r(acc, x))
                    : reduced(acc));
        };
}

class Reverb {
  /** Version strings */
  static version = Meta.version;
  /** Build date */
  static build = Meta.date;
  /** AudioContext */
  ctx;
  /** Wet Level (Reverberated node) */
  wetGainNode;
  /** Dry Level (Original sound node) */
  dryGainNode;
  /** Impulse response filter */
  filterNode;
  /** Convolution node for applying impulse response */
  convolverNode;
  /** Output gain node */
  outputNode;
  /** Option */
  options;
  /** Connected flag */
  isConnected;
  /** Noise Generator */
  noise = white;
  /**
   * Constructor
   *
   * @param ctx - Root AudioContext
   * @param options - Configure
   */
  constructor(ctx, options) {
    this.ctx = ctx;
    this.options = Object.assign(defaults, options);
    this.wetGainNode = this.ctx.createGain();
    this.dryGainNode = this.ctx.createGain();
    this.filterNode = this.ctx.createBiquadFilter();
    this.convolverNode = this.ctx.createConvolver();
    this.outputNode = this.ctx.createGain();
    this.isConnected = false;
    this.filterType(this.options.filterType);
    this.setNoise(this.options.noise);
    this.buildImpulse();
    this.mix(this.options.mix);
  }
  /**
   * Connect the node for the reverb effect to the original sound node.
   *
   * @param sourceNode - Input source node
   */
  connect(sourceNode) {
    if (this.isConnected && this.options.once) {
      this.isConnected = false;
      return this.outputNode;
    }
    this.convolverNode.connect(this.filterNode);
    this.filterNode.connect(this.wetGainNode);
    sourceNode.connect(this.convolverNode);
    sourceNode.connect(this.dryGainNode).connect(this.outputNode);
    sourceNode.connect(this.wetGainNode).connect(this.outputNode);
    this.isConnected = true;
    return this.outputNode;
  }
  /**
   * Disconnect the reverb node
   *
   * @param sourceNode - Input source node
   */
  disconnect(sourceNode) {
    if (this.isConnected) {
      this.convolverNode.disconnect(this.filterNode);
      this.filterNode.disconnect(this.wetGainNode);
    }
    this.isConnected = false;
    return sourceNode;
  }
  /**
   * Dry/Wet ratio
   *
   * @param mix - Ratio (0~1)
   */
  mix(mix) {
    if (!this.inRange(mix, 0, 1)) {
      throw new RangeError("[Reverb.js] Dry/Wet ratio must be between 0 to 1.");
    }
    this.options.mix = mix;
    this.dryGainNode.gain.value = 1 - this.options.mix;
    this.wetGainNode.gain.value = this.options.mix;
  }
  /**
   * Set Impulse Response time length (second)
   *
   * @param value - IR length
   */
  time(value) {
    if (!this.inRange(value, 1, 50)) {
      throw new RangeError(
        "[Reverb.js] Time length of inpulse response must be less than 50sec."
      );
    }
    this.options.time = value;
    this.buildImpulse();
  }
  /**
   * Impulse response decay rate.
   *
   * @param value - Decay value
   */
  decay(value) {
    if (!this.inRange(value, 0, 100)) {
      throw new RangeError(
        "[Reverb.js] Inpulse Response decay level must be less than 100."
      );
    }
    this.options.decay = value;
    this.buildImpulse();
  }
  /**
   * Delay before reverberation starts
   *
   * @param value - Time[ms]
   */
  delay(value) {
    if (!this.inRange(value, 0, 100)) {
      throw new RangeError(
        "[Reverb.js] Inpulse Response delay time must be less than 100."
      );
    }
    this.options.delay = value;
    this.buildImpulse();
  }
  /**
   * Reverse the impulse response.
   *
   * @param reverse - Reverse IR
   */
  reverse(reverse) {
    this.options.reverse = reverse;
    this.buildImpulse();
  }
  /**
   * Filter for impulse response
   *
   * @param type - Filiter Type
   */
  filterType(type = "allpass") {
    this.filterNode.type = this.options.filterType = type;
  }
  /**
   * Filter frequency applied to impulse response
   *
   * @param freq - Frequency
   */
  filterFreq(freq) {
    if (!this.inRange(freq, 20, 2e4)) {
      throw new RangeError(
        "[Reverb.js] Filter frequrncy must be between 20 and 20000."
      );
    }
    this.options.filterFreq = freq;
    this.filterNode.frequency.value = this.options.filterFreq;
  }
  /**
   * Filter quality.
   *
   * @param q - Quality
   */
  filterQ(q) {
    if (!this.inRange(q, 0, 10)) {
      throw new RangeError(
        "[Reverb.js] Filter quality value must be between 0 and 10."
      );
    }
    this.options.filterQ = q;
    this.filterNode.Q.value = this.options.filterQ;
  }
  /**
   * set IR source noise peaks
   *
   * @param p - Peaks
   */
  peaks(p) {
    this.options.peaks = p;
    this.buildImpulse();
  }
  /**
   * set IR source noise scale.
   *
   * @param s - Scale
   */
  scale(s) {
    this.options.scale = s;
    this.buildImpulse();
  }
  /**
   * set IR source noise generator.
   *
   * @param a - Algorithm
   */
  randomAlgorithm(a) {
    this.options.randomAlgorithm = a;
    this.buildImpulse();
  }
  /**
   * Inpulse Response Noise algorithm.
   *
   * @param type - IR noise algorithm type.
   */
  setNoise(type) {
    this.options.noise = type;
    switch (type) {
      case Noise$1.blue:
        this.noise = blue;
        break;
      case Noise$1.green:
        this.noise = green;
        break;
      case Noise$1.pink:
        this.noise = pink;
        break;
      case Noise$1.red:
      case Noise$1.brown:
        this.noise = red;
        break;
      case Noise$1.violet:
        this.noise = violet;
        break;
      default:
        this.noise = white;
    }
    this.buildImpulse();
  }
  /**
   * Set Random Algorythm
   *
   * @param algorithm - Algorythm
   */
  setRandomAlgorythm(algorithm) {
    this.options.randomAlgorithm = algorithm;
    this.buildImpulse();
  }
  /**
   * Return true if in range, otherwise false
   *
   * @param x - Target value
   * @param min - Minimum value
   * @param max - Maximum value
   */
  inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
  }
  /** Utility function for building an impulse response from the module parameters. */
  buildImpulse() {
    const rate = this.ctx.sampleRate;
    const duration = Math.max(rate * this.options.time, 1);
    const delayDuration = rate * this.options.delay;
    const impulse = this.ctx.createBuffer(2, duration, rate);
    const impulseL = new Float32Array(duration);
    const impulseR = new Float32Array(duration);
    const noiseL = this.getNoise(duration);
    const noiseR = this.getNoise(duration);
    for (let i = 0; i < duration; i++) {
      let n = 0;
      if (i < delayDuration) {
        impulseL[i] = 0;
        impulseR[i] = 0;
        n = this.options.reverse ?? false ? duration - (i - delayDuration) : i - delayDuration;
      } else {
        n = this.options.reverse ?? false ? duration - i : i;
      }
      impulseL[i] = (noiseL[i] ?? 0) * (1 - n / duration) ** this.options.decay;
      impulseR[i] = (noiseR[i] ?? 0) * (1 - n / duration) ** this.options.decay;
    }
    impulse.getChannelData(0).set(impulseL);
    impulse.getChannelData(1).set(impulseR);
    this.convolverNode.buffer = impulse;
  }
  /**
   * Noise source
   *
   * @param duration - length of IR.
   */
  getNoise(duration) {
    return [
      ...take(
        duration,
        this.noise({
          bins: this.options.peaks,
          scale: this.options.scale,
          rnd: this.options.randomAlgorithm
        })
      )
    ];
  }
}
if (!window.Reverb) {
  window.Reverb = Reverb;
}

export { Reverb as R };
