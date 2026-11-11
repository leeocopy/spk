import { createRoot } from "react-dom/client";
import OurApproach from "./ui/our-approach";

declare global {
  interface Window {
    ScrollTrigger?: { refresh: () => void };
    lenis?: { resize?: () => void };
  }
}

function refreshScrollSystems() {
  try {
    window.ScrollTrigger?.refresh();
  } catch {
    /* ignore */
  }
  try {
    window.lenis?.resize?.();
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("speak:layout"));
}

function scheduleRefresh() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      refreshScrollSystems();
    });
  });
}

function mount() {
  document.querySelectorAll<HTMLElement>("[data-our-approach]").forEach((el) => {
    if (el.dataset.mounted === "true") return;
    el.dataset.mounted = "true";
    createRoot(el).render(<OurApproach />);

    scheduleRefresh();
    setTimeout(refreshScrollSystems, 200);
    setTimeout(refreshScrollSystems, 600);
    window.addEventListener("load", refreshScrollSystems, { once: true });

    // Keep pin positions valid if the logo / fonts change height
    if (typeof ResizeObserver !== "undefined") {
      let timer = 0;
      const ro = new ResizeObserver(() => {
        window.clearTimeout(timer);
        timer = window.setTimeout(refreshScrollSystems, 80);
      });
      ro.observe(el);
    }

    el.querySelectorAll("img").forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", refreshScrollSystems, { once: true });
      }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
