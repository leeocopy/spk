import { createRoot } from "react-dom/client";
import { EarthBlaze } from "./ui/earth-blaze";

function mount() {
  document.querySelectorAll<HTMLElement>("[data-earth-hero]").forEach((el) => {
    if (el.dataset.mounted === "true") return;
    el.dataset.mounted = "true";
    createRoot(el).render(
      <EarthBlaze
        textureUrl="/images/earth-blue-marble.jpg"
        backgroundColor="#313130"
        auroraColor="#C3C3C2"
        galaxyBrightness={0.72}
        surfaceBrightness={1}
        illumination={1.05}
        auroraEnabled={true}
        auroraPreview={false}
        interactive={true}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", aspectRatio: "auto" }}
      >
        <div className="earth-hero__overlay">
          <span className="earth-hero__eyebrow">English Happens!</span>
          <h1>
            English
            <br />
            for the way
            <br />
            business
            <br />
            moves
          </h1>
          <div className="earth-hero__rule" aria-hidden="true" />
          <p>Corporate English for professionals, leaders and teams.</p>
        </div>
      </EarthBlaze>
    );
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
