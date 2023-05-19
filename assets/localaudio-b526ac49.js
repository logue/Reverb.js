import { R as Reverb } from './Reverb-0922ae82.js';

// Setup Audio Context
      const AudioCtx = new AudioContext();

      // Defreeze AudioContext for iOS.
      document.addEventListener('touchstart', initAudioContext);
      function initAudioContext() {
        document.removeEventListener('touchstart', initAudioContext);
        // wake up AudioContext
        const emptySource = AudioCtx.createBufferSource();
        emptySource.start();
        emptySource.stop();
      }

      // Audio object
      const audio = new Audio();

      // Audio Source
      const AudioSrc = AudioCtx.createMediaElementSource(audio);

      // Analyzer Node
      const AnalyserNode = AudioCtx.createAnalyser();

      // Setup Reverb Class
      const reverb = new Reverb(AudioCtx);

      // decode audio
      const LoadSample = async input => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
        audio.src = await loadDataUri(input);
      };

      // Load array buffer
      const loadDataUri = async input => {
        document.getElementById('play').disabled = 'disabled';
        document.getElementById('stop').disabled = 'disabled';
        return await new Promise(resolve => {
          if (input instanceof File) {
            const reader = new FileReader();
            reader.onload = event => {
              resolve(event.target.result);
              document.getElementById('play').disabled = '';
              document.getElementById('stop').disabled = '';
            };
            reader.readAsDataURL(input);
          } else {
            fetch(input)
              .then(response => {
                return {
                  mime: response.headers.get('content-type'),
                  buffer: response.arrayBuffer(),
                };
              })
              .then(res => {
                // to base64
                let binary = '';
                let bytes = [].slice.call(new Uint8Array(res.buffer));

                bytes.forEach(b => (binary += String.fromCharCode(b)));
                const base64 = window.btoa(binary);
                // prepend data scheme
                resolve('data:' + res.mime + ';base64;' + base64);

                document.getElementById('play').disabled = '';
                document.getElementById('stop').disabled = '';
              });
          }
        }).catch(e => alert(e));
      };

      const handleFileSelect = async e => {
        const file = e.target.files[0];
        AudioSrc.buffer = await LoadSample(file);
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

      /** Draw Texture Functions */
      const PIXEL_RATIO = () => {
        const ctx = document.createElement('canvas').getContext('2d'),
          dpr = window.devicePixelRatio || 1,
          bsr =
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio ||
            1;
        return dpr / bsr;
      };

      // Create retina quality canvas
      const createRetinaCanvas = (w, h, ratio) => {
        if (!ratio) {
          ratio = PIXEL_RATIO;
        }
        const canvas = document.getElementById('canvas');
        //const canvas = document.createElement('canvas');
        canvas.width = w * ratio;
        canvas.height = h * ratio;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
        return canvas;
      };

      // Spectrum Analysis canvas size
      const SPRITE_HEIGHT = 256;
      const SPRITE_WIDTH = 512;

      // Sprite Canvas
      const spriteCanvas = createRetinaCanvas(SPRITE_WIDTH, SPRITE_HEIGHT);

      // Draw Graph
      const DrawGraph = () => {
        const AnalyseData = new Float32Array(1024);
        AnalyserNode.getFloatFrequencyData(AnalyseData);

        const sprite = spriteCanvas.getContext('2d', { antialias: false });

        // Background
        //sprite.fillStyle = "#343a40";
        //sprite.fillRect(0, 0, SPRITE_WIDTH, SPRITE_HEIGHT);

        sprite.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);

        // Graph
        const grad = sprite.createLinearGradient(0, 0, spriteCanvas.width, 0);
        grad.addColorStop(0, 'rgb(255, 0, 0)');
        grad.addColorStop(0.2, 'rgb(255, 255, 0)');
        grad.addColorStop(0.4, 'rgb(0, 255, 0)');
        grad.addColorStop(0.6, 'rgb(0, 255, 255)');
        grad.addColorStop(0.8, 'rgb(0, 0, 255)');
        grad.addColorStop(1, 'rgb(255, 0, 255)');
        sprite.fillStyle = grad;
        //sprite.fillStyle = document.getElementById('reverb').checked ? "#17a2b8" : "#28a745";

        for (let i = 0; i < spriteCanvas.width; ++i) {
          (AudioCtx.sampleRate * i) / 1024;
          let y = 128 + (AnalyseData[i] + 48.16) * 2.56 + 1;
          sprite.fillRect(i, spriteCanvas.height - y, 1, y);
        }

        return spriteCanvas.toDataURL();
      };

      // Draw Axis
      const DrawAxis = () => {
        const sprite = spriteCanvas.getContext('2d', { antialias: false });
        // y axis (dB)
        for (let d = -50; d < 50; d += 10) {
          const y = (SPRITE_HEIGHT / 2 - (d * SPRITE_HEIGHT) / 100) | 0;
          // Line
          sprite.fillStyle = '#6c757d';
          sprite.fillRect(20, y, SPRITE_WIDTH, 1);
          // Label
          sprite.fillStyle = '#fd7e14';
          sprite.fillText(d + 'dB', 5, y);
        }
        sprite.fillStyle = '#ffc107';
        sprite.fillRect(20, SPRITE_HEIGHT / 2, SPRITE_WIDTH, 1);

        // x axis (frequency)
        for (let f = 2000; f < AudioCtx.sampleRate / 2; f += 2000) {
          const x = ((f * 1024) / AudioCtx.sampleRate) | 0;
          // Line
          sprite.fillStyle = '#6c757d';
          sprite.fillRect(x, 0, 1, 245);
          // Label
          sprite.fillStyle = '#e83e8c';
          sprite.fillText(f / 1000 + 'kHz', x - 10, 255);
        }

        return spriteCanvas.toDataURL();
      };

      // スプライトのデバッグ
      const debug = src => {
        const canvas = document.getElementById('canvas');
        canvas.style.width = SPRITE_WIDTH + 'px';
        canvas.style.height = SPRITE_HEIGHT + 'px';
        canvas.width = SPRITE_WIDTH;
        canvas.height = SPRITE_HEIGHT;

        const img = document.getElementById('test');
        img.style.width = SPRITE_WIDTH + 'px';
        img.style.height = SPRITE_HEIGHT + 'px';
        img.src = src;
        //ctx.clearRect(0, 0, canvas.width, canvas.height);

        const image = new Image();
        image.addEventListener('load', () => {
          canvas.getContext('2d').drawImage(image, 0, 0); // Or at whatever offset you like
        });
        image.src = src;
      };

      /** 3D Spectrum Analyzer Code */

      // 3D canvas size
      const CANVAS_WIDTH = 960;
      const CANVAS_HEIGHT = 540;

      // Create renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#graph'),
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);

      // Create Scene
      const scene = new THREE.Scene();

      // Create camera
      const camera = new THREE.PerspectiveCamera(
        30,
        CANVAS_WIDTH / CANVAS_HEIGHT,
        1,
        2000
      );
      // Move Initial camera position (x, y, z)
      camera.position.set(100, 50, 1000);
      //const camera = new THREE.OrthographicCamera(-CANVAS_WIDTH, CANVAS_WIDTH, CANVAS_HEIGHT, -CANVAS_HEIGHT, 1, 100000);

      // Append Fog
      // new THREE.Fog(color, start distance, end distance);
      scene.fog = new THREE.Fog(0x000000, 1000, 2000);

      //debug(DrawAxis())

      const AxisMesh = new THREE.Mesh(
        // Plane
        new THREE.PlaneGeometry(SPRITE_WIDTH, SPRITE_HEIGHT, 5, 5),
        // Texture
        new THREE.MeshBasicMaterial({
          transparent: true,
          needsUpdate: true,
          map: new THREE.TextureLoader().load(DrawAxis()),
          side: THREE.DoubleSide,
        })
      );

      // Move Mesh object
      AxisMesh.position.set(0, 0, 0);

      scene.add(AxisMesh);

      let depth = 0;
      let geometries = [];
      let materials = [];
      let textures = [];
      let meshs = [];

      const MAX_DEPTH = 1024;

      // Loop event
      const tick = () => {
        // Draw Texture image
        const sprite = DrawGraph();

        debug(sprite);

        textures[depth] = new THREE.TextureLoader().load(sprite);

        geometries[depth] = new THREE.PlaneGeometry(
          SPRITE_WIDTH,
          SPRITE_HEIGHT,
          5,
          5
        );

        materials[depth] = new THREE.MeshBasicMaterial({
          color: 0xccddee,
          transparent: true,
          needsUpdate: true,
          map: textures[depth],
          side: THREE.DoubleSide,
        });

        // Mesh object
        meshs[depth] = new THREE.Mesh(geometries[depth], materials[depth]);

        // Move Mesh object
        meshs[depth].position.set(0, 0, depth);
        AxisMesh.position.set(0, 0, depth);

        // Append Mesh object to 3D scene
        scene.add(meshs[depth]);

        // Render
        renderer.render(scene, camera);

        // Move Camera
        camera.position.z = depth + 650;
        //camera.zoom = 2;
        camera.updateProjectionMatrix();

        // Look to origin
        camera.lookAt(new THREE.Vector3(0, 0, depth));

        // Remove old Mesh
        if (depth > MAX_DEPTH) {
          scene.remove(meshs[depth - MAX_DEPTH]);
          //meshs[depth - MAX_DEPTH].dispose();
          geometries[depth - MAX_DEPTH].dispose();
          materials[depth - MAX_DEPTH].dispose();
          textures[depth - MAX_DEPTH].dispose();

          // Manual Gabarge Collection
          delete geometries[depth - MAX_DEPTH];
          delete materials[depth - MAX_DEPTH];
          delete textures[depth - MAX_DEPTH];
        }

        // incriment depth
        depth++;

        // Update Animation
        requestAnimationFrame(tick);
      };

      // Regist Event
      window.addEventListener('load', async () => {
        audio.src = await LoadSample('./demo.flac');
        // Play button
        document.getElementById('play').addEventListener('click', async () => {
          if (AudioCtx.state == 'suspended') AudioCtx.resume();
          setReverb();
          audio.play();
        });

        // Stop button
        document.getElementById('stop').addEventListener('click', () => {
          audio.stop();
        });

        // File form
        document.getElementById('file').addEventListener('dragover', e => {
          e.stopPropagation();
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          return false;
        });
        document
          .getElementById('file')
          .addEventListener('drag', handleFileSelect, false);
        document
          .getElementById('file')
          .addEventListener('change', handleFileSelect, false);

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

        // Execute Animation Thread
        tick();
      });
