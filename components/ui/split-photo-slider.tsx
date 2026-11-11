"use client"

import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  const g = (window as any).gsap || gsap
  const st = (window as any).ScrollTrigger || ScrollTrigger
  if (g && st && g.registerPlugin) {
    try {
      g.registerPlugin(st)
    } catch {
      /* ignore */
    }
  }
}

export type SplitSlide = {
  title: string
  description: string
  /** Photo for the panel. Portrait works best (about 9:10). */
  image: string
  /** Small round thumbnail for the seam. Falls back to the photo. */
  thumb?: string
  alt?: string
  /** Optional tags e.g. ["Bespoke", "Confidential"] */
  tags?: string[]
  /** Button label. Falls back to `ctaLabel`. */
  cta?: string
  href?: string
}

export type SplitSocial = { label: string; href: string; icon: "facebook" | "instagram" | "youtube" }

export type SplitPhotoSliderProps = {
  slides: SplitSlide[]
  /** Wordmark shown over the photo/stage, top left. */
  brand?: React.ReactNode
  socials?: SplitSocial[]
  /** Small vertical line of text, bottom left. */
  credit?: string
  ctaLabel?: string
  /** Button and line colour. */
  accent?: string
  titleFont?: string
  /** Page scroll per slide, as a fraction of `height`. */
  scrollPerSlide?: number
  /** Scrolling past the last slide comes round to the first, both ways. */
  loop?: boolean
  /** Stage height. Keep it a definite length; percentages collapse once installed. */
  height?: string
  className?: string
  /** Alternate photo and copy sides each slide (odd: photo right, text left; even: photo left, text right) */
  alternateSides?: boolean
  /** Automatic slide advancement while section is active */
  autoPlay?: boolean
  autoPlayInterval?: number
  onComplete?: () => void
  onChange?: (index: number) => void
  onCta?: (slide: SplitSlide, index: number) => void
}

export function wrap(i: number, n: number): number {
  return n > 0 ? ((i % n) + n) % n : 0
}

export function directionFor(from: number, to: number, n: number): 1 | -1 {
  const d = wrap(to - from, n)
  return d === 0 || d <= n / 2 ? 1 : -1
}

export function pad2(n: number): string {
  return n < 10 ? "0" + n : String(n)
}

export function spans(n: number, loop: boolean): number {
  return Math.max(0, loop ? n : n - 1)
}

export function stepAt(progress: number, steps: number): number {
  return Math.round(Math.min(1, Math.max(0, progress)) * steps)
}

export function scrollFor(s: number, steps: number, start: number, end: number): number {
  return steps > 0 ? start + (s / steps) * (end - start) : start
}

const CSS = `
.sps-track {
  position: relative;
  width: 100%;
  container-type: inline-size;
  background: #0f0f0f;
}
.sps-root {
  position: sticky;
  top: 0;
  overflow: hidden;
  width: 100%;
  color: var(--color-foreground, #ffffff);
  background: var(--color-background, #0f0f0f);
  font-family: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  outline: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.sps-root:focus-visible {
  box-shadow: inset 0 0 0 2px var(--sps-accent, #ffffff);
}
.sps-slides-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.sps-slide {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  visibility: hidden;
  overflow: hidden;
}
.sps-slide[data-on] {
  visibility: visible;
  z-index: 2;
}
.sps-media {
  position: relative;
  overflow: hidden;
  background: #141414;
}
.sps-img {
  position: absolute;
  inset: 0;
  transform-origin: 50% 50%;
}
.sps-img > img {
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  object-position: 50% 40%;
}
.sps-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 15, 15, 0.25) 0%, rgba(15, 15, 15, 0.55) 100%);
  pointer-events: none;
}
.sps-brand {
  position: absolute;
  z-index: 5;
  left: 5.5cqw;
  top: max(22px, 3.4cqw);
  margin: 0;
  font-weight: 700;
  font-size: clamp(13px, 1.3cqw, 20px);
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 0.55em;
  color: #ffffff;
}
.sps-credit {
  position: absolute;
  z-index: 5;
  left: max(18px, 2.4cqw);
  bottom: max(22px, 3.4cqw);
  margin: 0;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: clamp(9px, 0.8cqw, 13px);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
}
.sps-dots {
  position: absolute;
  z-index: 10;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 1.4cqw, 22px);
  margin: 0;
  padding: 0;
  list-style: none;
}
.sps-dot {
  display: block;
  width: clamp(24px, 2.5cqw, 42px);
  height: clamp(24px, 2.5cqw, 42px);
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  background: #1a1a1a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  opacity: 0.55;
  filter: grayscale(80%);
  transition: box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1), opacity 0.35s ease, filter 0.35s ease;
}
.sps-dot > img {
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
}
.sps-dot:hover {
  transform: scale(1.12);
  opacity: 0.85;
  filter: grayscale(20%);
}
.sps-dot[aria-current="true"] {
  opacity: 1;
  filter: grayscale(0%);
  transform: scale(1.18);
  border-color: #ffffff;
  box-shadow: 0 0 0 2px #ffffff, 0 6px 18px rgba(0, 0, 0, 0.6);
}
.sps-dot:focus-visible {
  outline: 2px solid var(--sps-accent, #ffffff);
  outline-offset: 3px;
}
.sps-panel {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 9cqw 0 11cqw;
  background: #0f0f0f;
}
.sps-slide[data-reversed="true"] {
  grid-template-columns: 1fr 1fr;
}
.sps-slide[data-reversed="true"] .sps-media {
  grid-column: 2;
  order: 2;
}
.sps-slide[data-reversed="true"] .sps-panel {
  grid-column: 1;
  order: 1;
  padding: 0 11cqw 0 9cqw;
}
.sps-social {
  position: absolute;
  top: max(22px, 3.4cqw);
  right: max(22px, 2.6cqw);
  display: flex;
  gap: clamp(10px, 1cqw, 16px);
  margin: 0;
  padding: 0;
  list-style: none;
  z-index: 5;
}
.sps-social a {
  display: block;
  color: var(--color-foreground, #ffffff);
  opacity: 0.75;
  transition: opacity 0.2s, transform 0.2s;
}
.sps-social a:hover {
  opacity: 1;
  transform: translateY(-2px);
}
.sps-social svg {
  display: block;
  width: clamp(12px, 1.2cqw, 18px);
  height: clamp(12px, 1.2cqw, 18px);
}
.sps-copy {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 32em;
}
.sps-count {
  position: relative;
  width: 2.8em;
  height: 2.4em;
  font-size: clamp(11px, 0.95cqw, 15px);
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1.2em;
  font-family: "DM Sans", monospace;
  letter-spacing: 0.08em;
}
.sps-now, .sps-all {
  position: absolute;
  line-height: 1;
}
.sps-now {
  left: 0;
  top: 0;
  color: #ffffff;
  font-weight: 700;
}
.sps-all {
  right: 0;
  bottom: 0;
  color: rgba(255, 255, 255, 0.4);
}
.sps-count > i {
  position: absolute;
  left: 0.35em;
  top: 50%;
  width: 2.2em;
  height: 1px;
  background: rgba(255, 255, 255, 0.25);
  transform: rotate(-48deg);
}
.sps-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
}
.sps-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.8rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
  font-size: clamp(10px, 0.75cqw, 12px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
}
.sps-title {
  margin: 0 0 0.55em;
  font-family: var(--sps-font, "Garet Heavy", "DM Sans", sans-serif);
  font-weight: 800;
  font-size: clamp(32px, 3.8cqw, 64px);
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: #ffffff;
}
.sps-desc {
  margin: 0 0 2.2em;
  max-width: 28em;
  font-size: clamp(13px, 1.15cqw, 18px);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.65);
}
.sps-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 13.5em;
  height: 3.4em;
  padding: 0 1.8em;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 9999px;
  cursor: pointer;
  font: inherit;
  font-size: clamp(10px, 0.82cqw, 13px);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  color: #0c0c0c;
  background: #ffffff;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
  transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
}
.sps-cta:hover {
  background: #e6e6e6;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
}
.sps-cta:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 3px;
}
.sps-arrows {
  position: absolute;
  right: max(22px, 2.6cqw);
  bottom: max(22px, 3.6cqw);
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 0.9cqw, 14px);
  z-index: 5;
}
.sps-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(34px, 2.6cqw, 44px);
  height: clamp(34px, 2.6cqw, 44px);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  cursor: pointer;
  color: #ffffff;
  opacity: 0.75;
  transition: opacity 0.2s, transform 0.2s, background 0.2s, border-color 0.2s;
}
.sps-arrow:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.4);
}
.sps-arrow:first-child:hover {
  transform: translateY(-2px);
}
.sps-arrow:last-child:hover {
  transform: translateY(2px);
}
.sps-arrow:focus-visible {
  outline: 2px solid #ffffff;
  opacity: 1;
}
.sps-arrow svg {
  display: block;
  width: 14px;
  height: 14px;
}
.sps-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@container (max-width: 768px) {
  .sps-slide, .sps-slide[data-reversed="true"] {
    grid-template-columns: 1fr;
    grid-template-rows: 48% 52%;
  }
  .sps-slide[data-reversed="true"] .sps-media {
    grid-column: 1;
    grid-row: 1;
    order: 1;
  }
  .sps-slide[data-reversed="true"] .sps-panel {
    grid-column: 1;
    grid-row: 2;
    order: 2;
  }
  .sps-brand {
    left: 20px;
    top: 18px;
    font-size: 13px;
  }
  .sps-credit {
    display: none;
  }
  .sps-dots {
    top: 48%;
    flex-direction: row;
    gap: 10px;
  }
  .sps-dot {
    width: 28px;
    height: 28px;
  }
  .sps-panel, .sps-slide[data-reversed="true"] .sps-panel {
    align-items: flex-start;
    padding: 34px 22px 22px;
  }
  .sps-social {
    display: none;
  }
  .sps-title {
    font-size: clamp(26px, 7.5cqw, 38px);
    margin-bottom: 0.35em;
  }
  .sps-desc {
    font-size: 13.5px;
    margin-bottom: 1.4em;
    line-height: 1.55;
  }
  .sps-cta {
    font-size: 10px;
    height: 3.2em;
    min-width: 12em;
  }
  .sps-count {
    font-size: 11px;
    margin-bottom: 0.6em;
  }
  .sps-arrows {
    right: 18px;
    bottom: 18px;
    flex-direction: row;
    gap: 12px;
  }
  .sps-arrow {
    width: 32px;
    height: 32px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sps-dot, .sps-arrow, .sps-cta, .sps-social a {
    transition: none;
  }
}
`

function ChevronUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export default function SplitPhotoSlider({
  slides,
  brand,
  socials = [],
  credit,
  ctaLabel = "Inquire now",
  accent = "#ffffff",
  titleFont = "'Garet Heavy', 'DM Sans', sans-serif",
  scrollPerSlide = 0.85,
  loop = false,
  height = "100svh",
  className,
  alternateSides = true,
  autoPlay = true,
  autoPlayInterval = 4200,
  onComplete,
  onChange,
  onCta,
}: SplitPhotoSliderProps) {
  const n = slides.length
  const steps = spans(n, loop)
  const [index, setIndex] = React.useState(0)
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const trackRef = React.useRef(null as HTMLDivElement | null)
  const slideRefs = React.useRef([] as (HTMLDivElement | null)[])
  const tl = React.useRef(null as gsap.core.Timeline | null)
  const st = React.useRef(null as ScrollTrigger | null)
  const current = React.useRef(0)
  const reduced = React.useRef(false)
  const autoTimerRef = React.useRef<any>(null)
  const isHoveredRef = React.useRef(false)
  const isInteractingRef = React.useRef(false)
  const isAutoScrollingRef = React.useRef(false)
  const isActiveRef = React.useRef(false)

  const onChangeRef = React.useRef(onChange)
  onChangeRef.current = onChange
  const onCompleteRef = React.useRef(onComplete)
  onCompleteRef.current = onComplete

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => {
      reduced.current = mq.matches
      setReducedMotion(mq.matches)
    }
    on()
    mq.addEventListener("change", on)
    return () => {
      mq.removeEventListener("change", on)
      tl.current?.kill()
    }
  }, [])

  const go = React.useCallback(
    (target: number, dir?: 1 | -1) => {
      const from = current.current
      const to = Math.max(0, Math.min(target, n - 1))
      if (to === from || n < 2) return
      const d = dir ?? (to > from ? 1 : -1)
      tl.current?.progress(1).kill()
      current.current = to
      setIndex(to)
      onChangeRef.current?.(to)

      const oldSlide = slideRefs.current[from]
      const newSlide = slideRefs.current[to]
      if (!oldSlide || !newSlide) return

      const oldImg = oldSlide.querySelector(".sps-img")
      const newImg = newSlide.querySelector(".sps-img")
      const oldMedia = oldSlide.querySelector(".sps-media")
      const newMedia = newSlide.querySelector(".sps-media")
      const oldLines = oldSlide.querySelectorAll("[data-sps-l]")
      const newLines = newSlide.querySelectorAll("[data-sps-l]")

      const g = (typeof window !== "undefined" && (window as any).gsap) || gsap

      g.set([oldSlide, newSlide], { visibility: "visible" })
      g.set(oldSlide, { zIndex: 1 })
      g.set(newSlide, { zIndex: 2 })

      const done = () => {
        g.set([oldSlide, newSlide], { clearProps: "visibility,zIndex" })
        if (oldMedia && newMedia) g.set([oldMedia, newMedia], { clearProps: "transform,opacity" })
        if (oldImg && newImg) g.set([oldImg, newImg], { clearProps: "transform,opacity" })
        g.set([oldLines, newLines], { clearProps: "transform,opacity" })
      }

      if (reduced.current) {
        const t = g.timeline({ onComplete: done })
        t.fromTo(newSlide, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "none" })
        tl.current = t
        return
      }

      const t = g.timeline({ onComplete: done })
      t.to(oldLines, { y: -34 * d, opacity: 0, duration: 0.42, ease: "power2.in", stagger: 0.04 }, 0)
      t.fromTo(newLines, { y: 44 * d, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", stagger: 0.06 }, 0.28)

      if (newMedia && oldMedia) {
        t.fromTo(newMedia, { yPercent: -100 * d }, { yPercent: 0, duration: 0.95, ease: "power3.inOut" }, 0.15)
        t.fromTo(oldMedia, { yPercent: 0 }, { yPercent: 40 * d, duration: 0.95, ease: "power3.inOut" }, 0.15)
      }
      if (newImg && oldImg) {
        t.fromTo(newImg, { rotation: -7 * d, scale: 1.25 }, { rotation: 0, scale: 1, duration: 1.2, ease: "power2.out" }, 0.18)
        t.to(oldImg, { rotation: 5 * d, scale: 1.1 }, { rotation: 0, scale: 1, duration: 0.95, ease: "power2.in" }, 0.15)
      }
      tl.current = t
    },
    [n],
  )

  const stopAutoplay = React.useCallback(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current)
      autoTimerRef.current = null
    }
  }, [])

  const startAutoplay = React.useCallback(() => {
    stopAutoplay()
    if (!autoPlay || !isActiveRef.current || isHoveredRef.current || isInteractingRef.current) return

    autoTimerRef.current = setTimeout(() => {
      if (!isActiveRef.current || isHoveredRef.current || isInteractingRef.current) return

      if (current.current < n - 1) {
        const next = current.current + 1
        go(next, 1)
        const s = st.current
        if (s && s.isActive) {
          isAutoScrollingRef.current = true
          const scrollPos = scrollFor(next, steps, s.start, s.end)
          const lenis = (window as any).lenis
          if (lenis && typeof lenis.scrollTo === "function") {
            lenis.scrollTo(scrollPos, {
              duration: 1.0,
              onComplete: () => {
                isAutoScrollingRef.current = false
              },
            })
          } else {
            window.scrollTo({ top: scrollPos, behavior: "smooth" })
            setTimeout(() => {
              isAutoScrollingRef.current = false
            }, 600)
          }
        }
        startAutoplay()
      } else {
        // Finished all slides -> pass to next section
        onCompleteRef.current?.()
      }
    }, autoPlayInterval)
  }, [autoPlay, autoPlayInterval, go, n, steps, stopAutoplay])

  // ScrollTrigger integration
  React.useEffect(() => {
    const track = trackRef.current
    if (!track || n < 2) return

    const ST = (typeof window !== "undefined" && (window as any).ScrollTrigger) || ScrollTrigger
    if (!ST || !ST.create) return

    const trigger = ST.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      snap: reducedMotion ? undefined : { snapTo: 1 / steps, duration: { min: 0.3, max: 0.75 }, delay: 0.08, ease: "power2.inOut" },
      onEnter: () => {
        isActiveRef.current = true
        startAutoplay()
      },
      onEnterBack: () => {
        isActiveRef.current = true
        startAutoplay()
      },
      onLeave: () => {
        isActiveRef.current = false
        stopAutoplay()
      },
      onLeaveBack: () => {
        isActiveRef.current = false
        stopAutoplay()
      },
      onUpdate: (self: any) => {
        if (isAutoScrollingRef.current) return
        const i = stepAt(self.progress, steps)
        if (i !== current.current) {
          go(i, self.direction > 0 ? 1 : -1)
          stopAutoplay()
          startAutoplay()
        }
      },
    })

    const first = stepAt(trigger.progress, steps)
    current.current = first
    setIndex(first)
    st.current = trigger

    if (trigger.isActive) {
      isActiveRef.current = true
      startAutoplay()
    }

    return () => {
      trigger.kill()
      st.current = null
      stopAutoplay()
    }
  }, [n, steps, loop, reducedMotion, go, startAutoplay, stopAutoplay])

  const jump = (to: number, dir?: 1 | -1) => {
    const i = Math.max(0, Math.min(to, n - 1))
    go(i, dir)
    const s = st.current
    if (s && s.isActive) {
      const scrollPos = scrollFor(i, steps, s.start, s.end)
      const lenis = (window as any).lenis
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(scrollPos, { duration: 0.9 })
      } else {
        window.scrollTo({ top: scrollPos, behavior: "smooth" })
      }
    }
    stopAutoplay()
    startAutoplay()
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      jump(current.current + 1, 1)
      e.preventDefault()
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      jump(current.current - 1, -1)
      e.preventDefault()
    }
  }

  if (n === 0) return null
  const style = {
    height,
    "--sps-accent": accent,
    "--sps-font": titleFont,
  } as React.CSSProperties

  return (
    <div
      ref={trackRef}
      className="sps-track"
      style={{ height: "calc(" + height + " * " + (1 + steps * scrollPerSlide) + ")" }}
    >
      <section
        className={"sps-root" + (className ? " " + className : "")}
        style={style}
        role="region"
        aria-roledescription="carousel"
        aria-label={typeof brand === "string" ? brand : "Delivery Formats"}
        tabIndex={0}
        onKeyDown={onKey}
        onMouseEnter={() => {
          isHoveredRef.current = true
          stopAutoplay()
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false
          startAutoplay()
        }}
      >
        <style>{CSS}</style>

        {brand ? <div className="sps-brand">{brand}</div> : null}
        {credit ? <p className="sps-credit">{credit}</p> : null}

        {/* Center seam dots navigation */}
        <ul className="sps-dots" aria-label="Choose a delivery format">
          {slides.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                className="sps-dot"
                aria-label={s.title}
                aria-current={i === index}
                onClick={() => jump(i)}
              >
                <img src={s.thumb ?? s.image} alt="" width={42} height={42} draggable={false} />
              </button>
            </li>
          ))}
        </ul>

        {/* Slides Container */}
        <div className="sps-slides-container">
          {slides.map((s, i) => {
            const isReversed = alternateSides && i % 2 === 1
            const isActive = i === index
            return (
              <div
                key={i}
                className="sps-slide"
                data-on={isActive ? "" : undefined}
                data-reversed={isReversed ? "true" : undefined}
                aria-hidden={!isActive}
                ref={(el) => {
                  slideRefs.current[i] = el
                }}
              >
                {/* Photo Column */}
                <div className="sps-media">
                  <div className="sps-img">
                    <img
                      src={s.image}
                      alt={s.alt ?? s.title}
                      width={1200}
                      height={1000}
                      draggable={false}
                      loading={isActive ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                  <div className="sps-img-overlay" />
                </div>

                {/* Content Panel Column */}
                <div className="sps-panel">
                  <div className="sps-copy" aria-live="polite">
                    <div className="sps-count" data-sps-l="">
                      <span className="sps-now" aria-hidden="true">
                        {pad2(i + 1)}
                      </span>
                      <i />
                      <span className="sps-all" aria-hidden="true">
                        {pad2(n)}
                      </span>
                      <span className="sps-sr">{"Format " + (i + 1) + " of " + n}</span>
                    </div>

                    {s.tags && s.tags.length > 0 ? (
                      <div className="sps-tags" data-sps-l="">
                        {s.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="sps-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <h2 className="sps-title" data-sps-l="">
                      {s.title}
                    </h2>

                    <p className="sps-desc" data-sps-l="">
                      {s.description}
                    </p>

                    <div data-sps-l="">
                      {s.href ? (
                        <a
                          className="sps-cta"
                          href={s.href}
                          tabIndex={isActive ? 0 : -1}
                          onClick={() => onCta?.(s, i)}
                        >
                          {s.cta ?? ctaLabel}
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="sps-cta"
                          tabIndex={isActive ? 0 : -1}
                          onClick={() => onCta?.(s, i)}
                        >
                          {s.cta ?? ctaLabel}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Up / Down navigation arrows */}
        <div className="sps-arrows">
          <button
            type="button"
            className="sps-arrow"
            aria-label="Previous format"
            onClick={() => jump(current.current - 1, -1)}
          >
            <ChevronUp />
          </button>
          <button
            type="button"
            className="sps-arrow"
            aria-label="Next format"
            onClick={() => jump(current.current + 1, 1)}
          >
            <ChevronDown />
          </button>
        </div>
      </section>
    </div>
  )
}
