/* Speak responsive nav drawer */
(function () {
  function initSpeakNav() {
    const toggle = document.querySelector(".speak-menu-toggle");
    const drawer = document.querySelector("#speak-menu-drawer");
    if (!toggle || !drawer) return;

    const links = drawer.querySelectorAll("a[href^='#']");
    const mqDesktop = window.matchMedia("(min-width: 1200px)");

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.documentElement.classList.toggle("speak-menu-open", open);
      drawer.hidden = !open;
      if (window.lenis) {
        if (open) window.lenis.stop();
        else window.lenis.start();
      }
    }

    function close() {
      setOpen(false);
    }

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open);
    });

    links.forEach((link) => {
      link.addEventListener("click", () => close());
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    drawer.addEventListener("click", (e) => {
      if (e.target === drawer) close();
    });

    function onBreakpoint() {
      if (mqDesktop.matches) close();
    }

    if (mqDesktop.addEventListener) mqDesktop.addEventListener("change", onBreakpoint);
    else mqDesktop.addListener(onBreakpoint);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSpeakNav);
  } else {
    initSpeakNav();
  }
})();
