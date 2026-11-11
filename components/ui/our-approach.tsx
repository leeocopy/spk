"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Tier = {
  id: string;
  step: string;
  label: string;
  detail: string;
  points: string;
};

/** Speak approach pyramid — Situations → Practice → Confidence */
const TIERS: Tier[] = [
  {
    id: "situations",
    step: "01",
    label: "Situations",
    detail: "Meetings, pitches, negotiations — where English must work.",
    points: "4,86 96,86 78,56 22,56",
  },
  {
    id: "practice",
    step: "02",
    label: "Practice",
    detail: "Coaching, workshops and events built around real work.",
    points: "22,56 78,56 64,28 36,28",
  },
  {
    id: "confidence",
    step: "03",
    label: "Confidence",
    detail: "Presence, clarity and precision under pressure.",
    points: "36,28 64,28 50,4",
  },
];

const fade = (inView: boolean, delay = 0) => ({
  initial: { opacity: 0 },
  animate: inView ? { opacity: 1 } : { opacity: 0 },
  transition: { duration: 0.55, delay, ease: EASE },
});

export default function OurApproach() {
  const ref = useRef<HTMLElement>(null);
  // amount (not negative margin) — more stable with Lenis scrub
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [hovered, setHovered] = useState<string>("practice");

  const active = TIERS.find((t) => t.id === hovered) ?? TIERS[1];

  return (
    <section
      ref={ref}
      id="approach"
      className="oa-section"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      aria-label="Our Approach"
    >
      <div className="oa-inner">
        <div className="oa-header">
          <div className="oa-header-titles">
            <motion.p className="oa-title-muted" {...fade(inView, 0)}>
              Our Comprehensive
            </motion.p>
            <motion.h2 className="oa-title-main" {...fade(inView, 0.08)}>
              Approach
            </motion.h2>
          </div>

          <motion.a
            href="#projects"
            className="oa-plus"
            aria-label="Explore programmes"
            {...fade(inView, 0.15)}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </motion.a>
        </div>

        <div className="oa-content">
          <div className="oa-text-block">
            <motion.div className="oa-portrait oa-portrait--logo" {...fade(inView, 0.12)}>
              <img
                src="./images/brand/speak-logo-ribbons.png"
                alt="Speak"
                className="oa-portrait-img oa-portrait-img--logo"
                decoding="async"
                width={420}
                height={420}
              />
            </motion.div>

            <div className="oa-quote">
              <motion.span className="oa-quote-mark" {...fade(inView, 0.18)} aria-hidden="true">
                {"\u201C"}
              </motion.span>

              <motion.p className="oa-quote-text" {...fade(inView, 0.22)}>
                We kept seeing the same pattern — professionals with real
                potential held back by English that works in theory but fails
                in meetings, presentations and negotiations. Speak exists to
                align practice, confidence and real business conversations into
                one clear path.
              </motion.p>

              <motion.div className="oa-attr" {...fade(inView, 0.28)}>
                <p>Speak</p>
                <p>Corporate English & Professional Experiences</p>
              </motion.div>
            </div>
          </div>

          <div className="oa-diagram">
            <motion.div className="oa-pyramid" {...fade(inView, 0.2)}>
              <svg
                className="oa-pyramid-svg"
                viewBox="0 0 100 90"
                fill="none"
                role="img"
                aria-label="Speak approach pyramid: Situations, Practice, Confidence"
              >
                <defs>
                  <linearGradient id="oa-tier-base" x1="50" y1="56" x2="50" y2="86" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#c3c3c2" stopOpacity="0.22" />
                    <stop offset="1" stopColor="#c3c3c2" stopOpacity="0.08" />
                  </linearGradient>
                  <linearGradient id="oa-tier-mid" x1="50" y1="28" x2="50" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" stopOpacity="0.28" />
                    <stop offset="1" stopColor="#c3c3c2" stopOpacity="0.12" />
                  </linearGradient>
                  <linearGradient id="oa-tier-top" x1="50" y1="4" x2="50" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" stopOpacity="0.55" />
                    <stop offset="1" stopColor="#ffffff" stopOpacity="0.18" />
                  </linearGradient>
                </defs>

                {TIERS.map((tier, i) => {
                  const isActive = hovered === tier.id;
                  const fills = [
                    "url(#oa-tier-base)",
                    "url(#oa-tier-mid)",
                    "url(#oa-tier-top)",
                  ];
                  return (
                    <polygon
                      key={tier.id}
                      points={tier.points}
                      fill={fills[i]}
                      stroke="white"
                      strokeWidth={isActive ? 0.6 : 0.3}
                      strokeOpacity={isActive ? 1 : 0.38}
                      className="oa-pyramid-tier"
                      onMouseEnter={() => setHovered(tier.id)}
                      onClick={() => setHovered(tier.id)}
                      onFocus={() => setHovered(tier.id)}
                      tabIndex={0}
                      role="button"
                      aria-label={`${tier.label}: ${tier.detail}`}
                    />
                  );
                })}

                <text x="50" y="75" textAnchor="middle" fill="#ffffff" fillOpacity="0.9" fontFamily="DM Sans, sans-serif" fontSize="5.2" fontWeight="500" letterSpacing="0.04em" style={{ pointerEvents: "none" }}>
                  Situations
                </text>
                <text x="50" y="46" textAnchor="middle" fill="#ffffff" fillOpacity="0.94" fontFamily="DM Sans, sans-serif" fontSize="5" fontWeight="500" letterSpacing="0.04em" style={{ pointerEvents: "none" }}>
                  Practice
                </text>
                <text x="50" y="20" textAnchor="middle" fill="#ffffff" fillOpacity="0.96" fontFamily="DM Sans, sans-serif" fontSize="4.2" fontWeight="600" letterSpacing="0.02em" style={{ pointerEvents: "none" }}>
                  Confidence
                </text>
              </svg>

              {/* No remount key — avoids layout jump while scrolling / hovering */}
              <div className="oa-pyramid-caption">
                <div className="oa-pyramid-caption-head">
                  <span className="oa-pyramid-step">{active.step}</span>
                  <p className="oa-pyramid-caption-title">{active.label}</p>
                </div>
                <p className="oa-pyramid-caption-detail">{active.detail}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
