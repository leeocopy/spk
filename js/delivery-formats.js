/* ============================================================
   SPEAK — Split Photo Slider (Our Delivery Formats)
   - GSAP ScrollTrigger Native Pinning ("tb9a fix")
   - Alternating Side-by-Side (Odd: Photo Right, Text Left; Even: Photo Left, Text Right)
   - Auto-Transition (Autoplay every 4s when section is active)
   - Scroll-Driven (Wheel/Touch/Lenis scrubs smoothly across slides)
   - Seamless Section Handoff (Once all 5 slides finish, passes to next section)
   - Center Seam Thumbnails (5 dots with active indicator)
   - Zero Black Gap / Zero Flicker
   ============================================================ */

(function () {
  const slidesData = [
    {
      title: "Executive 1:1 Coaching",
      description: "Private, tailored English coaching designed for executives and senior professionals navigating high-stakes communication, negotiations and international leadership.",
      image: "./images/formats/format-01-executive-coaching.jpg?v=1",
      tags: ["Bespoke", "Confidential"],
      cta: "Inquire Now",
      href: "mailto:Contact@speak.ma?subject=Inquiry%20-%20Executive%201:1%20Coaching",
    },
    {
      title: "Corporate English Training",
      description: "Tailored English development programmes that equip teams with the communication skills to collaborate, perform and grow across borders.",
      image: "./images/formats/format-02-corporate-training.jpg?v=1",
      tags: ["Corporate", "Tailored"],
      cta: "Inquire Now",
      href: "mailto:Contact@speak.ma?subject=Inquiry%20-%20Corporate%20English%20Training",
    },
    {
      title: "Executive Workshops",
      description: "Intensive, interactive experiences focused on public speaking, negotiation, presentations and leadership communication in English.",
      image: "./images/formats/format-03-executive-workshops.jpg?v=1",
      tags: ["Interactive", "High-impact"],
      cta: "Inquire Now",
      href: "mailto:Contact@speak.ma?subject=Inquiry%20-%20Executive%20Workshops",
    },
    {
      title: "Corporate Seminars & Experiences",
      description: "Immersive learning experiences that combine professional development, team interaction and meaningful communication.",
      image: "./images/formats/format-04-corporate-seminars.jpg?v=1",
      tags: ["Immersive", "Team Development"],
      cta: "Inquire Now",
      href: "mailto:Contact@speak.ma?subject=Inquiry%20-%20Corporate%20Seminars",
    },
    {
      title: "Business Networking & Events",
      description: "Curated professional gatherings designed to encourage meaningful conversations, new connections and confident English communication.",
      image: "./images/formats/format-05-networking-events.jpg?v=1",
      tags: ["Networking", "Community"],
      cta: "Inquire Now",
      href: "mailto:Contact@speak.ma?subject=Inquiry%20-%20Networking%20Events",
    },
  ];

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function initDeliveryFormatsSlider() {
    const containers = document.querySelectorAll("[data-delivery-formats]");
    if (!containers.length) return;

    containers.forEach((container) => {
      if (container.dataset.initialized === "true") return;
      container.dataset.initialized = "true";

      const n = slidesData.length;
      const steps = n - 1;
      const AUTOPLAY_INTERVAL = 4000;
      let currentIndex = 0;
      let currentTimeline = null;
      let triggerInstance = null;
      let autoplayTimer = null;
      let isUserInteracting = false;
      let userInteractionTimeout = null;
      let isHovered = false;
      let isSectionActive = false;
      let isAutoScrolling = false;

      // Render the markup
      let slidesHtml = "";
      slidesData.forEach((s, i) => {
        const isReversed = i % 2 === 1;
        const isActive = i === 0;

        const tagsHtml = s.tags && s.tags.length
          ? `<div class="sps-tags" data-sps-l="">` +
            s.tags.map((t) => `<span class="sps-tag">${t}</span>`).join("") +
            `</div>`
          : "";

        slidesHtml += `
          <div class="sps-slide" data-index="${i}" ${isActive ? 'data-on=""' : ""} ${isReversed ? 'data-reversed="true"' : ""} aria-hidden="${!isActive}">
            <!-- Media column -->
            <div class="sps-media">
              <div class="sps-img">
                <img src="${s.image}" alt="${s.title}" loading="${isActive ? "eager" : "lazy"}" width="1200" height="1000" draggable="false" />
              </div>
              <div class="sps-img-overlay"></div>
            </div>

            <!-- Content Panel column -->
            <div class="sps-panel">
              <div class="sps-copy" aria-live="polite">
                <div class="sps-count" data-sps-l="">
                  <span class="sps-now" aria-hidden="true">${pad2(i + 1)}</span>
                  <i></i>
                  <span class="sps-all" aria-hidden="true">${pad2(n)}</span>
                  <span class="sps-sr">Format ${i + 1} of ${n}</span>
                </div>
                ${tagsHtml}
                <h2 class="sps-title" data-sps-l="">${s.title}</h2>
                <p class="sps-desc" data-sps-l="">${s.description}</p>
                <div data-sps-l="">
                  <a class="sps-cta" href="${s.href}">
                    <span>${s.cta}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none" class="sps-cta-arrow">
                      <path d="M1.24993 10.5245L-9.14435e-06 9.27457L7.49961 1.77495L0.624959 1.77495L0.624959 3.99351e-05L10.5245 4.06895e-05L10.5245 9.89954L8.74954 9.89954L8.74954 3.02489L1.24993 10.5245Z" fill="currentColor"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      let dotsHtml = "";
      slidesData.forEach((s, i) => {
        dotsHtml += `
          <li>
            <button type="button" class="sps-dot" data-dot-index="${i}" aria-label="${s.title}" aria-current="${i === 0}">
              <img src="${s.image}" alt="" width="42" height="42" draggable="false" />
            </button>
          </li>
        `;
      });

      const rootHtml = `
        <section class="sps-root" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Our Delivery Formats">
          <!-- Brand Badge -->
          <div class="sps-brand">
            <img src="./images/speak-ribbon-mark.svg" alt="Speak" class="sps-brand-mark" />
            <span class="sps-brand-text">Our Delivery Formats</span>
          </div>

          <!-- Credit -->
          <p class="sps-credit">Speak · Professional Experiences</p>

          <!-- Center Seam Dots Navigation -->
          <ul class="sps-dots" aria-label="Choose a delivery format">
            ${dotsHtml}
          </ul>

          <!-- Slides Container -->
          <div class="sps-slides-container">
            ${slidesHtml}
          </div>

          <!-- Up / Down Arrows -->
          <div class="sps-arrows">
            <button type="button" class="sps-arrow sps-arrow-prev" aria-label="Previous format">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
            <button type="button" class="sps-arrow sps-arrow-next" aria-label="Next format">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </section>
      `;

      container.innerHTML = rootHtml;

      const rootEl = container.querySelector(".sps-root");
      const slideEls = Array.from(container.querySelectorAll(".sps-slide"));
      const dotEls = Array.from(container.querySelectorAll(".sps-dot"));
      const prevBtn = container.querySelector(".sps-arrow-prev");
      const nextBtn = container.querySelector(".sps-arrow-next");

      function updateActiveDot(idx) {
        dotEls.forEach((dot, dIdx) => {
          dot.setAttribute("aria-current", dIdx === idx ? "true" : "false");
        });
      }

      function go(target, dir) {
        const from = currentIndex;
        const to = Math.max(0, Math.min(target, n - 1));
        if (to === from || n < 2) return;

        const d = dir !== undefined ? dir : (to > from ? 1 : -1);

        if (currentTimeline) {
          currentTimeline.progress(1).kill();
        }

        currentIndex = to;
        updateActiveDot(to);

        const oldSlide = slideEls[from];
        const newSlide = slideEls[to];
        if (!oldSlide || !newSlide) return;

        const oldImg = oldSlide.querySelector(".sps-img");
        const newImg = newSlide.querySelector(".sps-img");
        const oldMedia = oldSlide.querySelector(".sps-media");
        const newMedia = newSlide.querySelector(".sps-media");
        const oldLines = oldSlide.querySelectorAll("[data-sps-l]");
        const newLines = newSlide.querySelectorAll("[data-sps-l]");

        const g = window.gsap || gsap;
        if (!g) {
          slideEls.forEach((s, idx) => {
            if (idx === to) {
              s.setAttribute("data-on", "");
              s.removeAttribute("aria-hidden");
            } else {
              s.removeAttribute("data-on");
              s.setAttribute("aria-hidden", "true");
            }
          });
          return;
        }

        g.set([oldSlide, newSlide], { visibility: "visible" });
        g.set(oldSlide, { zIndex: 1 });
        g.set(newSlide, { zIndex: 2 });

        const done = () => {
          slideEls.forEach((s, idx) => {
            if (idx === to) {
              s.setAttribute("data-on", "");
              s.removeAttribute("aria-hidden");
            } else {
              s.removeAttribute("data-on");
              s.setAttribute("aria-hidden", "true");
            }
          });
          g.set([oldSlide, newSlide], { clearProps: "visibility,zIndex" });
          if (oldMedia && newMedia) g.set([oldMedia, newMedia], { clearProps: "transform,opacity" });
          if (oldImg && newImg) g.set([oldImg, newImg], { clearProps: "transform,opacity" });
          g.set([oldLines, newLines], { clearProps: "transform,opacity" });
        };

        const t = g.timeline({ onComplete: done });

        // Copy text stagger lift out & in
        t.to(oldLines, { y: -34 * d, opacity: 0, duration: 0.38, ease: "power2.in", stagger: 0.03 }, 0);
        t.fromTo(newLines, { y: 44 * d, opacity: 0 }, { y: 0, opacity: 1, duration: 0.62, ease: "power3.out", stagger: 0.05 }, 0.25);

        // Media panel: vertical wipe
        if (newMedia && oldMedia) {
          t.fromTo(newMedia, { yPercent: -100 * d }, { yPercent: 0, duration: 0.9, ease: "power3.inOut" }, 0.12);
          t.fromTo(oldMedia, { yPercent: 0 }, { yPercent: 38 * d, duration: 0.9, ease: "power3.inOut" }, 0.12);
        }

        // Image subtle rotation & scale
        if (newImg && oldImg) {
          t.fromTo(newImg, { rotation: -7 * d, scale: 1.25 }, { rotation: 0, scale: 1, duration: 1.15, ease: "power2.out" }, 0.15);
          t.to(oldImg, { rotation: 5 * d, scale: 1.1 }, { rotation: 0, scale: 1, duration: 0.9, ease: "power2.in" }, 0.12);
        }

        currentTimeline = t;
      }

      function scrollToSlide(targetIndex, smooth = true) {
        if (!triggerInstance) return;
        const progress = targetIndex / steps;
        const scrollPos = triggerInstance.start + progress * (triggerInstance.end - triggerInstance.start);

        isAutoScrolling = true;
        if (window.lenis && typeof window.lenis.scrollTo === "function") {
          window.lenis.scrollTo(scrollPos, {
            duration: smooth ? 0.9 : 0.01,
            immediate: !smooth,
            onComplete: () => {
              isAutoScrolling = false;
            },
          });
        } else {
          window.scrollTo({
            top: scrollPos,
            behavior: smooth ? "smooth" : "instant",
          });
          setTimeout(() => {
            isAutoScrolling = false;
          }, 500);
        }
      }

      function scrollToNextSection() {
        if (!triggerInstance) return;
        stopAutoplay();
        isAutoScrolling = true;

        const targetPos = triggerInstance.end + 5;

        if (window.lenis && typeof window.lenis.scrollTo === "function") {
          window.lenis.scrollTo(targetPos, {
            duration: 1.2,
            onComplete: () => {
              isAutoScrolling = false;
            },
          });
        } else {
          window.scrollTo({
            top: targetPos,
            behavior: "smooth",
          });
          setTimeout(() => {
            isAutoScrolling = false;
          }, 700);
        }
      }

      function jump(to, dir) {
        const i = Math.max(0, Math.min(to, n - 1));
        go(i, dir);
        scrollToSlide(i, true);
        resetAutoplayTimer();
      }

      function startAutoplay() {
        stopAutoplay();
        if (!isSectionActive || isHovered || isUserInteracting) return;

        autoplayTimer = setTimeout(() => {
          if (!isSectionActive || isHovered || isUserInteracting || !triggerInstance) return;

          if (currentIndex < n - 1) {
            const nextIdx = currentIndex + 1;
            go(nextIdx, 1);
            scrollToSlide(nextIdx, true);
            startAutoplay();
          } else {
            scrollToNextSection();
          }
        }, AUTOPLAY_INTERVAL);
      }

      function stopAutoplay() {
        if (autoplayTimer) {
          clearTimeout(autoplayTimer);
          autoplayTimer = null;
        }
      }

      function resetAutoplayTimer() {
        stopAutoplay();
        if (isSectionActive && !isHovered && !isUserInteracting) {
          startAutoplay();
        }
      }

      function handleUserActivity() {
        isUserInteracting = true;
        stopAutoplay();
        if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
        userInteractionTimeout = setTimeout(() => {
          isUserInteracting = false;
          resetAutoplayTimer();
        }, 3000);
      }

      rootEl.addEventListener("mouseenter", () => {
        isHovered = true;
        stopAutoplay();
      });

      rootEl.addEventListener("mouseleave", () => {
        isHovered = false;
        resetAutoplayTimer();
      });

      window.addEventListener("wheel", () => {
        if (isSectionActive && !isAutoScrolling) {
          handleUserActivity();
        }
      }, { passive: true });

      window.addEventListener("touchstart", () => {
        if (isSectionActive && !isAutoScrolling) {
          handleUserActivity();
        }
      }, { passive: true });

      dotEls.forEach((dot) => {
        dot.addEventListener("click", () => {
          handleUserActivity();
          const target = parseInt(dot.getAttribute("data-dot-index"), 10);
          jump(target);
        });
      });

      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          handleUserActivity();
          if (currentIndex > 0) {
            jump(currentIndex - 1, -1);
          }
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          handleUserActivity();
          if (currentIndex < n - 1) {
            jump(currentIndex + 1, 1);
          } else {
            scrollToNextSection();
          }
        });
      }

      rootEl.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          handleUserActivity();
          if (currentIndex < n - 1) {
            jump(currentIndex + 1, 1);
          } else {
            scrollToNextSection();
          }
          e.preventDefault();
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          handleUserActivity();
          if (currentIndex > 0) {
            jump(currentIndex - 1, -1);
          }
          e.preventDefault();
        }
      });

      // ============================================================
      // GSAP SCROLLTRIGGER PINNING ("tb9a fix")
      // ============================================================
      const ST = window.ScrollTrigger;
      if (ST && ST.create) {
        const totalPinDistance = Math.round(window.innerHeight * steps * 0.95);

        triggerInstance = ST.create({
          trigger: container,
          start: "top top",
          end: () => "+=" + totalPinDistance,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => {
            isSectionActive = true;
            resetAutoplayTimer();
          },
          onEnterBack: () => {
            isSectionActive = true;
            resetAutoplayTimer();
          },
          onLeave: () => {
            isSectionActive = false;
            stopAutoplay();
          },
          onLeaveBack: () => {
            isSectionActive = false;
            stopAutoplay();
          },
          onUpdate: (self) => {
            if (isAutoScrolling) return;

            // Direct smooth scrub mapping to slide index
            const target = Math.min(n - 1, Math.round(self.progress * steps));
            if (target !== currentIndex) {
              go(target, self.direction > 0 ? 1 : -1);
              resetAutoplayTimer();
            }
          },
        });

        // Initialize state
        const initial = Math.min(n - 1, Math.round(triggerInstance.progress * steps));
        currentIndex = initial;
        updateActiveDot(initial);
        if (triggerInstance.isActive) {
          isSectionActive = true;
          startAutoplay();
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDeliveryFormatsSlider);
  } else {
    initDeliveryFormatsSlider();
  }

  window.addEventListener("load", () => {
    try {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      if (window.lenis) window.lenis.resize();
    } catch (e) {
      /* ignore */
    }
  });
})();
