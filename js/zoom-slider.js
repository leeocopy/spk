/* ============================================================
   ZOOM SLIDER — Kinetic Perspective Controller
   - Continuous edge-to-edge spanning (no black void / gaps)
   - Responsive across mobile, tablet, laptop, and 4K desktop
   - Responsive ScrollTrigger pin animation on desktop & mobile
   - Direct-manipulation horizontal touch drag + prev/next buttons
   ============================================================ */

(function () {
  function initZoomSlider() {
    const section = document.querySelector(".zoom-slider-section");
    if (!section) return;

    if (section.dataset.initialized === "true") return;
    section.dataset.initialized = "true";

    const strip = section.querySelector(".zoom-slider-strip");
    if (!strip) return;

    // Get original cards before cloning
    const rawCards = Array.from(strip.querySelectorAll(".zoom-slider-card:not([data-cloned])"));
    const originalCount = rawCards.length;
    if (!originalCount) return;

    // Duplicate cards to guarantee edge-to-edge coverage across all screen sizes up to 4K
    const targetCount = 24;
    while (strip.querySelectorAll(".zoom-slider-card").length < targetCount) {
      rawCards.forEach((c) => {
        const clone = c.cloneNode(true);
        clone.setAttribute("data-cloned", "true");
        strip.appendChild(clone);
      });
    }

    const cards = Array.from(strip.querySelectorAll(".zoom-slider-card"));
    const totalCards = cards.length;

    const prevBtn = section.querySelector("[data-slider-prev]");
    const nextBtn = section.querySelector("[data-slider-next]");
    const counterEl = section.querySelector(".zoom-slider-counter");

    const MOBILE_BREAKPOINT = 640;
    const TABLET_BREAKPOINT = 1024;
    const LAPTOP_BREAKPOINT = 1440;
    const LERP_FACTOR = 0.22;
    const DRAG_LERP_FACTOR = 0.28;
    const MOMENTUM_FRICTION = 0.92;
    const MIN_MOMENTUM = 0.1;

    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let isMobile = viewportWidth <= MOBILE_BREAKPOINT;
    let isTablet = viewportWidth > MOBILE_BREAKPOINT && viewportWidth <= TABLET_BREAKPOINT;

    // Locked portrait ratio so every frame stays visually aligned
    const CARD_ASPECT = 3 / 4; // width / height
    const CARD_GAP = 14;
    let cardWidthMin, cardWidthMax, cardHeightMax, cardHeightMin, cardStep, bottomInset;

    function updateDimensions() {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      isMobile = viewportWidth <= MOBILE_BREAKPOINT;
      isTablet = viewportWidth > MOBILE_BREAKPOINT && viewportWidth <= TABLET_BREAKPOINT;

      if (isMobile) {
        cardHeightMax = Math.min(Math.round(viewportHeight * 0.44), 340);
        cardHeightMin = Math.round(cardHeightMax * 0.44);
        cardWidthMax = Math.round(cardHeightMax * CARD_ASPECT);
        cardWidthMin = Math.round(cardHeightMin * CARD_ASPECT);
        cardStep = Math.round(cardWidthMax * 0.78);
        bottomInset = 75;
      } else if (isTablet) {
        cardHeightMax = Math.min(Math.round(viewportHeight * 0.48), 430);
        cardHeightMin = Math.round(cardHeightMax * 0.40);
        cardWidthMax = Math.round(cardHeightMax * CARD_ASPECT);
        cardWidthMin = Math.round(cardHeightMin * CARD_ASPECT);
        cardStep = Math.round(cardWidthMax * 0.75);
        bottomInset = 80;
      } else if (viewportWidth <= LAPTOP_BREAKPOINT) {
        cardHeightMax = Math.min(Math.round(viewportHeight * 0.54), 520);
        cardHeightMin = Math.round(cardHeightMax * 0.38);
        cardWidthMax = Math.round(cardHeightMax * CARD_ASPECT);
        cardWidthMin = Math.round(cardHeightMin * CARD_ASPECT);
        cardStep = Math.round(cardWidthMax * 0.74);
        bottomInset = 85;
      } else {
        cardHeightMax = Math.min(Math.round(viewportHeight * 0.60), 600);
        cardHeightMin = Math.round(cardHeightMax * 0.36);
        cardWidthMax = Math.round(cardHeightMax * CARD_ASPECT);
        cardWidthMin = Math.round(cardHeightMin * CARD_ASPECT);
        cardStep = Math.round(cardWidthMax * 0.72);
        bottomInset = 90;
      }
      cardHeightMin = Math.round(cardWidthMin / CARD_ASPECT);
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
      const loopWidth = originalCount * cardStep;
      const bottom = viewportHeight - bottomInset;
      const easingDistance = viewportWidth * 1.15;
      const s0 = cardWidthMin / cardStep;

      // Monotonic perspective projection covering negative X to beyond viewport width
      function mapVtoX(val) {
        if (val <= 0) return val * s0;
        if (val >= easingDistance) return val - easingDistance / 2;
        return (val * val) / (2 * easingDistance);
      }

      const normalizedOffset = ((offset % loopWidth) + loopWidth) % loopWidth;
      const baseIndex = Math.floor(normalizedOffset / cardStep);
      const fractionalOffset = (normalizedOffset % cardStep) / cardStep;
      const lead = 3; // 3 cards start off-screen left to ensure no gap at the left margin

      for (let k = 0; k < totalCards; k++) {
        const virtualIndex = k - lead;
        const visualOffset = (virtualIndex - fractionalOffset) * cardStep;
        const currentX = mapVtoX(visualOffset);

        // Every card further to the right is progressively taller in order (smooth monotonic perspective)
        const enterMargin = cardWidthMin * 0.8;
        const normalizedX = (currentX + enterMargin) / (viewportWidth + enterMargin);
        const clampedX = Math.min(1.0, Math.max(0, normalizedX));
        const progressCurve = Math.pow(clampedX, 0.88);
        const cardHeight = Math.round(cardHeightMin + progressCurve * (cardHeightMax - cardHeightMin));
        const visualWidth = Math.round(cardHeight * CARD_ASPECT);
        const y = bottom - cardHeight;

        const cardIndex = ((baseIndex + k - lead) % totalCards + totalCards) % totalCards;
        const card = cards[cardIndex];
        if (!card) continue;

        card.style.transform = `translate3d(${Math.round(currentX)}px, ${Math.round(y)}px, 0)`;
        card.style.zIndex = String(10 + Math.round(progressCurve * 50));

        const imageWrap = card.querySelector(".zoom-slider-image-wrap");
        if (imageWrap) {
          imageWrap.style.width = `${visualWidth}px`;
          imageWrap.style.height = `${cardHeight}px`;
        }
      }

      if (counterEl) {
        const currentActive = (Math.floor(normalizedOffset / cardStep) % originalCount) + 1;
        counterEl.textContent = `${String(currentActive).padStart(2, "0")} / ${String(originalCount).padStart(2, "0")}`;
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

    // GSAP ScrollTrigger for pinned scroll scrub (both desktop and mobile)
    let hasScrollTrigger = false;
    if (typeof ScrollTrigger !== "undefined" && typeof gsap !== "undefined") {
      hasScrollTrigger = true;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      // Desktop & Large screens
      mm.add("(min-width: 992px)", () => {
        const totalSlideDistance = () => originalCount * cardStep * 1.5;
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
              state.target = self.progress * totalSlideDistance();
            }
          },
        });
        return () => st.kill();
      });

      // Mobile & Tablet: Pin and animate smoothly on scroll
      mm.add("(max-width: 991px)", () => {
        section.classList.add("is-mobile-gallery");
        const totalSlideDistance = () => originalCount * cardStep * 1.6;
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * 2.2),
          pin: true,
          pinSpacing: true,
          scrub: 0.25,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!state.isDragging) {
              state.target = self.progress * totalSlideDistance();
            }
          },
        });
        return () => {
          section.classList.remove("is-mobile-gallery");
          st.kill();
        };
      });
    }

    // Fallback wheel when ScrollTrigger is missing
    if (!hasScrollTrigger) {
      strip.addEventListener(
        "wheel",
        function (e) {
          const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
          state.target += delta * 1.0;
        },
        { passive: true }
      );
    }

    // Drag / Touch handlers (Direct manipulation)
    function beginDrag(clientX, clientY) {
      state.isDragging = true;
      strip.classList.add("is-dragging");
      state.lastX = clientX;
      state.lastY = clientY;
      state.velocity = 0;
    }

    function moveDrag(clientX, clientY) {
      if (!state.isDragging) return;
      const deltaX = clientX - state.lastX;
      const deltaY = clientY - state.lastY;

      // Only scrub cards if movement is predominantly horizontal
      if (Math.abs(deltaX) > Math.abs(deltaY) * 0.5) {
        const delta = -deltaX;
        state.target += delta;
        state.velocity = lerp(state.velocity, delta, 0.5);
      }
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
        if (e.touches.length > 0) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: true }
    );
    window.addEventListener("touchend", endDrag);
    window.addEventListener("touchcancel", endDrag);

    // Prev / Next Buttons
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        state.target -= cardStep * 0.9;
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        state.target += cardStep * 0.9;
      });
    }

    // Hover & SplitText animations
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

    // Resize sync
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
    window.addEventListener("speak:layout", syncPageScroll);

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
