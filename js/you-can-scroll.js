/* ============================================================
   YOU CAN SCROLL — Monochrome Kinetic Typography Controller
   Brand lockup exits upward as "You can" takes the stage.
   ============================================================ */

(function () {
  function initYouCanScroll() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      setTimeout(initYouCanScroll, 50);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector(".you-can-scroll-section");
    const items = gsap.utils.toArray(".ycs-list li");
    if (!items || !items.length) return;

    const header = section ? section.querySelector(".ycs-header") : null;
    const prefix = section ? section.querySelector(".ycs-prefix") : null;

    if (header) {
      gsap.set(header, { opacity: 1, y: 0 });

      // As soon as "You can" reaches stage, send With Speak + mark upward.
      gsap.to(header, {
        opacity: 0,
        y: -72,
        ease: "power2.in",
        scrollTrigger: {
          trigger: prefix || items[0],
          start: "top 62%",
          end: "top 42%",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });
    }

    const inactive = { opacity: 0.28 };
    const active = { opacity: 0.92 };

    gsap.set(items, {
      opacity: (i) => (i === 0 ? active.opacity : inactive.opacity),
      scale: 1,
      filter: "none",
      color: (i) => (i === 0 ? "#ffffff" : "#c3c3c2"),
      webkitTextFillColor: (i) => (i === 0 ? "#ffffff" : "#c3c3c2"),
    });

    const step = 0.85;
    const dimmer = gsap.timeline();
    for (let i = 0; i < items.length; i++) {
      if (i > 0) {
        dimmer.to(
          items[i],
          {
            opacity: active.opacity,
            color: "#ffffff",
            webkitTextFillColor: "#ffffff",
            duration: step,
            ease: "power1.inOut",
          },
          (i - 1) * step
        );
      }
      if (i < items.length - 1) {
        dimmer.to(
          items[i],
          {
            opacity: inactive.opacity,
            color: "#c3c3c2",
            webkitTextFillColor: "#c3c3c2",
            duration: step,
            ease: "power1.inOut",
          },
          i * step
        );
      }
    }

    ScrollTrigger.create({
      trigger: items[0],
      endTrigger: items[items.length - 1],
      start: "center center",
      end: "center center",
      animation: dimmer,
      scrub: 0.65,
    });

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initYouCanScroll);
  } else {
    initYouCanScroll();
  }
})();
