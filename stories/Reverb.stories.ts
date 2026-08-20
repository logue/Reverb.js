/**
 * Reverb.js Storybook Story
 *
 * Interactive demo of the reverb effect using the Web Audio API.
 * All parameters can be changed in real time via the Storybook Controls panel.
 */
import type { Meta, StoryContext, StoryObj } from 'storybook-html-rsbuild';

import Reverb from '@/index';
import type { Noise } from '@/types/Noise';
import { noiseTypes } from '@/types/Noise';
import { ReverbOptions as defaults } from '@/types/ReverbOptions';

import demoAudioUrl from './assets/demo.flac';

// ---------------------------------------------------------------------------
// i18n
// ---------------------------------------------------------------------------

const i18n = {
  ja: {
    title: 'Reverb.js インタラクティブデモ',
    playBtn: '▶ 再生',
    pauseBtn: '⏸ 一時停止',
    statusReady:
      'クリックして音声を再生（ブラウザの自動再生ポリシーのため操作が必要です）',
    statusNoFile:
      '⚠️ demo.flac が見つかりません。stories/assets/ にコピーしてください。',
    statusLoading: '🎵 音声ファイルを読み込み中...',
    statusLoaded: '読み込み完了',
    statusError: '⚠️ 音声ファイルの読み込みに失敗しました',
    statusPlaying: (reverbOn: boolean) =>
      `再生中 — ${reverbOn ? 'Reverb ON' : 'Dry only'}`,
    statusPaused: '一時停止中',
    canvasIdle: '▶ 再生を押して開始',
    canvasAnalyzing: 'Analyzing...',
    reverseOn: 'ON',
    reverseOff: 'OFF',
  },
  en: {
    title: 'Reverb.js Interactive Demo',
    playBtn: '▶ Play',
    pauseBtn: '⏸ Pause',
    statusReady:
      'Click to play audio (browser autoplay policy requires user interaction)',
    statusNoFile: '⚠️ demo.flac not found. Copy it to stories/assets/.',
    statusLoading: '🎵 Loading audio file...',
    statusLoaded: 'Loaded',
    statusError: '⚠️ Failed to load audio file',
    statusPlaying: (reverbOn: boolean) =>
      `Playing — ${reverbOn ? 'Reverb ON' : 'Dry only'}`,
    statusPaused: 'Paused',
    canvasIdle: 'Press ▶ Play to start',
    canvasAnalyzing: 'Analyzing...',
    reverseOn: 'ON',
    reverseOff: 'OFF',
  },
} as const;

type Locale = keyof typeof i18n;

function t(locale: string): (typeof i18n)[Locale] {
  return locale in i18n ? i18n[locale as Locale] : i18n.en;
}

// ---------------------------------------------------------------------------
// Type definition
// ---------------------------------------------------------------------------

type ReverbArgs = {
  enabled: boolean;
  mix: number;
  time: number;
  decay: number;
  delay: number;
  reverse: boolean;
  noise: Noise;
  peaks: number;
  scale: number;
  filterType: BiquadFilterType;
  filterFreq: number;
  filterQ: number;
};

// ---------------------------------------------------------------------------
// Module-level audio state (persists across story re-renders)
// ---------------------------------------------------------------------------

let audioCtx: AudioContext | null = null;
let reverb: Reverb | null = null;
let audioSource: AudioBufferSourceNode | null = null;
let analyserNode: AnalyserNode | null = null;
let soundBuffer: AudioBuffer | null = null;
let isPlaying = false;
let rafId: number | null = null;

function applyArgs(r: Reverb, args: ReverbArgs): void {
  r.time(args.time);
  r.decay(args.decay);
  r.delay(args.delay);
  r.reverse(args.reverse);
  r.filterType(args.filterType);
  r.filterFreq(args.filterFreq);
  r.filterQ(args.filterQ);
  r.mix(args.mix);
  r.setNoise(args.noise);
  r.peaks(args.peaks);
  r.scale(args.scale);
}

function ensureAudio(args: ReverbArgs): void {
  audioCtx ??= new AudioContext();
  reverb ??= new Reverb(audioCtx, {
    time: args.time,
    decay: args.decay,
    delay: args.delay,
    reverse: args.reverse,
    filterType: args.filterType,
    filterFreq: args.filterFreq,
    filterQ: args.filterQ,
    mix: args.mix,
    noise: args.noise,
    peaks: args.peaks,
    scale: args.scale,
  });
  if (!analyserNode) {
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 2048;
  }
}

function reconnect(enabled: boolean): void {
  if (!audioCtx || !reverb || !analyserNode || !audioSource) return;
  audioSource.disconnect();
  if (enabled) {
    reverb.connect(audioSource).connect(analyserNode);
  } else {
    reverb.disconnect(audioSource);
    audioSource.connect(analyserNode);
  }
  analyserNode.connect(audioCtx.destination);
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const FILTER_TYPES: BiquadFilterType[] = [
  'allpass',
  'lowpass',
  'highpass',
  'bandpass',
  'notch',
  'peaking',
  'lowshelf',
  'highshelf',
];

const meta = {
  title: 'Reverb.js',
  tags: [
    'autodocs',
  ],
  parameters: {
    docs: {
      description: {
        component: `
**Reverb.js** is a reverb effect class built on the Web Audio API.
It synthesizes an impulse response (IR) using colored noise and applies reverb via \`ConvolverNode\`.

## Basic usage

\`\`\`typescript
import Reverb from '@logue/reverb';

const ctx = new AudioContext();
const reverb = new Reverb(ctx, { time: 2, decay: 2, mix: 0.5 });

const source = ctx.createBufferSource();
reverb.connect(source).connect(ctx.destination);
source.start();
\`\`\`

## Signal flow

\`\`\`
AudioBufferSourceNode
  ├─→ ConvolverNode → BiquadFilterNode → WetGainNode ─┐
  ├─→ DryGainNode ─────────────────────────────────────┤
  └─→ (WetGainNode directly) ──────────────────────────┤
                                                    OutputGainNode → destination
\`\`\`
        `.trim(),
      },
    },
  },
  argTypes: {
    enabled: {
      control: 'boolean',
      description: 'Enable or disable the reverb effect',
      table: {
        category: 'Playback',
      },
    },
    mix: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.01,
      },
      description: 'Dry/Wet ratio (0 = dry only / 1 = wet only)',
      table: {
        category: 'Reverb',
        defaultValue: {
          summary: defaults.mix.toString(),
        },
      },
    },
    time: {
      control: {
        type: 'range',
        min: 1,
        max: 50,
        step: 1,
      },
      description: 'Impulse response length (seconds)',
      table: {
        category: 'Reverb',
        defaultValue: {
          summary: defaults.time.toString(),
        },
      },
    },
    decay: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 0.1,
      },
      description: 'Decay rate of the impulse response',
      table: {
        category: 'Reverb',
        defaultValue: {
          summary: defaults.decay.toString(),
        },
      },
    },
    delay: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
      description: 'Pre-reverb delay (ms)',
      table: {
        category: 'Reverb',
        defaultValue: {
          summary: defaults.delay.toString(),
        },
      },
    },
    reverse: {
      control: 'boolean',
      description: 'Reverse the impulse response (reverse reverb)',
      table: {
        category: 'Reverb',
        defaultValue: {
          summary: defaults.reverse.toString(),
        },
      },
    },
    noise: {
      control: {
        type: 'select',
      },
      options: noiseTypes,
      description: 'Colored noise type used for IR synthesis',
      table: {
        category: 'Noise',
        defaultValue: {
          summary: defaults.noise,
        },
        type: {
          summary: noiseTypes.join(' | '),
        },
      },
    },
    peaks: {
      control: {
        type: 'number',
        min: 1,
        max: 32,
        step: 1,
      },
      description: 'Number of noise peaks (effective for pink noise)',
      table: {
        category: 'Noise',
        defaultValue: {
          summary: defaults.peaks.toString(),
        },
      },
    },
    scale: {
      control: {
        type: 'number',
        min: 0.1,
        max: 4,
        step: 0.1,
      },
      description: 'Noise scale',
      table: {
        category: 'Noise',
        defaultValue: {
          summary: defaults.scale.toString(),
        },
      },
    },
    filterType: {
      control: {
        type: 'select',
      },
      options: FILTER_TYPES,
      description: 'BiquadFilter type applied to the IR',
      table: {
        category: 'Filter',
        defaultValue: {
          summary: defaults.filterType,
        },
      },
    },
    filterFreq: {
      control: {
        type: 'range',
        min: 20,
        max: 20000,
        step: 10,
      },
      description: 'Filter frequency (Hz)',
      table: {
        category: 'Filter',
        defaultValue: {
          summary: defaults.filterFreq.toString(),
        },
      },
    },
    filterQ: {
      control: {
        type: 'range',
        min: 0,
        max: 10,
        step: 0.1,
      },
      description: 'Filter Q value',
      table: {
        category: 'Filter',
        defaultValue: {
          summary: defaults.filterQ.toString(),
        },
      },
    },
  },
  args: {
    enabled: true,
    mix: defaults.mix,
    time: defaults.time,
    decay: defaults.decay,
    delay: defaults.delay,
    reverse: defaults.reverse,
    noise: defaults.noise,
    peaks: defaults.peaks,
    scale: defaults.scale,
    filterType: defaults.filterType,
    filterFreq: defaults.filterFreq,
    filterQ: defaults.filterQ,
  },

  render: (args: ReverbArgs, context: StoryContext<ReverbArgs>) => {
    const locale = (context?.globals?.locale as string) ?? 'ja';
    const s = t(locale);

    if (reverb) applyArgs(reverb, args);
    if (isPlaying) reconnect(args.enabled);
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    // ── UI ──
    const wrapper = document.createElement('div');
    wrapper.style.cssText =
      'font-family: system-ui, sans-serif; padding: 16px; max-width: 660px;';

    const title = document.createElement('h3');
    title.textContent = s.title;
    title.style.cssText = 'margin: 0 0 12px; font-size: 16px;';
    wrapper.appendChild(title);

    const canvas = document.createElement('canvas');
    canvas.width = 628;
    canvas.height = 120;
    canvas.style.cssText =
      'width: 100%; background: #1e1e2e; border-radius: 6px; display: block;';
    wrapper.appendChild(canvas);
    const ctx2d = canvas.getContext('2d');

    const row = document.createElement('div');
    row.style.cssText =
      'display: flex; gap: 10px; margin-top: 12px; align-items: center; flex-wrap: wrap;';

    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.textContent = s.playBtn;
    playBtn.style.cssText = `
      padding: 8px 20px; font-size: 14px; cursor: pointer;
      border-radius: 4px; border: none;
      background: ${args.enabled ? '#4ade80' : '#94a3b8'};
      color: #0f172a; font-weight: bold;
    `;
    row.appendChild(playBtn);

    const status = document.createElement('span');
    status.style.cssText = 'font-size: 12px; color: #64748b;';
    status.textContent = demoAudioUrl ? s.statusReady : s.statusNoFile;
    row.appendChild(status);
    wrapper.appendChild(row);

    const paramGrid = document.createElement('div');
    paramGrid.style.cssText = `
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 8px; margin-top: 12px; font-size: 12px;
    `;
    const params: [
      string,
      string,
    ][] = [
      [
        'Time',
        `${args.time}s`,
      ],
      [
        'Decay',
        `${args.decay}`,
      ],
      [
        'Delay',
        `${args.delay}ms`,
      ],
      [
        'Mix',
        `${Math.round(args.mix * 100)}%`,
      ],
      [
        'Noise',
        args.noise,
      ],
      [
        'Filter',
        `${args.filterType}`,
      ],
      [
        'Freq',
        `${args.filterFreq.toLocaleString()}Hz`,
      ],
      [
        'Q',
        `${args.filterQ}`,
      ],
      [
        'Reverse',
        args.reverse ? s.reverseOn : s.reverseOff,
      ],
    ];
    for (const [label, value] of params) {
      const cell = document.createElement('div');
      cell.style.cssText =
        'background: #f1f5f9; border-radius: 4px; padding: 6px 8px;';
      cell.innerHTML = `<span style="color:#64748b">${label}</span><br><strong>${value}</strong>`;
      paramGrid.appendChild(cell);
    }
    wrapper.appendChild(paramGrid);

    // ── FFT loop ──
    const drawFFT = () => {
      if (!ctx2d) {
        rafId = requestAnimationFrame(drawFFT);
        return;
      }
      const { width, height } = canvas;
      ctx2d.fillStyle = '#1e1e2e';
      ctx2d.fillRect(0, 0, width, height);

      if (analyserNode && isPlaying) {
        const data = new Float32Array(analyserNode.frequencyBinCount);
        analyserNode.getFloatFrequencyData(data);
        ctx2d.fillStyle = args.enabled ? '#89b4fa' : '#a6e3a1';
        for (let i = 0; i < width; i++) {
          const y = height / 2 + ((data[i] ?? -100) + 48) * 2.2;
          ctx2d.fillRect(i, height - y, 1, y);
        }
        ctx2d.font = '9px monospace';
        for (let db = -40; db <= 40; db += 20) {
          const y = Math.trunc(height / 2 - (db * height) / 100);
          ctx2d.fillStyle = '#313244';
          ctx2d.fillRect(0, y, width, 1);
          ctx2d.fillStyle = '#585b70';
          ctx2d.fillText(`${db}dB`, 2, y - 1);
        }
      } else {
        ctx2d.fillStyle = '#313244';
        ctx2d.fillRect(0, Math.trunc(canvas.height / 2), width, 1);
        ctx2d.fillStyle = '#6c7086';
        ctx2d.font = '12px system-ui';
        ctx2d.textAlign = 'center';
        ctx2d.fillText(
          isPlaying ? s.canvasAnalyzing : s.canvasIdle,
          width / 2,
          height / 2 + 4,
        );
        ctx2d.textAlign = 'left';
      }
      rafId = requestAnimationFrame(drawFFT);
    };
    drawFFT();

    // ── Play button ──
    playBtn.addEventListener('click', async () => {
      if (!demoAudioUrl) {
        status.textContent = s.statusNoFile;
        return;
      }

      ensureAudio(args);
      if (!audioCtx || !reverb || !analyserNode) return;

      if (!soundBuffer) {
        status.textContent = s.statusLoading;
        playBtn.disabled = true;
        try {
          const res = await fetch(demoAudioUrl);
          const arraybuf = await res.arrayBuffer();
          soundBuffer = await audioCtx.decodeAudioData(arraybuf);
          status.textContent = s.statusLoaded;
        } catch (err) {
          console.error('[Reverb Story]', err);
          status.textContent = s.statusError;
          playBtn.disabled = false;
          return;
        }
        playBtn.disabled = false;
      }

      if (!isPlaying) {
        audioSource = audioCtx.createBufferSource();
        audioSource.buffer = soundBuffer;
        audioSource.loop = true;
        reconnect(args.enabled);
        audioSource.start();
        isPlaying = true;
        await audioCtx.resume();
        playBtn.textContent = s.pauseBtn;
        playBtn.style.background = '#fb923c';
        status.textContent = s.statusPlaying(args.enabled);
        return;
      }

      if (audioCtx.state === 'running') {
        await audioCtx.suspend();
        playBtn.textContent = s.playBtn;
        playBtn.style.background = '#4ade80';
        status.textContent = s.statusPaused;
      } else {
        await audioCtx.resume();
        playBtn.textContent = s.pauseBtn;
        playBtn.style.background = '#fb923c';
        status.textContent = s.statusPlaying(args.enabled);
      }
    });

    return wrapper;
  },
} satisfies Meta<ReverbArgs>;

export default meta;
type Story = StoryObj<ReverbArgs>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Default settings. All parameters can be changed in real time via the Controls panel. */
export const Default: Story = {
  name: 'Default / デフォルト設定',
};

/** Large hall reverb. Long time, high decay, low-pass filter. */
export const LargeHall: Story = {
  name: 'Large Hall / ラージホール',
  args: {
    time: 8,
    decay: 6,
    mix: 0.65,
    noise: 'pink',
    filterType: 'lowpass',
    filterFreq: 6000,
  },
};

/** Small room reverb. Short IR and low mix for subtle ambience. */
export const SmallRoom: Story = {
  name: 'Small Room / スモールルーム',
  args: {
    time: 1,
    decay: 1,
    mix: 0.25,
    noise: 'white',
    filterType: 'highpass',
    filterFreq: 200,
  },
};

/** Reverse reverb. Reversed IR creates a swell before the source. */
export const ReverseReverb: Story = {
  name: 'Reverse Reverb / リバースリバーブ',
  args: {
    reverse: true,
    time: 3,
    decay: 4,
    mix: 0.6,
    noise: 'blue',
  },
};

/** Dry signal for A/B comparison. Toggle `enabled` to switch. */
export const DrySignal: Story = {
  name: 'Dry Signal / ドライ信号（比較用）',
  args: {
    enabled: false,
    mix: 0,
  },
};
