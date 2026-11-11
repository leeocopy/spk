import { createRoot } from "react-dom/client";
import GlyphPortal from "./ui/glyph-portal";

/** Match site --dark-bg so the portal exit blends into sticky-title. */
const SPEAK_DARK = "#1c1c1b";

const SPEAK_FONT = '"Garet", Arial, sans-serif';

const SPEAK_STYLE = {
  "--gp-paper": "#ffffff",
  "--gp-ink": "#000000",
  "--gp-field": SPEAK_DARK,
  "--gp-foreground": "#ffffff",
  fontFamily: SPEAK_FONT,
} as const;

const fieldBackground = (
  <div
    data-gp-default-field=""
    style={{
      position: "absolute",
      inset: 0,
      transform: "scale(var(--gp-field-scale,1))",
      background: [
        "radial-gradient(circle at 16% 10%, rgba(195,195,194,0.14), transparent 36%)",
        "radial-gradient(circle at 84% 22%, rgba(255,255,255,0.06), transparent 30%)",
        "radial-gradient(circle at 50% 80%, rgba(28,28,27,0.95), transparent 48%)",
        `linear-gradient(145deg, ${SPEAK_DARK} 0%, #313130 48%, ${SPEAK_DARK} 100%)`,
      ].join(", "),
    }}
  />
);

function resolveFont() {
  // Logo / wordmark face from Speak charter: Garet Book (not Heavy).
  try {
    if (document.fonts?.check?.('500 100px "Garet"', "Speak")) {
      return SPEAK_FONT;
    }
  } catch {
    /* fall through */
  }
  return SPEAK_FONT;
}

type LenisLike = {
  resize?: () => void;
  scrollTo?: (v: number, opts?: object) => void;
  options?: { wheelMultiplier?: number };
};

function getLenis() {
  return (window as Window & { lenis?: LenisLike }).lenis;
}

function syncScrollSystems() {
  getLenis()?.resize?.();
  (window as Window & { ScrollTrigger?: { refresh: () => void } }).ScrollTrigger?.refresh?.();
}

function resetToPortalStart() {
  const lenis = getLenis();
  if (lenis?.scrollTo) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

function Hero() {
  const fontFamily = resolveFont();
  const baseWheel = 1;
  return (
    <GlyphPortal
      word="Speak"
      focusChar="e"
      fontFamily={fontFamily}
      fontWeight={500}
      scrollLength={2.55}
      interactive={false}
      annotations={false}
      enterLabel="Enter Speak"
      className="speak-glyph-portal"
      style={{ ...SPEAK_STYLE, fontFamily }}
      background={fieldBackground}
      onProgress={(progress) => {
        const lenis = getLenis();
        if (!lenis?.options) return;
        // Slow the wheel while zooming through the letter so Lenis can't skip the anim.
        lenis.options.wheelMultiplier = progress > 0.02 && progress < 0.92 ? 0.28 : baseWheel;
      }}
      front={
        <>
          <p data-speak-eyebrow="">English for the way business moves</p>
          <p data-speak-support="">English Happens!</p>
          <span data-speak-scroll="">Enter ↓</span>
        </>
      }
    >
      {/* Empty arrival — continue into the page after the letter zoom. */}
      <div data-speak-inside-empty="" aria-hidden="true" />
    </GlyphPortal>
  );
}

function mount() {
  document.querySelectorAll<HTMLElement>("[data-glyph-hero]").forEach((el) => {
    if (el.dataset.mounted === "true") return;
    el.dataset.mounted = "true";
    const render = () => {
      createRoot(el).render(<Hero />);
      requestAnimationFrame(() => {
        syncScrollSystems();
        // Stay on the white SPEAK frame after late React mount / loader.
        if (!window.location.hash) resetToPortalStart();
        setTimeout(syncScrollSystems, 120);
        setTimeout(() => {
          syncScrollSystems();
          if (!window.location.hash) resetToPortalStart();
        }, 600);
      });
    };
    if (document.fonts?.ready) {
      void document.fonts.ready.then(render, render);
    } else {
      render();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
