/* ============================================================
   ZOOM SLIDER — Kinetic Perspective Controller
   Seamless Scroll-Pinned Experience:
   - Locks in place until all cards finish scrolling ("khefifa & smooth")
   - Unpins and proceeds to lower sections once cards complete
   ============================================================ */

(function () {
  function initZoomSlider() {
    const section = document.querySelector(".zoom-slider-section");
    if (!section) return;

    if (section.dataset.initialized === "true") return;
    section.dataset.initialized = "true";

    const strip = section.querySelector(".zoom-slider-strip");
    const cards = Array.from(section.querySelectorAll(".zoom-slider-card"));
    const count = cards.length;
    if (!strip || !count) return;

    const prevBtn = section.querySelector("[data-slider-prev]");
    const nextBtn = section.querySelector("[data-slider-next]");
    const counterEl = section.querySelector(".zoom-slider-counter");

    const MOBILE_BREAKPOINT = 640;
    const TABLET_BREAKPOINT = 1025;
    const LERP_FACTOR = 0.22; // Responsive, light, butter-smooth ("khefifa")
    const DRAG_LERP_FACTOR = 0.28;
    const MOMENTUM_FRICTION = 0.92;
    const MIN_MOMENTUM = 0.1;

    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let isMobile = viewportWidth < MOBILE_BREAKPOINT;
    let isTablet = viewportWidth >= MOBILE_BREAKPOINT && viewportWidth < TABLET_BREAKPOINT;

    const size = 1;
    const easeScrollPercentage = 100;
    // Locked portrait ratio so every frame stays visually aligned
    const CARD_ASPECT = 3 / 4; // width / height
    const CARD_GAP = 14;
    let cardWidthMin, cardWidthMax, cardHeightMax, cardHeightMin, cardStep, bottomInset;

    function updateDimensions() {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      isMobile = viewportWidth < MOBILE_BREAKPOINT;
      isTablet = viewportWidth >= MOBILE_BREAKPOINT && viewportWidth < TABLET_BREAKPOINT;

      bottomInset = isMobile ? 88 : 100;
      cardWidthMax = (isMobile ? 220 : isTablet ? 360 : 420) * size;
      cardHeightMax = Math.min(
        Math.round(viewportHeight * (isMobile ? 0.52 : 0.58) * size),
        Math.round(cardWidthMax / CARD_ASPECT)
      );
      // Keep max width in sync with the height budget + aspect
      cardWidthMax = Math.round(cardHeightMax * CARD_ASPECT);
      cardWidthMin = Math.round(cardWidthMax * (isMobile ? 0.42 : 0.38));
      cardHeightMin = Math.round(cardWidthMin / CARD_ASPECT);
      cardStep = cardWidthMax + CARD_GAP;
    }

    updateDimensions();

    const state = {
      current: 0,
      target: 0,
      raf: null,
      isDragging: false,
      lastX: 0,
      lastY: 0,
      velocity: 0,
    };

    function lerp(a, b, n) {
      return a + (b - a) * n;
    }

    function positionCards(offset) {
      const loopWidth = count * cardStep;
      const bottom = viewportHeight - bottomInset;
      const easingDistance = 2 * viewportWidth * (easeScrollPercentage / 100);

      function mapVtoX(value) {
        if (value <= 0) return 0;
        if (value >= easingDistance) return value - easingDistance / 2;
        return (value * value) / (2 * easingDistance);
      }

      const normalizedOffset = ((offset % loopWidth) + loopWidth) % loopWidth;
      const startIndex = Math.floor(normalizedOffset / cardStep);
      const fractionalOffset = (normalizedOffset % cardStep) / cardStep;

      for (let i = 0; i < count; i++) {
        const cardIndex = (startIndex + i) % count;
        const visualOffset = (i - fractionalOffset) * cardStep;
        const currentX = mapVtoX(visualOffset);
        const nextX = mapVtoX(visualOffset + cardStep);
        // Width from perspective, then height locked to aspect so crops stay aligned
        const rawWidth = Math.max(cardWidthMin * 0.85, nextX - currentX - CARD_GAP * 0.35);
        const scale = Math.min(1, rawWidth / cardWidthMax);
        const visualWidth = Math.round(cardWidthMin + scale * (cardWidthMax - cardWidthMin));
        const cardHeight = Math.round(visualWidth / CARD_ASPECT);
        const y = bottom - cardHeight;

        const card = cards[cardIndex];
        if (!card) continue;

        card.style.transform = `translate3d(${currentX}px, ${y}px, 0)`;
        card.style.zIndex = String(10 + Math.round(scale * 40));

        const imageWrap = card.querySelector(".zoom-slider-image-wrap");
        if (imageWrap) {
          imageWrap.style.width = `${visualWidth}px`;
          imageWrap.style.height = `${cardHeight}px`;
        }
      }

      if (counterEl) {
        const currentActive = (Math.floor(normalizedOffset / cardStep) % count) + 1;
        counterEl.textContent = `${String(currentActive).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
      }
    }

    function tick() {
      if (!state.isDragging && Math.abs(state.velocity) > MIN_MOMENTUM) {
        state.target += state.velocity;
        state.velocity *= MOMENTUM_FRICTION;
      } else if (!state.isDragging) {
        state.velocity = 0;
      }

      const factor = state.isDragging ? DRAG_LERP_FACTOR : LERP_FACTOR;
      state.current = lerp(state.current, state.target, factor);

      positionCards(state.current);
      state.raf = requestAnimationFrame(tick);
    }

    // Desktop: pin while scrubbing cards. Mobile/tablet: free scroll + drag (no sticky pin).
    let hasScrollTrigger = false;
    if (typeof ScrollTrigger !== "undefined" && typeof gsap !== "undefined") {
      hasScrollTrigger = true;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      mm.add("(min-width: 992px)", () => {
        const totalSlideDistance = () => count * cardStep;
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * 2.5),
          pin: true,
          pinSpacing: true,
          scrub: 0.25,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!state.isDragging) {
              state.target = -self.progress * totalSlideDistance();
            }
          },
        });
        return () => st.kill();
      });

      mm.add("(max-width: 991px)", () => {
        // No pin — vertical page scroll stays free; horizontal drag moves cards.
        section.classList.add("is-mobile-gallery");
        return () => section.classList.remove("is-mobile-gallery");
      });
    }

    // Fallback wheel only when ScrollTrigger is missing entirely
    if (!hasScrollTrigger) {
      strip.addEventListener(
        "wheel",
        function (e) {
          const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
          state.target -= delta * 1.0;
        },
        { passive: true }
      );
    }

    // Drag handlers
    function beginDrag(clientX, clientY) {
      state.isDragging = true;
      strip.classList.add("is-dragging");
      state.lastX = clientX;
      state.lastY = clientY;
      state.velocity = 0;
    }

    function moveDrag(clientX, clientY, direction = 1) {
      if (!state.isDragging) return;
      const deltaX = clientX - state.lastX;
      const deltaY = clientY - state.lastY;
      const rawDelta = Math.abs(deltaX) >= Math.abs(deltaY) ? -deltaX : -deltaY;
      const delta = rawDelta * direction;

      state.target += delta;
      state.velocity = lerp(state.velocity, delta, 0.5);
      state.lastX = clientX;
      state.lastY = clientY;
    }

    function endDrag() {
      state.isDragging = false;
      strip.classList.remove("is-dragging");
    }

    strip.addEventListener("mousedown", (e) => {
      if (e.button === 0) beginDrag(e.clientX, e.clientY);
    });
    window.addEventListener("mousemove", (e) => moveDrag(e.clientX, e.clientY));
    window.addEventListener("mouseup", endDrag);

    strip.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length > 0) beginDrag(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: true }
    );
    window.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length > 0) moveDrag(e.touches[0].clientX, e.touches[0].clientY, -1);
      },
      { passive: true }
    );
    window.addEventListener("touchend", endDrag);
    window.addEventListener("touchcancel", endDrag);

    // Prev / Next Buttons
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        state.target += cardStep * 0.85;
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        state.target -= cardStep * 0.85;
      });
    }

    // SplitText hover animations
    cards.forEach((card) => {
      const textElement = card.querySelector(".zoom-slider-text");
      const imageWrap = card.querySelector(".zoom-slider-image-wrap");
      if (!textElement || !imageWrap) return;

      const titleElement = textElement.querySelector("[data-title]");
      const imageElement = imageWrap.querySelector("img");

      let split = null;
      if (typeof SplitText !== "undefined" && typeof gsap !== "undefined" && titleElement) {
        try {
          split = SplitText.create([titleElement], {
            type: "lines",
            mask: "lines",
          });
          gsap.set(split.lines, { yPercent: 100 });
          gsap.set(textElement, { autoAlpha: 0 });
        } catch (e) {
          gsap.set(textElement, { autoAlpha: 0 });
        }
      }

      const onEnter = () => {
        if (typeof gsap === "undefined") {
          textElement.style.visibility = "visible";
          textElement.style.opacity = "1";
          return;
        }

        if (split && split.lines && split.lines.length) {
          gsap.killTweensOf([textElement, split.lines]);
          gsap
            .timeline()
            .set(textElement, { autoAlpha: 1 })
            .to(split.lines, {
              yPercent: 0,
              duration: 0.55,
              stagger: 0.05,
              ease: "power3.out",
            });
        } else {
          gsap.killTweensOf(textElement);
          gsap.to(textElement, {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          });
        }

        if (imageElement) {
          gsap.to(imageElement, {
            scale: 1.05,
            duration: 0.6,
            ease: "power2.out",
          });
        }
      };

      const onLeave = () => {
        if (typeof gsap === "undefined") {
          textElement.style.visibility = "hidden";
          textElement.style.opacity = "0";
          return;
        }

        if (split && split.lines && split.lines.length) {
          gsap.killTweensOf([textElement, split.lines]);
          gsap.to(split.lines, {
            yPercent: 100,
            duration: 0.28,
            stagger: 0.03,
            ease: "power2.in",
            onComplete: () => gsap.set(textElement, { autoAlpha: 0 }),
          });
        } else {
          gsap.killTweensOf(textElement);
          gsap.to(textElement, {
            autoAlpha: 0,
            y: 10,
            duration: 0.25,
            ease: "power2.in",
          });
        }

        if (imageElement) {
          gsap.to(imageElement, {
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          });
        }
      };

      imageWrap.addEventListener("mouseenter", onEnter);
      imageWrap.addEventListener("mouseleave", onLeave);
    });

    // Sync scroll size with Lenis and ScrollTrigger
    function syncPageScroll() {
      updateDimensions();
      positionCards(state.current);
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
      if (typeof window.lenis !== "undefined" && window.lenis.resize) {
        window.lenis.resize();
      }
    }

    window.addEventListener("resize", syncPageScroll);

    // Approach (and other late layout) can shift document height after init —
    // re-measure pin start/end so gallery scrub doesn't jump.
    window.addEventListener("speak:layout", syncPageScroll);

    // Initial syncs to ensure pin-spacer is calculated accurately
    setTimeout(syncPageScroll, 200);
    setTimeout(syncPageScroll, 600);
    setTimeout(syncPageScroll, 1200);

    // Start RAF
    state.raf = requestAnimationFrame(tick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initZoomSlider);
  } else {
    initZoomSlider();
  }
})();
