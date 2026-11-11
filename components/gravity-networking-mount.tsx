import { createRoot } from "react-dom/client";
import GravityStars from "./ui/gravity-stars";

function mount() {
  document.querySelectorAll<HTMLElement>("[data-gravity-networking]").forEach((el) => {
    if (el.dataset.mounted === "true") return;
    el.dataset.mounted = "true";
    createRoot(el).render(
      <GravityStars
        className="gs-fill"
        color="#C3C3C2"
        connect
        connectDistance={120}
        count={240}
        tint={0.35}
        glow={4.8}
        gravity={0.9}
      >
        <div className="networking-panel">
          <span className="networking-eyebrow">Networking</span>
          <h2 className="networking-title">
            Where professionals
            <br />
            meet in English
          </h2>
          <div className="networking-rule" aria-hidden="true" />
          <p className="networking-copy">
            Speak Events create space for meaningful professional exchanges — ideas,
            introductions and conversations that continue beyond the room.
          </p>
          <a
            className="networking-cta"
            href="mailto:Contact@speak.ma?subject=Networking%20-%20SPEAK"
            data-interactive=""
          >
            Join the next gathering
          </a>
        </div>
      </GravityStars>
    );
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
