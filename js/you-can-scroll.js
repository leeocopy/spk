/* ============================================================
   YOU CAN SCROLL — Monochrome Kinetic Typography Controller
   Pure Black, White & Silver Gradient Theme
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
    if (header) {
      gsap.set(header, { opacity: 1, y: 0 });

      // Stays 100% visible when the section arrives with "You can lead." in center.
      // Has a stable dwell zone so the entire section ("With Speak" + "You can lead.")
      // is completely visible at rest, and only smoothly fades out when the user scrolls
      // past "lead." (between 40px and 150px) before "negotiate." arrives.
      gsap.fromTo(
        header,
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -28,
          ease: "power2.out",
          scrollTrigger: {
            trigger: items[0],
            start: "center center-=40",
            end: "center center-=150",
            scrub: 0.1,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    let dimmerScrub = null;

    // Initial state: first item bright, others dimmed
    gsap.set(items, {
      opacity: (i) => (i !== 0 ? 0.22 : 1),
      scale: (i) => (i !== 0 ? 1 : 1.04),
      filter: (i) =>
        i !== 0
          ? "brightness(0.65)"
          : "brightness(1.35) drop-shadow(0 0 35px rgba(255, 255, 255, 0.45))",
    });

    const dimmer = gsap.timeline();
    for (let i = 0; i < items.length; i++) {
      if (i > 0) {
        dimmer.to(
          items[i],
          {
            opacity: 1,
            scale: 1.04,
            filter: "brightness(1.35) drop-shadow(0 0 35px rgba(255, 255, 255, 0.45))",
            duration: 0.5,
            ease: "power1.inOut",
          },
          (i - 1) * 0.5
        );
      }
      if (i < items.length - 1) {
        dimmer.to(
          items[i],
          {
            opacity: 0.22,
            scale: 1,
            filter: "brightness(0.65)",
            duration: 0.5,
            ease: "power1.inOut",
          },
          i * 0.5
        );
      }
    }

    dimmerScrub = ScrollTrigger.create({
      trigger: items[0],
      endTrigger: items[items.length - 1],
      start: "center center",
      end: "center center",
      animation: dimmer,
      scrub: 0.2,
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
