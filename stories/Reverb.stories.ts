/**
 * Reverb.js Storybook Story
 *
 * Web Audio API を使ったリバーブエフェクトのインタラクティブデモ。
 * Storybook Controls パネルで全パラメータをリアルタイムに変更できます。
 */
import type { Meta, StoryObj } from '@storybook/html';

import Reverb from '@/index';
import type { Noise } from '@/types/Noise';
import { noiseTypes } from '@/types/Noise';
import { ReverbOptions as defaults } from '@/types/ReverbOptions';

// --- デモ音声 ---
import demoAudioUrl from './assets/demo.flac';

// ---------------------------------------------------------------------------
// Story で使う型定義
// ---------------------------------------------------------------------------

type ReverbArgs = {
  /** リバーブエフェクトの有効 / 無効 */
  enabled: boolean;
  /** Dry/Wet 比率 */
  mix: number;
  /** インパルス応答の長さ（秒） */
  time: number;
  /** 減衰率 */
  decay: number;
  /** リバーブ開始前の遅延（ms） */
  delay: number;
  /** インパルス応答を逆転させる */
  reverse: boolean;
  /** ノイズアルゴリズムの種類 */
  noise: Noise;
  /** ノイズのピーク数 */
  peaks: number;
  /** ノイズのスケール */
  scale: number;
  /** フィルタ種別 */
  filterType: BiquadFilterType;
  /** フィルタ周波数（Hz） */
  filterFreq: number;
  /** フィルタ Q 値 */
  filterQ: number;
};

// ---------------------------------------------------------------------------
// モジュールレベルの音声状態（Story の再レンダリングをまたいで保持）
// ---------------------------------------------------------------------------

let audioCtx: AudioContext | null = null;
let reverb: Reverb | null = null;
let audioSource: AudioBufferSourceNode | null = null;
let analyserNode: AnalyserNode | null = null;
let soundBuffer: AudioBuffer | null = null;
let isPlaying = false;
let rafId: number | null = null;

/** Reverb インスタンスに args を適用する */
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

/** AudioContext / Reverb / Analyser を初期化（初回呼び出し時のみ生成） */
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

/** ソースノードをリバーブあり / なし で接続し直す */
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
**Reverb.js** は Web Audio API を使ったリバーブエフェクトクラスです。
カラードノイズでインパルス応答 (IR) を合成し、ConvolverNode を通してリバーブを掛けます。

## 基本的な使い方

\`\`\`typescript
import Reverb from '@logue/reverb';

const ctx = new AudioContext();
const reverb = new Reverb(ctx, {
  time: 2,   // IR の長さ（秒）
  decay: 2,  // 減衰率
  mix: 0.5,  // Dry/Wet 比率
});

const source = ctx.createBufferSource();
// リバーブあり: source → Reverb → destination
reverb.connect(source).connect(ctx.destination);
source.start();
\`\`\`

## 信号フロー

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
    // ── 再生 ─────────────────────────────────────────
    enabled: {
      control: 'boolean',
      description: 'リバーブエフェクトの有効 / 無効',
      table: {
        category: 'Playback',
      },
    },

    // ── リバーブ ──────────────────────────────────────
    mix: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.01,
      },
      description: 'Dry/Wet 比率（0 = ドライのみ / 1 = ウェットのみ）',
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
      description: 'インパルス応答の長さ（秒）',
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
      description: 'インパルス応答の減衰率',
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
      description: 'リバーブ開始前の遅延（ms）',
      table: {
        category: 'Reverb',
        defaultValue: {
          summary: defaults.delay.toString(),
        },
      },
    },
    reverse: {
      control: 'boolean',
      description: 'インパルス応答を逆転させる（リバースリバーブ）',
      table: {
        category: 'Reverb',
        defaultValue: {
          summary: defaults.reverse.toString(),
        },
      },
    },

    // ── ノイズ ────────────────────────────────────────
    noise: {
      control: {
        type: 'select',
      },
      options: noiseTypes,
      description: 'IR 合成に使うカラードノイズの種類',
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
      description: 'ノイズのピーク数（pink ノイズ系で有効）',
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
      description: 'ノイズのスケール',
      table: {
        category: 'Noise',
        defaultValue: {
          summary: defaults.scale.toString(),
        },
      },
    },

    // ── フィルタ ──────────────────────────────────────
    filterType: {
      control: {
        type: 'select',
      },
      options: FILTER_TYPES,
      description: 'IR に適用する BiquadFilter の種類',
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
      description: 'フィルタ周波数（Hz）',
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
      description: 'フィルタ Q 値',
      table: {
        category: 'Filter',
        defaultValue: {
          summary: defaults.filterQ.toString(),
        },
      },
    },
  },

  // デフォルト値（ReverbOptions の初期値に合わせる）
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

  /**
   * render は Storybook Controls が変わるたびに呼び出されます。
   * 既存の Reverb インスタンスがあれば args を適用するだけにして、
   * 音声状態（AudioContext など）は保持します。
   */
  render: (args: ReverbArgs) => {
    // args 変更を既存インスタンスに反映
    if (reverb) {
      applyArgs(reverb, args);
    }

    // 再生中なら接続を更新
    if (isPlaying) {
      reconnect(args.enabled);
    }

    // 前のアニメーションループをキャンセル
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    // ── UI 構築 ──────────────────────────────────────

    const wrapper = document.createElement('div');
    wrapper.style.cssText =
      'font-family: system-ui, sans-serif; padding: 16px; max-width: 660px;';

    // タイトル
    const title = document.createElement('h3');
    title.textContent = 'Reverb.js インタラクティブデモ';
    title.style.cssText = 'margin: 0 0 12px; font-size: 16px;';
    wrapper.appendChild(title);

    // FFT キャンバス
    const canvas = document.createElement('canvas');
    canvas.width = 628;
    canvas.height = 120;
    canvas.style.cssText =
      'width: 100%; background: #1e1e2e; border-radius: 6px; display: block;';
    wrapper.appendChild(canvas);
    const ctx2d = canvas.getContext('2d');

    // コントロール行
    const row = document.createElement('div');
    row.style.cssText =
      'display: flex; gap: 10px; margin-top: 12px; align-items: center; flex-wrap: wrap;';

    // Play / Pause ボタン
    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.textContent = '▶ Play';
    playBtn.style.cssText = `
      padding: 8px 20px; font-size: 14px; cursor: pointer;
      border-radius: 4px; border: none;
      background: ${args.enabled ? '#4ade80' : '#94a3b8'};
      color: #0f172a; font-weight: bold;
    `;
    row.appendChild(playBtn);

    // ステータステキスト
    const status = document.createElement('span');
    status.style.cssText = 'font-size: 12px; color: #64748b;';
    status.textContent = demoAudioUrl
      ? 'クリックして音声を再生（ブラウザの自動再生ポリシーのため操作が必要です）'
      : '⚠️ demo.flac が見つかりません。src/stories/assets/ にコピーしてください。';
    row.appendChild(status);
    wrapper.appendChild(row);

    // パラメータ表示
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
        args.reverse ? 'ON' : 'OFF',
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

    // ── FFT アニメーション ────────────────────────────

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

        // スペクトル描画
        ctx2d.fillStyle = args.enabled ? '#89b4fa' : '#a6e3a1';
        for (let i = 0; i < width; i++) {
          const y = height / 2 + ((data[i] ?? -100) + 48) * 2.2;
          ctx2d.fillRect(i, height - y, 1, y);
        }

        // dB グリッド線
        ctx2d.font = '9px monospace';
        for (let db = -40; db <= 40; db += 20) {
          const y = Math.trunc(height / 2 - (db * height) / 100);
          ctx2d.fillStyle = '#313244';
          ctx2d.fillRect(0, y, width, 1);
          ctx2d.fillStyle = '#585b70';
          ctx2d.fillText(`${db}dB`, 2, y - 1);
        }
      } else {
        // 再生前はフラットラインを表示
        ctx2d.fillStyle = '#313244';
        ctx2d.fillRect(0, Math.trunc(canvas.height / 2), width, 1);
        ctx2d.fillStyle = '#6c7086';
        ctx2d.font = '12px system-ui';
        ctx2d.textAlign = 'center';
        ctx2d.fillText(
          isPlaying ? 'Analyzing...' : '▶ Play を押して開始',
          width / 2,
          height / 2 + 4,
        );
        ctx2d.textAlign = 'left';
      }

      rafId = requestAnimationFrame(drawFFT);
    };
    drawFFT();

    // ── Play ボタンのハンドラ ─────────────────────────

    playBtn.addEventListener('click', async () => {
      if (!demoAudioUrl) {
        status.textContent =
          '⚠️ demo.flac が未設定です。ファイルを src/stories/assets/ にコピーしてください。';
        return;
      }

      // 初回: AudioContext / Reverb 初期化
      ensureAudio(args);
      if (!audioCtx || !reverb || !analyserNode) return;

      // 初回: サウンドバッファ読み込み
      if (!soundBuffer) {
        status.textContent = '🎵 音声ファイルを読み込み中...';
        playBtn.disabled = true;
        try {
          const res = await fetch(demoAudioUrl);
          const arraybuf = await res.arrayBuffer();
          soundBuffer = await audioCtx.decodeAudioData(arraybuf);
          status.textContent = '読み込み完了';
        } catch (err) {
          console.error('[Reverb Story]', err);
          status.textContent = '⚠️ 音声ファイルの読み込みに失敗しました';
          playBtn.disabled = false;
          return;
        }
        playBtn.disabled = false;
      }

      // 初回再生
      if (!isPlaying) {
        audioSource = audioCtx.createBufferSource();
        audioSource.buffer = soundBuffer;
        audioSource.loop = true;
        reconnect(args.enabled);
        audioSource.start();
        isPlaying = true;
        await audioCtx.resume();
        playBtn.textContent = '⏸ Pause';
        playBtn.style.background = '#fb923c';
        status.textContent = `再生中 — ${args.enabled ? 'Reverb ON' : 'Dry only'}`;
        return;
      }

      // 一時停止 / 再開
      if (audioCtx.state === 'running') {
        await audioCtx.suspend();
        playBtn.textContent = '▶ Play';
        playBtn.style.background = '#4ade80';
        status.textContent = '一時停止中';
      } else {
        await audioCtx.resume();
        playBtn.textContent = '⏸ Pause';
        playBtn.style.background = '#fb923c';
        status.textContent = `再生中 — ${args.enabled ? 'Reverb ON' : 'Dry only'}`;
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

/**
 * デフォルト設定のデモ。
 * Controls パネルで全パラメータをリアルタイム変更できます。
 */
export const Default: Story = {
  name: 'デフォルト設定',
};

/**
 * 大きなホールのリバーブ。
 * time を長く、decay を大きくし、ローパスフィルタで高域を落とします。
 */
export const LargeHall: Story = {
  name: 'ラージホール',
  args: {
    time: 8,
    decay: 6,
    mix: 0.65,
    noise: 'pink',
    filterType: 'lowpass',
    filterFreq: 6000,
  },
};

/**
 * 狭い部屋のリバーブ。
 * 短い IR と低い mix で自然な残響感を演出します。
 */
export const SmallRoom: Story = {
  name: 'スモールルーム',
  args: {
    time: 1,
    decay: 1,
    mix: 0.25,
    noise: 'white',
    filterType: 'highpass',
    filterFreq: 200,
  },
};

/**
 * リバースリバーブ。
 * IR を逆転させることで、音の前にリバーブが立ち上がる独特のサウンドになります。
 */
export const ReverseReverb: Story = {
  name: 'リバースリバーブ',
  args: {
    reverse: true,
    time: 3,
    decay: 4,
    mix: 0.6,
    noise: 'blue',
  },
};

/**
 * ドライ（リバーブなし）の比較用。
 * enabled を切り替えてリバーブあり / なしを比較できます。
 */
export const DrySignal: Story = {
  name: 'ドライ信号（比較用）',
  args: {
    enabled: false,
    mix: 0,
  },
};
