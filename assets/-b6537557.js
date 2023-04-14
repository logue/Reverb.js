import { R as Reverb } from './Reverb-9e1ec487.js';

const audioFile = new URL("/demo.flac", self.location).href;

      document.getElementById('play').setAttribute('disabled', 'disabled');

      document.addEventListener('touchstart', initAudioContext);
      function initAudioContext() {
        document.removeEventListener('touchstart', initAudioContext);
        // wake up AudioContext
        const emptySource = ctx.createBufferSource();
        emptySource.start();
        emptySource.stop();
      }

      window.addEventListener('load', async () => {
        // Setup Audio Context
        const AudioCtx = new window.AudioContext();

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
          `Reverb.js loaded. (version: ${Reverb.version} / build: ${Reverb.build})`
        );
        const AudioSrc = AudioCtx.createBufferSource();

        // Load audio file and decode asyncly.
        const LoadSample = async url => {
          return new Promise(resolve => {
            fetch(url)
              .then(response => response.arrayBuffer())
              .then(arraybuf =>
                AudioCtx.decodeAudioData(
                  arraybuf,
                  buffer => {
                    document.getElementById('play').removeAttribute('disabled');
                    resolve(buffer);
                  },
                  e => alert(e)
                )
              )
              .catch(e => alert(e));
          });
        };

        // Draw FFT to canvas
        // Code taken from https://www.g200kg.com/jp/docs/webaudio/filter.html
        const AnalyserNode = AudioCtx.createAnalyser();
        const canvas = document.getElementById('graph');
        const canvasContext = canvas.getContext('2d');

        const analysedata = new Float32Array(1024);
        const DrawGraph = () => {
          AnalyserNode.getFloatFrequencyData(analysedata);
          // Background
          canvasContext.fillStyle = '#343a40';
          canvasContext.fillRect(0, 0, canvas.width, canvas.height);
          // FFT Graph
          canvasContext.fillStyle = document.getElementById('reverb').checked
            ? '#17a2b8'
            : '#28a745';
          for (let i = 0; i < canvas.width; ++i) {
            (AudioCtx.sampleRate * i) / (canvas.width * 2);
            const y = canvas.height / 2 + (analysedata[i] + 48.16) * 2.56;
            canvasContext.fillRect(i, canvas.height - y, 1, y);
          }

          // y axis (dB)
          for (let d = -50; d < 50; d += 10) {
            const y = (canvas.height / 2 - (d * canvas.height) / 100) | 0;
            // Line
            canvasContext.fillStyle = '#6c757d';
            canvasContext.fillRect(20, y, canvas.width, 1);
            // Label
            canvasContext.fillStyle = '#fd7e14';
            canvasContext.fillText(d + 'dB', 5, y);
          }
          canvasContext.fillStyle = '#ffc107';
          canvasContext.fillRect(20, canvas.height / 2, canvas.width, 1);

          // x axis (frequency)
          for (let f = 2200; f < AudioCtx.sampleRate / 2; f += 2000) {
            const x = ((f * (canvas.width * 2)) / AudioCtx.sampleRate) | 0;
            // Line
            canvasContext.fillStyle = '#6c757d';
            canvasContext.fillRect(x, 0, 1, canvas.height - 10);
            // Label
            if (x % 4 == 0) {
              canvasContext.fillStyle = '#e83e8c';
              canvasContext.fillText(
                f / 1000 + 'kHz',
                x - 10,
                canvas.height - 1
              );
            }
          }
        };

        // Reverb switch handler
        const setReverb = () => {
          AudioSrc.disconnect();

          if (document.getElementById('reverb').checked) {
            // Connect Reverb
            reverb.connect(AudioSrc).connect(AnalyserNode);
          } else {
            reverb.disconnect(AudioSrc).connect(AnalyserNode);
          }
          AnalyserNode.connect(AudioCtx.destination);
        };

        const sound = await LoadSample(audioFile);

        // Draw FFT
        setInterval(DrawGraph, 10);

        // Play button
        document.getElementById('play').addEventListener(
          'click',
          event => {
            if (event.target != event.currentTarget) return;

            if (AudioSrc.buffer == null) {
              AudioSrc.buffer = sound;
              AudioSrc.loop = true;

              setReverb();
              AudioSrc.start();
            }

            if (AudioCtx.state === 'running') {
              AudioCtx.suspend().then(() => {
                event.target.innerHTML = '<em class="bi bi-play"></em> Play';
              });
            } else if (AudioCtx.state === 'suspended') {
              AudioCtx.resume().then(() => {
                event.target.innerHTML = '<em class="bi bi-pause"></em> Pause';
              });
            }
          },
          false
        );

        // Reverb switch button
        document.getElementById('reverb').addEventListener('click', setReverb);
        // Reverse checkbox
        document
          .getElementById('reverse')
          .addEventListener('click', e => reverb.reverse(e.target.checked));
        // Reverb dualation time
        document.getElementById('time').addEventListener('change', e => {
          reverb.time(e.target.value);
          e.target.title = e.target.value;
        });
        // Decay time
        document.getElementById('decay').addEventListener('change', e => {
          reverb.decay(e.target.value);
          e.target.title = e.target.value;
        });
        // Delay time
        document.getElementById('delay').addEventListener('change', e => {
          reverb.delay(e.target.value);
          e.target.title = e.target.value;
        });
        // Filter select box
        document.getElementById('filter').addEventListener('change', e => {
          reverb.filterType(e.target.value);
          e.target.title = e.target.value;
        });
        // Filter frequency
        document.getElementById('freq').addEventListener('change', e => {
          reverb.filterFreq(e.target.value);
          e.target.title = e.target.value;
        });
        // Filter quality
        document.getElementById('q').addEventListener('change', e => {
          reverb.filterQ(e.target.value);
          e.target.title = e.target.value;
        });
        // Dry/Wet
        document.getElementById('mix').addEventListener('change', e => {
          reverb.mix(e.target.value);
          e.target.title = e.target.value;
        });
        // Noise Type
        document.querySelectorAll('[name=noise]').forEach(dom =>
          dom.addEventListener('click', e => {
            document.getElementById('peaks').disabled =
              e.target.value === 'white';
            reverb.setNoise(e.target.value);
          })
        );

        document.getElementById('peaks').addEventListener('change', e => {
          reverb.peaks(e.target.value);
          console.log('peaks');
          e.target.title = e.target.value;
        });
        document.getElementById('scale').addEventListener('change', e => {
          reverb.scale(e.target.value);
          e.target.title = e.target.value;
        });
        document
          .getElementById('randomAlgorithm')
          .addEventListener('change', e => {
            reverb.randomAlgorithm(e.target.value);
            e.target.title = e.target.value;
          });
      });
