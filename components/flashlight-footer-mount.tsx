import { createRoot } from "react-dom/client";
import FlashlightTextReveal from "./ui/flashlight-text-reveal";

function mount() {
  document.querySelectorAll<HTMLElement>("[data-flashlight-footer]").forEach((el) => {
    if (el.dataset.mounted === "true") return;
    el.dataset.mounted = "true";
    createRoot(el).render(
      <FlashlightTextReveal
        // Exact Speak brand signature — Branding 2026
        text={"ENGLISH\nHAPPENS!"}
        textColor="#ffffff"
        ghost={0.12}
        fontFamily={'"Garet", "Garet Heavy", Arial, sans-serif'}
        fontSize="clamp(3.25rem, 11vw, 10.5rem)"
        wander
        radius={0.42}
        strength={1.15}
        colors={["#000000", "#313130", "#C3C3C2"]}
        speed={0.72}
        scale={2.35}
        intensity={0.55}
        contrast={0.94}
        brightness={-0.06}
        grain={0.14}
        drift={0.03}
        height="100svh"
        className="flashlight-footer-stage"
      />
    );

    // Keep the WebGL loop alive when the footer enters the viewport
    const wake = () => window.dispatchEvent(new Event("pointermove"));
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) wake();
        },
        { threshold: 0.15 }
      );
      io.observe(el);
    }
    window.addEventListener("resize", wake, { passive: true });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
