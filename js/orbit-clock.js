/**
 * Orbit Kinetic Clock - Inspired by quynh.moe
 * Reverse-engineered and recreated for SPEAK
 * Interactive kinetic string clock with bezier curves, spring elasticity,
 * traveling light wave pulses, and rolling slot-machine digital time.
 */

(function () {
  'use strict';

  const De = 60;
  const n5 = 360 / De;
  const o5 = 0.6;
  const O3 = 0.08;
  const i5 = (e) => (e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2);
  const l5 = (e) => (1 - O3) * i5(e ** 1.25) + O3 * e;
  const c5 = (e) => {
    const a = e + o5;
    const r = Math.floor(a);
    return r + l5(a - r);
  };
  const I3 = 0.45;
  const d5 = 0.254;
  const p5 = 0.1;
  const h5 = 0.1;
  const u5 = 0.28;
  const r4 = 59.1;
  const h3 = 1 / 60;
  const Xe = 0.5;
  const jt = 0.855;
  const Z3 = (e) => Math.max(0, 1 - 0.088 * e * jt - 1.262 * (e * jt) ** 2);
  const z3 = (e) => (0.088 + 2.524 * e * jt) * jt;
  const G3 = 0.3;
  const f5 = 14;
  const m5 = 0.15;
  const C5 = r4 + (De - 1) * h3 + Xe - 60;
  const Ot = 1.5;
  const s4 = (e) => Math.max(0, Math.min(1, e));
  const ze = (e, a, r) => {
    const n = s4((r - e) / (a - e));
    return n * n * (3 - 2 * n);
  };
  const g5 = (e) => 1 - (1 - e) ** 4;
  const It = (e) => String(e).padStart(2, '0');

  const rt = (e) => () => {
    e |= 0;
    e = (e + 1831565813) | 0;
    let a = Math.imul(e ^ (e >>> 15), 1 | e);
    return (
      (a = (a + Math.imul(a ^ (a >>> 7), 61 | a)) ^ a),
      ((a ^ (a >>> 14)) >>> 0) / 4294967296
    );
  };

  const Q3 = (e, a, r) => {
    const n = Array.from({ length: e }, (o, l) => ({
      j: l,
      k: a() * (r ? r(l) : 1),
    }));
    n.sort((o, l) => o.k - l.k);
    const s = new Array(e);
    n.forEach((o, l) => {
      s[o.j] = l;
    });
    return s;
  };

  const Zt = (e) => {
    if (!e || typeof e !== 'string') return null;
    var n;
    const a = (n = e.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i)) == null ? void 0 : n[1];
    if (a) {
      const s = a.length === 3 ? a.split('').map((o) => o + o).join('') : a;
      return [0, 2, 4].map((o) => Number.parseInt(s.slice(o, o + 2), 16)).concat(1);
    }
    const r = e.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/i);
    return r ? [Number(r[1]), Number(r[2]), Number(r[3]), r[4] === void 0 ? 1 : Number(r[4])] : null;
  };

  const z2 = {
    width: 0.75,
    gap: 8,
    damping: 14,
    inertia: 1.2,
    pluck: 260,
    windAmp: 20,
    mouseRadius: 320,
    mouseForce: 2600,
    pulseSpeed: 0.8,
    pulseWidth: 0.3,
    pulseAlpha: 0.8,
    maxBend: 65,
  };

  function createOrbitClock(clockEl, isCompact = false) {
    if (!clockEl) return null;

    let centerEl = clockEl.querySelector('.orbit-center');
    if (!centerEl) {
      centerEl = document.createElement('div');
      centerEl.className = 'orbit-center';
      clockEl.appendChild(centerEl);
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Palette defaults
    let c = [255, 85, 0, 1]; // highlight (vivid orange)
    let d = [28, 25, 23, 0.55]; // body lines
    let u = [249, 239, 231, 1]; // ground

    const updateColors = () => {
      const cs = getComputedStyle(clockEl);
      c = Zt(cs.getPropertyValue('--color-highlight')) ?? c;
      d = Zt(cs.getPropertyValue('--color-body')) ?? d;
      u = Zt(cs.getPropertyValue('--color-ground')) ?? u;
    };
    updateColors();

    const colorLerp = (X) => {
      const i1 = c.map((o1, L) => o1 + (d[L] - o1) * X);
      return `rgba(${Math.round(i1[0])}, ${Math.round(i1[1])}, ${Math.round(i1[2])}, ${i1[3].toFixed(3)})`;
    };

    const vScale = (X) => (isCompact ? 1 - 0.2 * Math.min(1, Math.max(0, (X - 360) / 280)) : 0.88);
    const m = 14;
    const g = isCompact ? 9 : 11;
    const y = 0.8;
    const b = 1.2;
    const f = 0.7;
    const A = 4;

    let x = 0;
    let S = 0;
    let V = 0;
    let O = m;

    const canvas = document.createElement('canvas');
    canvas.className = 'orbit-lines';
    clockEl.insertBefore(canvas, clockEl.firstChild);
    const ctx = canvas.getContext('2d');

    let dpr = 1;
    let rect = clockEl.getBoundingClientRect();
    const stringPhysics = new Map();
    const pointer = { x: -1e4, y: -1e4, vx: 0, vy: 0, active: false };
    let lastTime = 0;

    let W = 0.3;
    function updateCenterRadius() {
      if (V > 0 && centerEl) {
        W = Math.min(0.6, (centerEl.offsetWidth / 2 + f5) / V);
      }
    }

    function resize() {
      rect = clockEl.getBoundingClientRect();
      x = rect.width;
      S = rect.height;
      if (x < 2 || S < 2) return;

      const minDim = Math.min(x, S);
      const halfDim = minDim / 2;
      let L = halfDim * 0.92 * vScale(minDim);

      for (let b1 = 0; b1 < 2; b1++) {
        const g1 = Math.max(10, L * 0.038) * 1.2;
        const Q1 = L * 1.01 + A + g1 + 1;
        if (Q1 > halfDim) L *= halfDim / Q1;
      }

      const H = L * 1.01 + A + (m * b) / 2;
      const sinStep = Math.sin(Math.PI / De);
      const l1 = Math.hypot(b, f);
      const L1 = 5;
      const q1 = 16;
      const U1 = (b1, g1) => (l1 * b1 + g1) / (2 * sinStep);
      const R1 = (isCompact ? Math.min(window.innerWidth / 2 - q1, S / 2) : halfDim) - (m * b) / 2;

      V = Math.min(R1, Math.max(H, U1(m, L1)));
      O = Math.max(g, Math.min(m, (2 * V * sinStep) / (l1 + y)));
      clockEl.style.setProperty('--orbit-fs', `${O}px`);

      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(x * dpr);
      canvas.height = Math.round(S * dpr);
      rect = clockEl.getBoundingClientRect();
      updateCenterRadius();
    }

    const secElements = new Map();
    const getSecElement = (secTimestamp) => {
      let item = secElements.get(secTimestamp);
      if (!item) {
        const span = document.createElement('span');
        span.className = 'orbit-sec';
        clockEl.appendChild(span);
        item = { el: span, text: '', o: -1, f: -1, c: '' };
        secElements.set(secTimestamp, item);
      }
      return item;
    };

    const shuffleCache = new Map();
    const getShuffle = (minuteSeed) => {
      let cached = shuffleCache.get(minuteSeed);
      if (!cached) {
        cached = Q3(De, rt(minuteSeed), (idx) => (idx < 2 ? 0.25 : 1));
        shuffleCache.set(minuteSeed, cached);
        if (shuffleCache.size > 3) {
          shuffleCache.delete(shuffleCache.keys().next().value);
        }
      }
      return cached;
    };

    // Digital rolling characters
    const rollEase = { duration: 620, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };
    const charStagger = 50;
    const digitNodes = [];

    const createCharIn = (char) => {
      const span = document.createElement('span');
      span.className = 'orbit-ch-in';
      span.textContent = char;
      return span;
    };

    function renderTimeImmediate(timeStr, shouldAnimate) {
      centerEl.textContent = '';
      digitNodes.length = 0;
      for (const char of timeStr) {
        const mask = document.createElement('span');
        mask.className = char === ':' ? 'orbit-ch is-colon' : 'orbit-ch';
        const inner = createCharIn(char);
        if (shouldAnimate) {
          inner.style.transform = 'translateY(120%)';
        }
        mask.appendChild(inner);
        centerEl.appendChild(mask);
        digitNodes.push({ mask, inner, ch: char });
      }
    }

    function updateTimeRolling(newTimeStr) {
      if (digitNodes.length !== newTimeStr.length || prefersReduced) {
        renderTimeImmediate(newTimeStr, !prefersReduced && !hasTriggeredIntro);
        return;
      }
      if (!hasTriggeredIntro) {
        renderTimeImmediate(newTimeStr, true);
        return;
      }

      let changeIdx = 0;
      [...newTimeStr].forEach((char, i) => {
        const node = digitNodes[i];
        if (node.ch === char) return;

        const delay = changeIdx++ * charStagger;
        const oldInner = node.inner;
        oldInner.classList.add('is-old');
        oldInner
          .animate(
            [{ transform: 'translateY(0)' }, { transform: 'translateY(-120%)' }],
            { ...rollEase, delay, fill: 'forwards' }
          )
          .finished.then(
            () => oldInner.remove(),
            () => oldInner.remove()
          );

        const newInner = createCharIn(char);
        node.mask.appendChild(newInner);
        newInner.animate(
          [{ transform: 'translateY(120%)' }, { transform: 'translateY(0)' }],
          { ...rollEase, delay, fill: 'backwards' }
        );

        node.inner = newInner;
        node.ch = char;
      });
    }

    function triggerIntroRoll() {
      digitNodes.forEach((node, i) => {
        node.inner.style.transform = '';
        node.inner.animate(
          [{ transform: 'translateY(120%)' }, { transform: 'translateY(0)' }],
          { ...rollEase, delay: i * charStagger, fill: 'backwards' }
        );
      });
    }

    const formatTime = (d) => `${It(d.getHours())} : ${It(d.getMinutes())}`;
    let currentTimeStr = formatTime(new Date());
    renderTimeImmediate(currentTimeStr, !prefersReduced);

    let hasTriggeredIntro = false;
    let introState = null;

    const activateIntro = () => {
      if (hasTriggeredIntro || prefersReduced) return;
      hasTriggeredIntro = true;
      triggerIntroRoll();
      const nowSec = Date.now() / 1000;
      const minStart = Math.floor(nowSec / 60) * 60;
      const curSec = Math.floor(nowSec) - minStart;
      introState = {
        at: nowSec,
        m0: minStart,
        last: curSec,
        order: Q3(curSec + 1, rt((Math.random() * 2 ** 31) | 0)),
      };
    };

    const colorToString = (rgb, alpha = rgb[3]) =>
      `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${Number(alpha).toFixed(3)})`;
    const mixRgb = (a, b, t) => a.map((val, idx) => val + (b[idx] - val) * t);

    function drawLines(lineList, curTimeSec, centerX, centerY) {
      const now = performance.now();
      const dt = lastTime ? Math.min(0.033, (now - lastTime) / 1000) : 1 / 60;
      lastTime = now;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, x, S);

      const subtleLine = [d[0], d[1], d[2], d[3] * 0.28];
      const solidLine = [d[0], d[1], d[2], Math.max(subtleLine[3], d[3])];
      const pulsePhase = (curTimeSec * z2.pulseSpeed) % 1;

      ctx.lineWidth = z2.width;
      ctx.lineCap = 'round';

      const activeTimestamps = new Set();

      for (const line of lineList) {
        activeTimestamps.add(line.abs);
        const targetX = centerX + Math.cos(line.a) * line.lr;
        const targetY = centerY - Math.sin(line.a) * line.lr;

        let phys = stringPhysics.get(line.abs);
        if (!phys) {
          const rng = rt(line.abs * 7919);
          phys = {
            bend: 0,
            vel: 0,
            px: targetX,
            py: targetY,
            seen: false,
            phase: rng() * Math.PI * 2,
            period: 5 + rng() * 6,
          };
          stringPhysics.set(line.abs, phys);
        }

        const lineLen = Math.max(1, line.lr);
        const normX = -(targetY - centerY) / lineLen;
        const normY = (targetX - centerX) / lineLen;

        if (!prefersReduced) {
          if (phys.seen) {
            phys.bend -= ((targetX - phys.px) * normX + (targetY - phys.py) * normY) * 0.5 * z2.inertia;
          }
          if (!phys.seen && line.entering) {
            phys.vel += z2.pluck * (rt(line.abs)() < 0.5 ? -1 : 1);
          }
          phys.seen = true;

          const windOffset = Math.sin((curTimeSec / phys.period) * Math.PI * 2 + phys.phase) * z2.windAmp;

          // Pointer interaction physics
          if (pointer.active) {
            const dx = targetX - centerX;
            const dy = targetY - centerY;
            const lineLenSq = dx * dx + dy * dy || 1;
            const proj = s4(((pointer.x - centerX) * dx + (pointer.y - centerY) * dy) / lineLenSq);
            const dist = Math.hypot(pointer.x - (centerX + dx * proj), pointer.y - (centerY + dy * proj));

            if (dist < z2.mouseRadius) {
              const forceScale = (1 - dist / z2.mouseRadius) ** 1.7 * Math.sin(Math.PI * proj);
              const sideSign = Math.sign((pointer.x - (centerX + dx * proj)) * normX + (pointer.y - (centerY + dy * proj)) * normY) || 1;
              const speedBoost = Math.min(2.2, 0.4 + Math.hypot(pointer.vx, pointer.vy) * 0.08);
              phys.vel -= sideSign * forceScale * z2.mouseForce * speedBoost * dt;
            }
          }

          const springForce = -140 * (phys.bend - windOffset) - z2.damping * phys.vel;
          phys.vel += springForce * dt;
          phys.bend = Math.max(-z2.maxBend, Math.min(z2.maxBend, phys.bend + phys.vel * dt));
        }

        phys.px = targetX;
        phys.py = targetY;

        // Quadratic bezier control point
        const ctrlX = (centerX + targetX) / 2 + normX * phys.bend * 2;
        const ctrlY = (centerY + targetY) / 2 + normY * phys.bend * 2;

        if (prefersReduced) {
          ctx.strokeStyle = colorToString(subtleLine, subtleLine[3] * line.o);
        } else {
          const grad = ctx.createLinearGradient(centerX, centerY, targetX, targetY);
          for (let sIdx = 0; sIdx <= 6; sIdx++) {
            const frac = sIdx / 6;
            let pDist = Math.abs(frac - pulsePhase);
            pDist = Math.min(pDist, 1 - pDist);
            const pulseFactor = ze(z2.pulseWidth, 0, pDist) * z2.pulseAlpha;
            const stopColor = mixRgb(subtleLine, solidLine, pulseFactor);
            grad.addColorStop(frac, colorToString(stopColor, stopColor[3] * line.o));
          }
          ctx.strokeStyle = grad;
        }

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, targetX, targetY);
        ctx.stroke();
      }

      // Cleanup unused string physics states
      for (const ts of stringPhysics.keys()) {
        if (!activeTimestamps.has(ts)) {
          stringPhysics.delete(ts);
        }
      }

      pointer.vx *= 0.85;
      pointer.vy *= 0.85;
    }

    function renderFrame() {
      if (x < 2 || S < 2) return;

      const nowSec = Date.now() / 1000;
      const curIntSec = Math.floor(nowSec);
      const fracSec = nowSec - curIntSec;
      const minStart = Math.floor(nowSec / 60) * 60;
      const secInMin = curIntSec - minStart;
      const timeInMin = nowSec - minStart;
      const smoothTime = prefersReduced ? curIntSec + 1 : c5(nowSec);
      const centerX = x / 2;
      const centerY = S / 2;

      const curDate = new Date(curIntSec * 1000);
      const newTimeStr = formatTime(curDate);
      if (newTimeStr !== currentTimeStr) {
        updateTimeRolling(newTimeStr);
        currentTimeStr = newTimeStr;
        updateCenterRadius();
      }

      const activeSecSet = new Set();
      const lineList = [];
      const baseLineRadius = V - (O * b) / 2 - z2.gap;

      if (hasTriggeredIntro) {
        const ranges = [];
        if (!prefersReduced && timeInMin < C5 && (!introState || minStart - 60 >= introState.m0)) {
          ranges.push({ m0: minStart - 60, upTo: De - 1 });
        }
        ranges.push({ m0: minStart, upTo: secInMin });

        for (const range of ranges) {
          for (let secIdx = 0; secIdx <= range.upTo; secIdx++) {
            const absSec = range.m0 + secIdx;
            const angleDeg = 180 - n5 * (smoothTime - (absSec + 1));
            let radius = V;
            let opacity = 1;
            let blurAmount = 0;
            let colorStr = '';
            let isEntering = false;
            let enterFactor = 1;

            if (!prefersReduced) {
              if (range.upTo === De - 1) {
                const normT = (nowSec - (range.m0 + r4 + getShuffle(range.m0)[secIdx] * h3)) / Xe;
                if (normT > 0) {
                  if (normT >= 1) continue;
                  const factor = Z3(normT);
                  radius = V * factor;
                  opacity = ze(W, W + G3, factor);
                  blurAmount = Ot * Math.min(1, z3(normT) / Xe / 3);
                }
              }

              let isFromIntro = false;
              if (introState && range.m0 === introState.m0 && secIdx <= introState.last) {
                const normT = (nowSec - (introState.at + m5 + introState.order[secIdx] * h3)) / Xe;
                if (normT < 1) {
                  isFromIntro = true;
                  const clamped = Math.max(0, normT);
                  const factor = Z3(1 - clamped);
                  radius = V * factor;
                  opacity = normT <= 0 ? 0 : ze(W, W + G3, factor);
                  blurAmount = Ot * Math.min(1, z3(1 - clamped) / Xe / 3);
                }
              }

              if (!isFromIntro && range.m0 === minStart && secIdx === secInMin && fracSec < I3) {
                const easeT = g5(fracSec / I3);
                radius = V + V * d5 * (1 - easeT);
                opacity = ze(0, p5, fracSec);
                colorStr = colorLerp(ze(h5, u5, fracSec));
                blurAmount = Ot * (1 - easeT);
                isEntering = true;
                enterFactor = easeT;
              }
            }

            if (opacity <= 0.001) continue;

            const radAngle = (angleDeg * Math.PI) / 180;
            lineList.push({
              abs: absSec,
              a: radAngle,
              lr: baseLineRadius * (isEntering ? enterFactor : Math.min(1, radius / V)),
              o: opacity,
              entering: isEntering,
            });

            const secItem = getSecElement(absSec);
            activeSecSet.add(absSec);

            const secLabel = It(secIdx);
            if (secItem.text !== secLabel) {
              secItem.el.textContent = secLabel;
              secItem.text = secLabel;
            }

            secItem.el.style.transform = `translate3d(${(centerX + Math.cos(radAngle) * radius).toFixed(2)}px, ${(centerY - Math.sin(radAngle) * radius).toFixed(2)}px, 0) translate(-50%, -50%)`;

            if (secItem.o !== opacity) {
              secItem.el.style.opacity = String(opacity);
              secItem.o = opacity;
            }

            const roundedBlur = blurAmount > 0.05 ? Math.round(blurAmount * 100) / 100 : 0;
            if (secItem.f !== roundedBlur) {
              secItem.el.style.filter = roundedBlur ? `blur(${roundedBlur}px)` : '';
              secItem.f = roundedBlur;
            }

            if (secItem.c !== colorStr) {
              secItem.el.style.color = colorStr;
              secItem.c = colorStr;
            }
          }
        }
      }

      // Cleanup expired elements
      for (const [absTs, item] of secElements) {
        if (!activeSecSet.has(absTs)) {
          item.el.remove();
          secElements.delete(absTs);
        }
      }

      drawLines(lineList, nowSec, centerX, centerY);
    }

    // Pointer events (Mouse + Touch)
    const onPointerMove = (e) => {
      if (!isRunning) return;
      rect = clockEl.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : pointer.x);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : pointer.y);

      const px = clientX - rect.left;
      const py = clientY - rect.top;

      if (pointer.active) {
        pointer.vx = px - pointer.x;
        pointer.vy = py - pointer.y;
      }
      pointer.x = px;
      pointer.y = py;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.vx = 0;
      pointer.vy = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    clockEl.addEventListener('touchstart', onPointerMove, { passive: true });
    clockEl.addEventListener('touchmove', onPointerMove, { passive: true });
    clockEl.addEventListener('touchend', onPointerLeave, { passive: true });

    let animFrameId = 0;
    let timerIntervalId = 0;
    let isRunning = false;

    const loop = () => {
      if (isRunning) {
        renderFrame();
        animFrameId = requestAnimationFrame(loop);
      }
    };

    const start = () => {
      if (isRunning) return;
      isRunning = true;
      if (prefersReduced) {
        renderFrame();
        timerIntervalId = window.setInterval(renderFrame, 1000);
      } else {
        animFrameId = requestAnimationFrame(loop);
      }
    };

    const stop = () => {
      isRunning = false;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = 0;
      }
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
        timerIntervalId = 0;
      }
    };

    const ro = new ResizeObserver(() => {
      resize();
      renderFrame();
    });
    ro.observe(clockEl);
    resize();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateCenterRadius);
    }

    let isTabVisible = !document.hidden;
    let isIntersecting = true;

    const syncState = () => {
      if (isTabVisible && isIntersecting) {
        start();
      } else {
        stop();
      }
    };

    const onVisibility = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) updateColors();
      syncState();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (entry.isIntersecting && !hasTriggeredIntro) {
          activateIntro();
        }
        syncState();
      },
      { threshold: 0.05 }
    );
    io.observe(clockEl);

    // Color theme change detection
    const themeObserver = new MutationObserver(updateColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    // Auto-activate intro after a brief delay if already in view
    setTimeout(() => {
      activateIntro();
    }, 150);

    start();

    return {
      destroy: () => {
        stop();
        ro.disconnect();
        io.disconnect();
        themeObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerleave', onPointerLeave);
        clockEl.removeEventListener('touchstart', onPointerMove);
        clockEl.removeEventListener('touchmove', onPointerMove);
        clockEl.removeEventListener('touchend', onPointerLeave);
        canvas.remove();
        for (const item of secElements.values()) {
          item.el.remove();
        }
        secElements.clear();
      },
    };
  }

  // Auto initialize on DOM ready
  function init() {
    const clockElements = document.querySelectorAll('.orbit-clock');
    clockElements.forEach((el) => {
      if (!el._orbitClockInstance) {
        const isCompact = el.classList.contains('is-compact');
        el._orbitClockInstance = createOrbitClock(el, isCompact);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.initOrbitClock = createOrbitClock;
})();

