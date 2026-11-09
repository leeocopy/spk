"use client";
import { useEffect } from "react";
import "@/index.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Pane } from "tweakpane";

export default function ScrollAnimation() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const config = {
      theme: "dark",
      animate: true,
      snap: true,
      start: 0,
      end: 360,
      scroll: true,
      debug: false,
    };

    const ctrl = new Pane({ title: "Config", expanded: false });
    let items: HTMLElement[] = [],
      dimmerScrub: ScrollTrigger | undefined;

    const update = () => {
      document.documentElement.dataset.theme = config.theme;
      document.documentElement.dataset.syncScrollbar = String(config.scroll);
      document.documentElement.dataset.animate = String(config.animate);
      document.documentElement.dataset.snap = String(config.snap);
      document.documentElement.dataset.debug = String(config.debug);
      document.documentElement.style.setProperty("--start", String(config.start));
      document.documentElement.style.setProperty("--hue", String(config.start));
      document.documentElement.style.setProperty("--end", String(config.end));
      document.documentElement.style.setProperty("--chroma", "0.32");
      document.documentElement.style.setProperty("--base-chroma", "0.32");
      document.documentElement.style.setProperty("--lightness", "72%");

      if (!config.animate) {
        dimmerScrub?.disable(true, false);
        gsap.set(items, { opacity: 1, scale: 1 });
      } else {
        gsap.set(items, { opacity: (i) => (i !== 0 ? 0.18 : 1) });
        dimmerScrub?.enable(true, true);
      }
    };

    ctrl.addBinding(config, "animate", { label: "Animate" });
    ctrl.addBinding(config, "snap", { label: "Snap" });
    ctrl.addBinding(config, "scroll", { label: "Scrollbar" });
    ctrl.addBinding(config, "theme", {
      label: "Theme",
      options: { Dark: "dark", Light: "light", System: "system" },
    });

    ctrl.on("change", update);

    items = gsap.utils.toArray("ul li");
    gsap.set(items, { opacity: (i) => (i !== 0 ? 0.18 : 1), scale: (i) => (i !== 0 ? 0.98 : 1) });

    const dimmer = gsap.timeline();
    for (let i = 0; i < items.length; i++) {
      if (i > 0) {
        dimmer.to(items[i], { opacity: 1, scale: 1, duration: 0.5, ease: "power1.inOut" }, (i - 1) * 0.5);
      }
      if (i < items.length - 1) {
        dimmer.to(items[i], { opacity: 0.18, scale: 0.98, duration: 0.5, ease: "power1.inOut" }, i * 0.5);
      }
    }

    dimmerScrub = ScrollTrigger.create({
      trigger: items[0],
      endTrigger: items[items.length - 1],
      start: "center center",
      end: "center center",
      animation: dimmer,
      scrub: 0.2,
    });

    update();

    return () => {
      ctrl.dispose();
      dimmerScrub?.kill();
    };
  }, []);

  return (
    <>
      <main className="ycs-main">
        <section className="ycs-content ycs-fluid">
          <div className="ycs-sticky-row">
            <h2 className="ycs-prefix">you can</h2>
            <ul className="ycs-list" aria-hidden="true" style={{ "--count": 22 } as React.CSSProperties}>
              {[
                "design.","prototype.","solve.","build.","develop.","debug.","learn.","cook.","ship.","prompt.",
                "collaborate.","create.","inspire.","follow.","innovate.","test.","optimize.","teach.","visualize.",
                "transform.","scale.","do it."
              ].map((text, i) => (
                <li key={i} style={{ "--i": i } as React.CSSProperties}>{text}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
