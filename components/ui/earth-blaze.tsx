"use client";

import * as React from "react";
import { color, createRenderer, finite } from "./earth-blaze-gl";

/** NASA Blue Marble, January 2004, cloud-free topography. */
const EARTH_TEXTURE = "https://cdn.21st.dev/assets/mirror/97/9743175942473681d78838ca1042553dab4779cf957fb6d8f22a81fb796f7797.jpg";

export interface EarthBlazeProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Deterministic star field. Clamped to 0–5400. */
  starCount?: number;
  /** Nebula exposure, 0–3. Default 1 preserves the original artwork. */
  galaxyBrightness?: number;
  /** Earth exposure, 0–3. */
  surfaceBrightness?: number;
  /** Optional #RGB or #RRGGBB override. Omit to retain the original aurora palette. */
  auroraColor?: string;
  /** Optional #RGB or #RRGGBB override for the nebula. */
  backgroundColor?: string;
  /** Sun glow, atmospheric rim and Earth illumination, 0–3. Default 1. */
  illumination?: number;
  /** Keep auroral curtains visible while composing a scene. Default false. */
  auroraPreview?: boolean;
  auroraEnabled?: boolean;
  interactive?: boolean;
  /** Host the cloud-free equirectangular texture yourself, or use NASA's default. */
  textureUrl?: string;
  /** Omit to follow the operating system preference. */
  reducedMotion?: boolean;
}

/** A cloud-free Earth horizon. Give the container a height, or use its 16:10 ratio. */
export function EarthBlaze({
  className, style, children, starCount = 1800, galaxyBrightness = 1,
  surfaceBrightness = 1, auroraColor, backgroundColor, illumination = 1, auroraPreview = false, auroraEnabled = true, interactive = true,
  textureUrl = EARTH_TEXTURE, reducedMotion,
}: EarthBlazeProps) {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const fallback = React.useRef<HTMLDivElement>(null);
  const renderer = React.useRef<ReturnType<typeof createRenderer> | null>(null);
  const instructions = React.useId();
  const options = { starCount: Math.round(finite(starCount, 1800, 5400)),
    galaxyBrightness: finite(galaxyBrightness, 1, 3), surfaceBrightness: finite(surfaceBrightness, 1, 3),
    illumination: finite(illumination, 1, 3), auroraColor: color(auroraColor), backgroundColor: color(backgroundColor),
    auroraPreview, auroraEnabled, interactive, textureUrl, reducedMotion };
  const latest = React.useRef(options);
  latest.current = options;
  React.useEffect(() => {
    if (!canvas.current || !fallback.current) return;
    const instance = createRenderer(canvas.current, fallback.current, latest.current);
    renderer.current = instance;
    return () => { instance.dispose(); renderer.current = null; };
  }, []);
  React.useEffect(() => { renderer.current?.update(options); },
    [starCount, galaxyBrightness, surfaceBrightness, auroraColor, backgroundColor, illumination, auroraPreview, auroraEnabled, interactive, textureUrl, reducedMotion]);

  return (
    <div data-earth-blaze="" className={className} style={{ position: "relative", isolation: "isolate", overflow: "hidden", width: "100%", aspectRatio: "16 / 10", background: "#000", ...style }}>
      <style>{`[data-earth-blaze] > canvas:focus-visible { outline: 2px solid var(--color-ring, var(--ring, #a5c8ff)); outline-offset: -4px; }`}</style>
      <div ref={fallback} aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", background: "radial-gradient(ellipse at 32% 38%, #312034 0%, #101421 22%, #020308 52%, #000 78%)" }}>
        <div style={{ position: "absolute", width: "180%", height: "220%", left: "19%", top: "18%", borderRadius: "50%", background: "#000", boxShadow: "-2px -2px 3px #aa7c79, -8px -8px 38px #62406166", transform: "rotate(-28deg)" }} />
      </div>
      <canvas ref={canvas} tabIndex={interactive ? 0 : -1} role="img"
        aria-label="Earth Blaze: sunlight over Europe beneath a field of stars"
        aria-describedby={interactive ? instructions : undefined}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", touchAction: interactive ? "pan-y" : "auto" }} />
      {interactive && <span id={instructions} style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}>
        Move your pointer or drag horizontally to guide the light. Use arrow keys when focused. Hold Space to reveal Europe.
        {auroraEnabled && " Hold the pointer or Enter, then release for an aurora."} Press Escape or Home to reset. Reduced motion uses still illumination.
      </span>}
      {children && <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>{children}</div>}
    </div>
  );
}
