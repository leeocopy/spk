/* ============================================================
   STORYTELLING — Pinned Scroll Text Highlight Controller
   - Locks section in place when fully visible in viewport
   - Animates words sequentially from dim to pure bright white
   - Unpins and proceeds to lower sections ONLY when text completes
   ============================================================ */

(function () {
  function initStorytelling() {
    const section = document.querySelector(".storytelling-section");
    if (!section) return;

    if (section.dataset.initialized === "true") return;
    section.dataset.initialized = "true";

    const descEl = section.querySelector(".storytelling-desc");
    if (!descEl) return;

    // Split text into words (Originkit ScrollTextHighlight logic)
    const rawText = descEl.textContent.trim();
    const words = rawText.split(/\s+/).filter(Boolean);

    descEl.innerHTML = words
      .map(
        (word) =>
          `<span class="originkit-word">${word}</span>`
      )
      .join(" ");

    const targets = descEl.querySelectorAll(".originkit-word");
    const isMobile = window.innerWidth <= 640;

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // Initial state: dim
      gsap.set(targets, { color: "rgba(255, 255, 255, 0.18)" });

      // Highlight timeline: illuminates words one by one
      const highlightTimeline = gsap.timeline();
      highlightTimeline.to(targets, {
        color: "#FFFFFF",
        stagger: 0.1,
        ease: "none",
      });

      // Pin the section: locks when fully visible, unpins only after text finishes
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => "+=" + Math.round(window.innerHeight * (isMobile ? 1.0 : 1.4)),
        pin: true,
        pinSpacing: true,
        scrub: 0.3, // Nimble, light, butter-smooth
        anticipatePin: 1,
        animation: highlightTimeline,
      });

      // Refresh ScrollTrigger and sync with Lenis
      setTimeout(() => {
        ScrollTrigger.refresh();
        if (typeof window.lenis !== "undefined" && window.lenis.resize) {
          window.lenis.resize();
        }
      }, 300);

      window.addEventListener("resize", () => {
        ScrollTrigger.refresh();
        if (typeof window.lenis !== "undefined" && window.lenis.resize) {
          window.lenis.resize();
        }
      });
    } else {
      // Fallback
      targets.forEach((t) => (t.style.color = "#FFFFFF"));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStorytelling);
  } else {
    initStorytelling();
  }
})();
