import Reverb from '@/index';
import type { NoiseType } from '@/NoiseType';
import audioFile from './demo.flac';

const playButton = document.getElementById('play') as HTMLButtonElement | null;
playButton?.setAttribute('disabled', 'disabled');

const getInputElement = (id: string): HTMLInputElement | null =>
  document.getElementById(id) as HTMLInputElement | null;

const bindNumberInput = (
  id: string,
  onChange: (value: number) => void,
): void => {
  getInputElement(id)?.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    onChange(Number(target.value));
    target.title = target.value;
  });
};

const bindNoiseSelection = (onSelect: (value: NoiseType) => void): void => {
  document
    .querySelectorAll<HTMLInputElement>('[name=noise]')
    .forEach((element) => {
      element.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) {
          return;
        }

        const peaks = getInputElement('peaks');
        if (peaks) {
          peaks.disabled = target.value === 'white';
        }
        onSelect(target.value as NoiseType);
      });
    });
};

window.addEventListener('load', async () => {
  // Setup Audio Context
  const audioContext = new globalThis.AudioContext();

  // Defreeze AudioContext for iOS.
  const initAudioContext = () => {
    document.removeEventListener('touchstart', initAudioContext);
    // wake up AudioContext
    const emptySource = audioContext.createBufferSource();
    emptySource.start();
    emptySource.stop();
  };
  document.addEventListener('touchstart', initAudioContext);

  // Setup Reverb Class
  const reverb = new Reverb(audioContext);
  console.info(
    `Reverb.js loaded. (version: ${Reverb.version} / build: ${Reverb.build})`,
  );
  const audioSource = audioContext.createBufferSource();

  // Load audio file and decode asyncly.
  const loadSample = async (url: string): Promise<AudioBuffer> => {
    playButton?.setAttribute('disabled', 'disabled');

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await audioContext.decodeAudioData(arrayBuffer);
    playButton?.removeAttribute('disabled');
    return buffer;
  };

  // Draw FFT to canvas
  // Code taken from https://www.g200kg.com/jp/docs/webaudio/filter.html
  const analyserNode = audioContext.createAnalyser();
  const canvas = document.getElementById('graph') as HTMLCanvasElement | null;
  const canvasContext = canvas?.getContext('2d');

  const analysedData = new Float32Array(1024);
  const drawGraph = () => {
    if (!canvas || !canvasContext) {
      return;
    }

    analyserNode.getFloatFrequencyData(analysedData);
    canvasContext.fillStyle = '#343a40';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.fillStyle =
      (getInputElement('reverb')?.checked ?? false) ? '#17a2b8' : '#28a745';

    for (let index = 0; index < canvas.width; index += 1) {
      const y = canvas.height / 2 + (analysedData[index] + 48.16) * 2.56;
      canvasContext.fillRect(index, canvas.height - y, 1, y);
    }

    for (let dB = -50; dB < 50; dB += 10) {
      const y = Math.trunc(canvas.height / 2 - (dB * canvas.height) / 100);
      canvasContext.fillStyle = '#6c757d';
      canvasContext.fillRect(20, y, canvas.width, 1);
      canvasContext.fillStyle = '#fd7e14';
      canvasContext.fillText(`${dB}dB`, 5, y);
    }

    canvasContext.fillStyle = '#ffc107';
    canvasContext.fillRect(20, canvas.height / 2, canvas.width, 1);

    for (let freq = 2200; freq < audioContext.sampleRate / 2; freq += 2000) {
      const x = Math.trunc(
        (freq * (canvas.width * 2)) / audioContext.sampleRate,
      );
      canvasContext.fillStyle = '#6c757d';
      canvasContext.fillRect(x, 0, 1, canvas.height - 10);
      if (x % 4 === 0) {
        canvasContext.fillStyle = '#e83e8c';
        canvasContext.fillText(`${freq / 1000}kHz`, x, 10, canvas.height - 1);
      }
    }
  };

  const setReverb = () => {
    audioSource.disconnect();

    if (getInputElement('reverb')?.checked) {
      reverb.connect(audioSource).connect(analyserNode);
    } else {
      const node = reverb.disconnect(audioSource);
      if (node) {
        node.connect(analyserNode);
      }
    }
    analyserNode.connect(audioContext.destination);
  };

  const sound = await loadSample(audioFile);
  setInterval(drawGraph, 10);

  playButton?.addEventListener(
    'click',
    (event) => {
      if (playButton.disabled || event.target !== event.currentTarget) {
        return;
      }

      if (audioSource.buffer == null) {
        audioSource.buffer = sound;
        audioSource.loop = true;
        setReverb();
        audioSource.start();
      }

      if (audioContext.state === 'running') {
        audioContext.suspend().then(() => {
          (event.target as HTMLElement).innerHTML =
            '<em class="bi bi-play"></em> Play';
        });
      } else if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          (event.target as HTMLElement).innerHTML =
            '<em class="bi bi-pause"></em> Pause';
        });
      }
    },
    false,
  );

  getInputElement('reverb')?.addEventListener('click', setReverb);
  getInputElement('reverse')?.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      reverb.reverse(target.checked);
    }
  });

  bindNumberInput('time', (value) => reverb.time(value));
  bindNumberInput('decay', (value) => reverb.decay(value));
  bindNumberInput('delay', (value) => reverb.delay(value));
  getInputElement('filter')?.addEventListener('change', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      reverb.filterType(target.value as BiquadFilterType | undefined);
      target.title = target.value;
    }
  });
  bindNumberInput('freq', (value) => reverb.filterFreq(value));
  bindNumberInput('q', (value) => reverb.filterQ(value));
  bindNumberInput('mix', (value) => reverb.mix(value));
  bindNoiseSelection((value) => reverb.setNoise(value));
  bindNumberInput('peaks', (value) => reverb.peaks(value));
  bindNumberInput('scale', (value) => reverb.scale(value));
});
