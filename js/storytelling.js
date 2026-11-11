/* ============================================================
   STORYTELLING — Scroll Text Highlight Controller
   Desktop: pins section while words illuminate
   Mobile: no pin — photo and text scroll normally; text still highlights
   ============================================================ */

(function () {
  function initStorytelling() {
    const section = document.querySelector(".storytelling-section");
    if (!section) return;

    if (section.dataset.initialized === "true") return;
    section.dataset.initialized = "true";

    const descEl = section.querySelector(".storytelling-desc");
    if (!descEl) return;

    const pElements = descEl.querySelectorAll("p");
    if (pElements.length > 0) {
      pElements.forEach((p) => {
        const words = p.textContent.trim().split(/\s+/).filter(Boolean);
        p.innerHTML = words
          .map((word) => `<span class="originkit-word">${word}</span>`)
          .join(" ");
      });
    } else {
      const rawText = descEl.textContent.trim();
      const words = rawText.split(/\s+/).filter(Boolean);
      descEl.innerHTML = words
        .map((word) => `<span class="originkit-word">${word}</span>`)
        .join(" ");
    }

    const targets = descEl.querySelectorAll(".originkit-word");

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      targets.forEach((t) => (t.style.color = "#FFFFFF"));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    gsap.set(targets, { color: "rgba(255, 255, 255, 0.18)" });

    const mm = gsap.matchMedia();

    // Desktop: pinned reveal
    mm.add("(min-width: 992px)", () => {
      const tl = gsap.timeline();
      tl.to(targets, {
        color: "#FFFFFF",
        stagger: 0.1,
        ease: "none",
      });

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => "+=" + Math.round(window.innerHeight * 1.8),
        pin: true,
        pinSpacing: true,
        scrub: 0.3,
        anticipatePin: 1,
        animation: tl,
      });

      return () => {
        st.kill();
        tl.kill();
        gsap.set(targets, { color: "rgba(255, 255, 255, 0.18)" });
      };
    });

    function refreshPinnedStory() {
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      if (window.lenis && window.lenis.resize) window.lenis.resize();
    }
    window.addEventListener("speak:layout", refreshPinnedStory);
    setTimeout(refreshPinnedStory, 200);
    setTimeout(refreshPinnedStory, 700);

    // Mobile / tablet: no sticky — free scroll + highlight
    mm.add("(max-width: 991px)", () => {
      const tl = gsap.timeline();
      tl.to(targets, {
        color: "#FFFFFF",
        stagger: 0.08,
        ease: "none",
      });

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 40%",
        scrub: 0.45,
        pin: false,
        animation: tl,
      });

      return () => {
        st.kill();
        tl.kill();
        gsap.set(targets, { color: "rgba(255, 255, 255, 0.18)" });
      };
    });

    setTimeout(() => {
      ScrollTrigger.refresh();
      if (window.lenis && window.lenis.resize) window.lenis.resize();
    }, 300);

    window.addEventListener("resize", () => {
      ScrollTrigger.refresh();
      if (window.lenis && window.lenis.resize) window.lenis.resize();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStorytelling);
  } else {
    initStorytelling();
  }
})();
