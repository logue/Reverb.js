import * as THREE from 'three';
import Reverb from '@/index.js';
import type { NoiseType } from '@/NoiseType.js';

const defaultAudioFile = '/demo.flac';
const spectrumBins = 96;
const maxLines = 140;
const zStep = 3;
const canvasAspectRatio = 16 / 9;
const canvasMaxHeight = 480;
const maxSpectrumFrequencyHz = 20_000;

const playButton = document.getElementById('play') as HTMLButtonElement | null;
const stopButton = document.getElementById('stop') as HTMLButtonElement | null;
const fileInput = document.getElementById('file') as HTMLInputElement | null;

playButton?.setAttribute('disabled', 'disabled');
stopButton?.setAttribute('disabled', 'disabled');

window.addEventListener('load', async () => {
  // Create and unlock WebAudio context.
  const audioContext = new globalThis.AudioContext();

  const initAudioContext = () => {
    document.removeEventListener('touchstart', initAudioContext);
    const emptySource = audioContext.createBufferSource();
    emptySource.start();
    emptySource.stop();
  };
  document.addEventListener('touchstart', initAudioContext);

  const audio = new Audio();
  audio.loop = true;
  const source = audioContext.createMediaElementSource(audio);
  const analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 2048;
  analyserNode.smoothingTimeConstant = 0.8;

  const reverb = new Reverb(audioContext);

  const canvas = document.getElementById('graph') as HTMLCanvasElement | null;
  if (!canvas) {
    return;
  }

  // Initialize Three.js renderer stack.
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  });
  renderer.setPixelRatio(globalThis.devicePixelRatio || 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050812);
  scene.fog = new THREE.Fog(0x050812, 360, 900);

  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 2200);
  camera.position.set(0, 120, 420);
  camera.lookAt(0, 40, 0);

  const ambient = new THREE.AmbientLight(0x6f88aa, 0.5);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0x9ec3ff, 0.7);
  key.position.set(240, 260, 160);
  scene.add(key);

  const grid = new THREE.GridHelper(560, 16, 0x24496a, 0x112a3f);
  grid.position.set(0, -8, 120);
  scene.add(grid);

  const linesGroup = new THREE.Group();
  scene.add(linesGroup);

  const frequencyData = new Uint8Array(analyserNode.frequencyBinCount);
  const nyquistFrequencyHz = audioContext.sampleRate / 2;
  const clampedMaxFrequencyHz = Math.min(
    maxSpectrumFrequencyHz,
    nyquistFrequencyHz,
  );
  const maxSpectrumDataIndex = Math.max(
    1,
    Math.floor(
      (clampedMaxFrequencyHz / nyquistFrequencyHz) * (frequencyData.length - 1),
    ),
  );
  const spectralLines: { line: THREE.Line; z: number }[] = [];
  let timelineZ = 0;

  // Keep the canvas in 16:9 and cap height at 480px.
  const resizeRenderer = (observedWidth?: number) => {
    const fallbackWidth =
      canvas.parentElement?.clientWidth ?? canvas.clientWidth;
    const availableWidth = Math.max(
      320,
      Math.floor(observedWidth ?? fallbackWidth ?? 960),
    );
    const maxWidthFromHeight = Math.floor(canvasMaxHeight * canvasAspectRatio);
    const width = Math.min(availableWidth, maxWidthFromHeight);
    const height = Math.floor(width / canvasAspectRatio);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const resizeTarget = canvas.parentElement ?? canvas;
  const resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) {
      return;
    }
    resizeRenderer(entry.contentRect.width);
  });
  resizeObserver.observe(resizeTarget);
  resizeRenderer(resizeTarget.clientWidth);

  // Toggle reverb routing while preserving analyzer output.
  const setReverb = () => {
    source.disconnect();

    if (
      (document.getElementById('reverb') as HTMLInputElement | null)?.checked
    ) {
      reverb.connect(source).connect(analyserNode);
    } else {
      const node = reverb.disconnect(source);
      node?.connect(analyserNode);
    }

    analyserNode.connect(audioContext.destination);
  };

  // Append one spectrum slice and push it toward the depth axis.
  const addSpectrumLine = () => {
    analyserNode.getByteFrequencyData(frequencyData);

    const positions = new Float32Array(spectrumBins * 3);
    for (let i = 0; i < spectrumBins; i += 1) {
      const t = i / (spectrumBins - 1);
      const mapped = t * t;
      const index = Math.min(
        maxSpectrumDataIndex,
        Math.floor(mapped * maxSpectrumDataIndex),
      );
      const x = (t - 0.5) * 420;
      const y = (frequencyData[index] / 255) * 130 + 2;

      const base = i * 3;
      positions[base] = x;
      positions[base + 1] = y;
      positions[base + 2] = timelineZ;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const reverbEnabled = (
      document.getElementById('reverb') as HTMLInputElement | null
    )?.checked;
    const color = reverbEnabled ? 0x32d3ff : 0x5bff88;
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.9,
    });

    const line = new THREE.Line(geometry, material);
    linesGroup.add(line);
    spectralLines.push({ line, z: timelineZ });

    while (spectralLines.length > maxLines) {
      const removed = spectralLines.shift();
      if (!removed) {
        break;
      }
      linesGroup.remove(removed.line);
      removed.line.geometry.dispose();
      (removed.line.material as THREE.Material).dispose();
    }

    timelineZ += zStep;
  };

  // Move camera with the timeline so the scene continuously scrolls.
  const updateCamera = () => {
    const targetZ = timelineZ - 140;
    camera.position.z = timelineZ + 280;
    camera.lookAt(0, 44, targetZ);
    grid.position.z = timelineZ - 20;
  };

  // Main render loop.
  const render = () => {
    addSpectrumLine();
    updateCamera();
    renderer.render(scene, camera);
    globalThis.requestAnimationFrame(render);
  };
  render();

  let currentObjectUrl: string | null = null;
  // Load local/remote audio and keep object URL lifecycle safe.
  const loadSample = async (input: File | string) => {
    playButton?.setAttribute('disabled', 'disabled');
    stopButton?.setAttribute('disabled', 'disabled');

    audio.pause();

    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }

    if (input instanceof File) {
      currentObjectUrl = URL.createObjectURL(input);
      audio.src = currentObjectUrl;
    } else {
      audio.src = input;
    }

    await new Promise<void>((resolve, reject) => {
      const onReady = () => {
        audio.removeEventListener('canplaythrough', onReady);
        audio.removeEventListener('error', onError);
        resolve();
      };

      const onError = () => {
        audio.removeEventListener('canplaythrough', onReady);
        audio.removeEventListener('error', onError);
        reject(new Error('Failed to load audio source.'));
      };

      audio.addEventListener('canplaythrough', onReady, { once: true });
      audio.addEventListener('error', onError, { once: true });
      audio.load();
    });

    playButton?.removeAttribute('disabled');
    stopButton?.removeAttribute('disabled');
  };

  await loadSample(defaultAudioFile);

  playButton?.addEventListener('click', async () => {
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    setReverb();
    await audio.play();
  });

  stopButton?.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
  });

  fileInput?.addEventListener('change', async (event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) {
      return;
    }
    await loadSample(file);
  });

  document.getElementById('reverb')?.addEventListener('click', setReverb);

  document.getElementById('reverse')?.addEventListener('click', (event) => {
    reverb.reverse((event.target as HTMLInputElement).checked);
  });

  document.getElementById('time')?.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    reverb.time(Number(target.value));
    target.title = target.value;
  });

  document.getElementById('decay')?.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    reverb.decay(Number(target.value));
    target.title = target.value;
  });

  document.getElementById('delay')?.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    reverb.delay(Number(target.value));
    target.title = target.value;
  });

  document.getElementById('filter')?.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    reverb.filterType(target.value as BiquadFilterType | undefined);
    target.title = target.value;
  });

  document.getElementById('freq')?.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    reverb.filterFreq(Number(target.value));
    target.title = target.value;
  });

  document.getElementById('q')?.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    reverb.filterQ(Number(target.value));
    target.title = target.value;
  });

  document.getElementById('mix')?.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    reverb.mix(Number(target.value));
    target.title = target.value;
  });

  document.querySelectorAll('[name=noise]').forEach((dom) => {
    dom.addEventListener('click', (event) => {
      const target = event.target as HTMLInputElement;
      const peaks = document.getElementById('peaks') as HTMLInputElement | null;
      if (peaks) {
        peaks.disabled = target.value === 'white';
      }
      reverb.setNoise(target.value as NoiseType);
    });
  });

  document.getElementById('peaks')?.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    reverb.peaks(Number(target.value));
    target.title = target.value;
  });

  document.getElementById('scale')?.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    reverb.scale(Number(target.value));
    target.title = target.value;
  });
});
