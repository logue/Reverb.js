import type { NoiseType } from '@/NoiseType';
import Reverb from '../index';
import audioFile from '@/docs/demo.flac';

document.getElementById('play')?.setAttribute('disabled', 'disabled');

window.addEventListener('load', async () => {
  // Setup Audio Context
  const AudioCtx = new globalThis.AudioContext();

  // Defreeze AudioContext for iOS.
  document.addEventListener('touchstart', initAudioContext);
  function initAudioContext() {
    document.removeEventListener('touchstart', initAudioContext);
    // wake up AudioContext
    const emptySource = AudioCtx.createBufferSource();
    emptySource.start();
    emptySource.stop();
  }

  // Setup Reverb Class
  const reverb = new Reverb(AudioCtx);
  console.info(
    `Reverb.js loaded. (version: ${Reverb.version} / build: ${Reverb.build})`,
  );
  const AudioSrc = AudioCtx.createBufferSource();

  // Load audio file and decode asyncly.
  const LoadSample = async (url: string): Promise<AudioBuffer> => {
    const response = await fetch(url);
    const arraybuf = await response.arrayBuffer();
    const buffer = await AudioCtx.decodeAudioData(arraybuf);
    document.getElementById('play')?.removeAttribute('disabled');
    return buffer;
  };

  // Draw FFT to canvas
  // Code taken from https://www.g200kg.com/jp/docs/webaudio/filter.html
  const AnalyserNode = AudioCtx.createAnalyser();
  const canvas = document.getElementById('graph') as HTMLCanvasElement | null;
  const canvasContext = canvas?.getContext('2d');

  const analysedata = new Float32Array(1024);
  const DrawGraph = () => {
    if (!canvas || !canvasContext) {
      return;
    }

    AnalyserNode.getFloatFrequencyData(analysedata);
    // Background
    canvasContext.fillStyle = '#343a40';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    // FFT Graph
    canvasContext.fillStyle = (
      document.getElementById('reverb') as HTMLInputElement | null
    )?.checked
      ? '#17a2b8'
      : '#28a745';
    for (let i = 0; i < canvas.width; ++i) {
      const y = canvas.height / 2 + (analysedata[i] + 48.16) * 2.56;
      canvasContext.fillRect(i, canvas.height - y, 1, y);
    }

    // y axis (dB)
    for (let d = -50; d < 50; d += 10) {
      const y = Math.trunc(canvas.height / 2 - (d * canvas.height) / 100);
      // Line
      canvasContext.fillStyle = '#6c757d';
      canvasContext.fillRect(20, y, canvas.width, 1);
      // Label
      canvasContext.fillStyle = '#fd7e14';
      canvasContext.fillText(`${d}dB`, 5, y);
    }
    canvasContext.fillStyle = '#ffc107';
    canvasContext.fillRect(20, canvas.height / 2, canvas.width, 1);

    // x axis (frequency)
    for (let f = 2200; f < AudioCtx.sampleRate / 2; f += 2000) {
      const x = Math.trunc((f * (canvas.width * 2)) / AudioCtx.sampleRate);
      // Line
      canvasContext.fillStyle = '#6c757d';
      canvasContext.fillRect(x, 0, 1, canvas.height - 10);
      // Label
      if (x % 4 === 0) {
        canvasContext.fillStyle = '#e83e8c';
        canvasContext.fillText(`${f / 1000}kHz`, x, 10, canvas.height - 1);
      }
    }
  };

  // Reverb switch handler
  const setReverb = () => {
    AudioSrc.disconnect();

    if (
      (document.getElementById('reverb') as HTMLInputElement | null)?.checked
    ) {
      // Connect Reverb
      reverb.connect(AudioSrc).connect(AnalyserNode);
    } else {
      const node = reverb.disconnect(AudioSrc);
      if (node) node.connect(AnalyserNode);
    }
    AnalyserNode.connect(AudioCtx.destination);
  };

  const sound = await LoadSample(audioFile);

  // Draw FFT
  setInterval(DrawGraph, 10);

  // Play button
  document.getElementById('play')?.addEventListener(
    'click',
    (event) => {
      if (event.target !== event.currentTarget) {
        return;
      }

      if (AudioSrc.buffer == null) {
        AudioSrc.buffer = sound;
        AudioSrc.loop = true;

        setReverb();
        AudioSrc.start();
      }

      if (AudioCtx.state === 'running') {
        AudioCtx.suspend().then(() => {
          (event.target as HTMLElement).innerHTML =
            '<em class="bi bi-play"></em> Play';
        });
      } else if (AudioCtx.state === 'suspended') {
        AudioCtx.resume().then(() => {
          (event.target as HTMLElement).innerHTML =
            '<em class="bi bi-pause"></em> Pause';
        });
      }
    },
    false,
  );

  // Reverb switch button
  document.getElementById('reverb')?.addEventListener('click', setReverb);
  // Reverse checkbox
  document.getElementById('reverse')?.addEventListener('click', (e) => {
    reverb.reverse((e.target as HTMLInputElement).checked);
  });
  // Reverb duration time
  document.getElementById('time')?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    reverb.time(Number(target.value));
    target.title = target.value;
  });
  // Decay time
  document.getElementById('decay')?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    reverb.decay(Number(target.value));
    target.title = target.value;
  });
  // Delay time
  document.getElementById('delay')?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    reverb.delay(Number(target.value));
    target.title = target.value;
  });
  // Filter select box
  document.getElementById('filter')?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    reverb.filterType(target.value as BiquadFilterType | undefined);
    target.title = target.value;
  });
  // Filter frequency
  document.getElementById('freq')?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    reverb.filterFreq(Number.parseInt(target.value, 10));
    target.title = target.value;
  });
  // Filter quality
  document.getElementById('q')?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    reverb.filterQ(Number.parseInt(target.value, 10));
    target.title = target.value;
  });
  // Dry/Wet
  document.getElementById('mix')?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    reverb.mix(Number.parseInt(target.value, 10));
    target.title = target.value;
  });
  // Noise Type
  document.querySelectorAll('[name=noise]').forEach((dom) => {
    dom.addEventListener('click', (e) => {
      const target = e.target as HTMLInputElement;
      const peaks = document.getElementById('peaks') as HTMLInputElement | null;
      if (peaks) {
        peaks.disabled = target.value === 'white';
      }
      reverb.setNoise(target.value as NoiseType);
    });
  });

  document.getElementById('peaks')?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    reverb.peaks(Number.parseInt(target.value, 10));
    target.title = target.value;
  });
  document.getElementById('scale')?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    reverb.scale(Number.parseInt(target.value, 10));
    target.title = target.value;
  });
  // randomAlgorithmはNoiseTypeではないので型エラー回避のためコメントアウトまたは適切な実装に修正してください
  // document.getElementById('randomAlgorithm')?.addEventListener('change', e => {
  //   const target = e.target as HTMLInputElement;
  //   reverb.setNoise(target.value as import('./NoiseType').NoiseType);
  //   target.title = target.value;
  // });
});
