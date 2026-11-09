/**
 * Igloo 3D Wireframe Loader (Three.js WebGL)
 * Reverse engineered from igloo.inc
 */

(function (window, document) {
  const IglooLoader = {
    options: {
      autoStart: true,
      minDisplayTime: 1800, // ms
      sound: true,
      dracoPath: '/libs/draco/',
      modelPath: '/assets/igloo/',
      audioPath: '/assets/audio/ui-short.ogg',
      onComplete: null
    },

    progress: 0,
    isComplete: false,
    startTime: Date.now(),

    init: function (userOptions) {
      this.options = Object.assign({}, this.options, userOptions);
      this.injectDOM();
      this.loadScripts(() => {
        this.initThree();
        if (this.options.autoStart) {
          this.simulateProgress();
        }
      });
    },

    injectDOM: function () {
      if (document.getElementById('igloo-loader-overlay')) return;

      const overlay = document.createElement('div');
      overlay.id = 'igloo-loader-overlay';
      overlay.innerHTML = `
        <div id="igloo-canvas-container"></div>
        <div class="igloo-loader-ui">
          <div class="igloo-loader-brand">Loading System</div>
          <div class="igloo-progress-bar-wrap">
            <div class="igloo-progress-bar-fill" id="igloo-progress-fill"></div>
          </div>
          <div class="igloo-percentage-text" id="igloo-percentage-text">0%</div>
        </div>
      `;
      document.body.prepend(overlay);
    },

    loadScripts: function (callback) {
      const loadScript = (url, cb) => {
        const s = document.createElement('script');
        s.src = url;
        s.onload = cb;
        document.head.appendChild(s);
      };

      if (!window.THREE) {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', () => {
          if (!window.THREE.DRACOLoader) {
            loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js', callback);
          } else {
            callback();
          }
        });
      } else if (!window.THREE.DRACOLoader) {
        loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js', callback);
      } else {
        callback();
      }
    },

    initThree: function () {
      const container = document.getElementById('igloo-canvas-container');
      if (!container) return;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x686e77, 0.04);

      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      this.camera.position.set(0, 5, 9);
      this.camera.lookAt(0, 0.5, 0);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(width, height);
      container.appendChild(this.renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 0.85);
      this.scene.add(ambient);

      const point = new THREE.PointLight(0xffffff, 3.5, 15);
      point.position.set(0, 3.5, 0);
      this.scene.add(point);

      this.iglooGroup = new THREE.Group();
      this.scene.add(this.iglooGroup);

      const dracoLoader = new THREE.DRACOLoader();
      dracoLoader.setDecoderPath(this.options.dracoPath);

      const wireframeMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        linewidth: 1.5
      });

      const cageMat = new THREE.LineBasicMaterial({
        color: 0xe0e6ed,
        transparent: true,
        opacity: 0.5,
        linewidth: 1
      });

      // 1. Load Main Igloo Mesh
      dracoLoader.load(this.options.modelPath + 'igloo.drc', (geometry) => {
        geometry.computeVertexNormals();
        const baseMat = new THREE.MeshStandardMaterial({
          color: 0xdde3ea,
          roughness: 0.4,
          metalness: 0.1,
          transparent: true,
          opacity: 0.75
        });
        const mesh = new THREE.Mesh(geometry, baseMat);
        this.iglooGroup.add(mesh);

        const wireframeGeom = new THREE.WireframeGeometry(geometry);
        const lines = new THREE.LineSegments(wireframeGeom, wireframeMat);
        this.iglooGroup.add(lines);
      });

      // 2. Load Wireframe Cage
      dracoLoader.load(this.options.modelPath + 'igloo_cage.drc', (geometry) => {
        const cageLines = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), cageMat);
        this.iglooGroup.add(cageLines);
      });

      // 3. Load Outlines
      dracoLoader.load(this.options.modelPath + 'igloo_outline.drc', (geometry) => {
        const outlineLines = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), new THREE.LineBasicMaterial({
          color: 0xffffff,
          linewidth: 2,
          transparent: true,
          opacity: 0.95
        }));
        this.iglooGroup.add(outlineLines);
      });

      // 4. Ground Network
      this.createGroundNetwork();

      // 5. Glowing Central Dome
      const glowSphereGeom = new THREE.SphereGeometry(1.05, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const glowDome = new THREE.Mesh(glowSphereGeom, new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.92
      }));
      glowDome.position.set(0, 0.4, 0);
      this.iglooGroup.add(glowDome);

      // Glow halo
      const canvasGlow = document.createElement('canvas');
      canvasGlow.width = 128;
      canvasGlow.height = 128;
      const ctx = canvasGlow.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
      grad.addColorStop(0.7, 'rgba(230, 240, 255, 0.2)');
      grad.addColorStop(1, 'rgba(230, 240, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);

      const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(canvasGlow),
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      }));
      glowSprite.scale.set(4, 4, 1);
      glowSprite.position.set(0, 1.2, 0);
      this.iglooGroup.add(glowSprite);

      window.addEventListener('resize', () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      });

      this.clock = new THREE.Clock();
      const tick = () => {
        if (!this.isComplete) {
          requestAnimationFrame(tick);
          const dt = this.clock.getDelta();
          if (this.iglooGroup) {
            this.iglooGroup.rotation.y += dt * 0.25;
          }
          this.renderer.render(this.scene, this.camera);
        }
      };
      tick();
    },

    createGroundNetwork: function () {
      const group = new THREE.Group();
      const points = [];
      const nodeCount = 45;
      const radius = 5.5;

      for (let i = 0; i < nodeCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 1.8 + Math.random() * radius;
        const x = Math.cos(angle) * dist;
        const z = Math.sin(angle) * dist;
        const y = (Math.random() - 0.5) * 0.4;
        points.push(new THREE.Vector3(x, y, z));
      }

      const linePositions = [];
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          if (points[i].distanceTo(points[j]) < 2.0) {
            linePositions.push(points[i].x, points[i].y, points[i].z);
            linePositions.push(points[j].x, points[j].y, points[j].z);
          }
        }
      }

      const lineGeom = new THREE.BufferGeometry();
      lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      group.add(new THREE.LineSegments(lineGeom, new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.45
      })));

      const dotGeom = new THREE.BufferGeometry();
      const dotPositions = [];
      points.forEach(p => dotPositions.push(p.x, p.y, p.z));
      dotGeom.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
      group.add(new THREE.Points(dotGeom, new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.08,
        transparent: true,
        opacity: 0.8
      })));

      this.iglooGroup.add(group);
    },

    setProgress: function (value) {
      this.progress = Math.min(100, Math.max(0, value));
      const fill = document.getElementById('igloo-progress-fill');
      const text = document.getElementById('igloo-percentage-text');
      if (fill) fill.style.width = this.progress + '%';
      if (text) text.textContent = Math.round(this.progress) + '%';

      if (this.progress >= 100) {
        this.finish();
      }
    },

    simulateProgress: function () {
      const interval = setInterval(() => {
        const inc = Math.floor(Math.random() * 8) + 4;
        this.progress += inc;
        if (this.progress >= 100) {
          clearInterval(interval);
          this.setProgress(100);
        } else {
          this.setProgress(this.progress);
        }
      }, 65);
    },

    finish: function () {
      const elapsed = Date.now() - this.startTime;
      const remaining = Math.max(0, this.options.minDisplayTime - elapsed);

      setTimeout(() => {
        const overlay = document.getElementById('igloo-loader-overlay');
        if (overlay) {
          overlay.classList.add('fade-out');
        }

        if (this.options.sound && window.Audio) {
          try {
            const audio = new Audio(this.options.audioPath);
            audio.volume = 0.4;
            audio.play().catch(() => {});
          } catch (e) {}
        }

        setTimeout(() => {
          this.isComplete = true;
          if (typeof this.options.onComplete === 'function') {
            this.options.onComplete();
          }
        }, 800);
      }, remaining);
    }
  };

  window.IglooLoader = IglooLoader;
})(window, document);

