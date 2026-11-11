import { createRoot } from "react-dom/client";
import SplitPhotoSlider, { type SplitSlide } from "./ui/split-photo-slider";

declare global {
  interface Window {
    ScrollTrigger?: { refresh: () => void };
    lenis?: { resize?: () => void };
  }
}

const deliveryFormatsSlides: SplitSlide[] = [
  {
    title: "Executive 1:1 Coaching",
    description: "Private, tailored English coaching designed for executives and senior professionals navigating high-stakes communication, negotiations and international leadership.",
    image: "./images/formats/format-01-executive-coaching.jpg?v=1",
    tags: ["Bespoke", "Confidential"],
    cta: "Inquire Now",
    href: "mailto:Contact@speak.ma?subject=Inquiry%20-%20Executive%201:1%20Coaching",
  },
  {
    title: "Corporate English Training",
    description: "Tailored English development programmes that equip teams with the communication skills to collaborate, perform and grow across borders.",
    image: "./images/formats/format-02-corporate-training.jpg?v=1",
    tags: ["Corporate", "Tailored"],
    cta: "Inquire Now",
    href: "mailto:Contact@speak.ma?subject=Inquiry%20-%20Corporate%20English%20Training",
  },
  {
    title: "Executive Workshops",
    description: "Intensive, interactive experiences focused on public speaking, negotiation, presentations and leadership communication in English.",
    image: "./images/formats/format-03-executive-workshops.jpg?v=1",
    tags: ["Interactive", "High-impact"],
    cta: "Inquire Now",
    href: "mailto:Contact@speak.ma?subject=Inquiry%20-%20Executive%20Workshops",
  },
  {
    title: "Corporate Seminars & Experiences",
    description: "Immersive learning experiences that combine professional development, team interaction and meaningful communication.",
    image: "./images/formats/format-04-corporate-seminars.jpg?v=1",
    tags: ["Immersive", "Team Development"],
    cta: "Inquire Now",
    href: "mailto:Contact@speak.ma?subject=Inquiry%20-%20Corporate%20Seminars",
  },
  {
    title: "Business Networking & Events",
    description: "Curated professional gatherings designed to encourage meaningful conversations, new connections and confident English communication.",
    image: "./images/formats/format-05-networking-events.jpg?v=1",
    tags: ["Networking", "Community"],
    cta: "Inquire Now",
    href: "mailto:Contact@speak.ma?subject=Inquiry%20-%20Networking%20Events",
  },
];

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
  document.querySelectorAll<HTMLElement>("[data-delivery-formats]").forEach((el) => {
    if (el.dataset.mounted === "true") return;
    el.dataset.mounted = "true";

    createRoot(el).render(
      <SplitPhotoSlider
        slides={deliveryFormatsSlides}
        brand={
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <img
              src="./images/speak-ribbon-mark.svg"
              alt="Speak"
              style={{ width: "22px", height: "auto" }}
            />
            <span style={{ fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>
              Our Delivery Formats
            </span>
          </div>
        }
        credit="Speak · Professional Experiences"
        alternateSides={true}
        height="100vh"
        scrollPerSlide={0.8}
        loop={false}
      />
    );

    scheduleRefresh();
    setTimeout(refreshScrollSystems, 200);
    setTimeout(refreshScrollSystems, 600);
    window.addEventListener("load", refreshScrollSystems, { once: true });

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

