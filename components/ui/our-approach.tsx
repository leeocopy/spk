"use client";

import { useState, useRef, useEffect } from "react";

declare global {
  interface Window {
    gsap?: any;
    ScrollTrigger?: any;
  }
}

export default function OurApproach() {
  const sectionRef = useRef<HTMLElement>(null);
  const pyramidRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    let ctx: any;
    let cancelled = false;

    const setupScrollAnimation = () => {
      if (cancelled) return false;
      if (typeof window === "undefined" || !window.gsap || !window.ScrollTrigger) {
        return false;
      }

      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const pyramid = pyramidRef.current;
      if (!section || !pyramid) return false;

      const tier1 = pyramid.querySelector(".oa-tier-situations");
      const tier2 = pyramid.querySelector(".oa-tier-practice");
      const tier3 = pyramid.querySelector(".oa-tier-confidence");

      if (!tier1 || !tier2 || !tier3) return false;

      ctx = gsap.context(() => {
        // Initial state before scrolling into view
        gsap.set(tier1, { y: 40, opacity: 0, scale: 0.94, transformOrigin: "50% 90%" });
        gsap.set(tier2, { y: 32, opacity: 0, scale: 0.92, transformOrigin: "50% 60%" });
        gsap.set(tier3, { y: 24, opacity: 0, scale: 0.88, transformOrigin: "50% 30%" });

        // Trigger animation as pyramid scrolls into view
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pyramid,
            start: "top 80%",
            end: "center 50%",
            scrub: 0.75,
            invalidateOnRefresh: true,
          },
        });

        tl.to(tier1, { y: 0, opacity: 1, scale: 1, ease: "power2.out", duration: 1 })
          .to(tier2, { y: 0, opacity: 1, scale: 1, ease: "power2.out", duration: 1 }, "-=0.45")
          .to(tier3, { y: 0, opacity: 1, scale: 1, ease: "power2.out", duration: 1 }, "-=0.45");
      }, section);

      return true;
    };

    if (!setupScrollAnimation()) {
      const interval = setInterval(() => {
        if (setupScrollAnimation()) clearInterval(interval);
      }, 80);
      return () => {
        cancelled = true;
        clearInterval(interval);
        ctx?.revert?.();
      };
    }

    return () => {
      cancelled = true;
      ctx?.revert?.();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="oa-section"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      aria-label="Our Approach"
    >
      <div className="oa-inner">
        {/* Logo & Quote Block */}
        <div className="oa-text-block">
          <div className="oa-portrait oa-portrait--logo">
            <img
              src="./images/brand/speak-logo-ribbons.png"
              alt="Speak"
              className="oa-portrait-img oa-portrait-img--logo"
              decoding="async"
              width={420}
              height={420}
            />
          </div>

          <div className="oa-quote">
            <span className="oa-quote-mark" aria-hidden="true">
              {"\u201C"}
            </span>

            <p className="oa-quote-text">
              We kept seeing the same pattern — professionals with real
              potential held back by English that works in theory but fails
              in meetings, presentations and negotiations. Speak exists to
              align practice, confidence and real business conversations into
              one clear path.
            </p>

            <div className="oa-attr">
              <p>Speak</p>
              <p>Corporate English &amp; Professional Experiences</p>
            </div>
          </div>
        </div>

        {/* Pyramid with GSAP Scroll Animation */}
        <div ref={pyramidRef} className="oa-pyramid-wrap">
          <svg
            className="oa-pyramid-svg"
            viewBox="0 0 100 95"
            fill="none"
            role="img"
            aria-label="Speak approach pyramid: Situations, Practice, Confidence"
          >
            <defs>
              <linearGradient id="oa-tier-base" x1="50" y1="62" x2="50" y2="92" gradientUnits="userSpaceOnUse">
                <stop stopColor="#303030" stopOpacity="0.85" />
                <stop offset="1" stopColor="#141414" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="oa-tier-mid" x1="50" y1="32" x2="50" y2="62" gradientUnits="userSpaceOnUse">
                <stop stopColor="#484848" stopOpacity="0.88" />
                <stop offset="1" stopColor="#1e1e1e" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="oa-tier-top" x1="50" y1="6" x2="50" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6c6c6c" stopOpacity="0.92" />
                <stop offset="1" stopColor="#2c2c2c" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* TIER 1: Situations (Bottom) */}
            <g
              className="oa-tier-group oa-tier-situations"
              data-tier="situations"
              onMouseEnter={() => setHovered("situations")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered("situations")}
              tabIndex={0}
              role="button"
              aria-label="01 Situations: Meetings, pitches and negotiations where English must work"
            >
              <polygon
                points="4,92 96,92 80,62 20,62"
                fill="url(#oa-tier-base)"
                stroke="white"
                strokeWidth={hovered === "situations" ? 0.65 : 0.35}
                strokeOpacity={hovered === "situations" ? 0.95 : 0.45}
                className="oa-pyramid-tier"
              />
              <text
                x="50"
                y="74"
                textAnchor="middle"
                fill="#ffffff"
                fillOpacity="0.95"
                fontFamily="DM Sans, sans-serif"
                fontSize="5.0"
                fontWeight="600"
                letterSpacing="0.06em"
                style={{ pointerEvents: "none" }}
              >
                01 · SITUATIONS
              </text>
              <text
                x="50"
                y="82"
                textAnchor="middle"
                fill="#ffffff"
                fillOpacity="0.75"
                fontFamily="DM Sans, sans-serif"
                fontSize="2.4"
                fontWeight="400"
                letterSpacing="0.015em"
                style={{ pointerEvents: "none" }}
              >
                Meetings, pitches &amp; negotiations where English must work
              </text>
            </g>

            {/* TIER 2: Practice (Middle) */}
            <g
              className="oa-tier-group oa-tier-practice"
              data-tier="practice"
              onMouseEnter={() => setHovered("practice")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered("practice")}
              tabIndex={0}
              role="button"
              aria-label="02 Practice: Coaching, workshops and events built around real work"
            >
              <polygon
                points="20,62 80,62 64,32 36,32"
                fill="url(#oa-tier-mid)"
                stroke="white"
                strokeWidth={hovered === "practice" ? 0.65 : 0.35}
                strokeOpacity={hovered === "practice" ? 0.95 : 0.45}
                className="oa-pyramid-tier"
              />
              <text
                x="50"
                y="44"
                textAnchor="middle"
                fill="#ffffff"
                fillOpacity="0.95"
                fontFamily="DM Sans, sans-serif"
                fontSize="4.6"
                fontWeight="600"
                letterSpacing="0.06em"
                style={{ pointerEvents: "none" }}
              >
                02 · PRACTICE
              </text>
              <text
                x="50"
                y="52"
                textAnchor="middle"
                fill="#ffffff"
                fillOpacity="0.78"
                fontFamily="DM Sans, sans-serif"
                fontSize="2.3"
                fontWeight="400"
                letterSpacing="0.015em"
                style={{ pointerEvents: "none" }}
              >
                Coaching, workshops &amp; events built around real work
              </text>
            </g>

            {/* TIER 3: Confidence (Top) */}
            <g
              className="oa-tier-group oa-tier-confidence"
              data-tier="confidence"
              onMouseEnter={() => setHovered("confidence")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered("confidence")}
              tabIndex={0}
              role="button"
              aria-label="03 Confidence: Presence, clarity and precision under pressure"
            >
              <polygon
                points="36,32 64,32 50,6"
                fill="url(#oa-tier-top)"
                stroke="white"
                strokeWidth={hovered === "confidence" ? 0.65 : 0.35}
                strokeOpacity={hovered === "confidence" ? 0.95 : 0.45}
                className="oa-pyramid-tier"
              />
              <text
                x="50"
                y="19"
                textAnchor="middle"
                fill="#ffffff"
                fillOpacity="0.98"
                fontFamily="DM Sans, sans-serif"
                fontSize="3.8"
                fontWeight="600"
                letterSpacing="0.06em"
                style={{ pointerEvents: "none" }}
              >
                03 · CONFIDENCE
              </text>
              <text
                x="50"
                y="25.5"
                textAnchor="middle"
                fill="#ffffff"
                fillOpacity="0.82"
                fontFamily="DM Sans, sans-serif"
                fontSize="2.0"
                fontWeight="400"
                letterSpacing="0.015em"
                style={{ pointerEvents: "none" }}
              >
                Presence, clarity &amp; precision
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
