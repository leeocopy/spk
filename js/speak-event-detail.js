(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || window.SPEAK_EVENTS_DEFAULT || "project-management-ai";
  const catalog = window.SPEAK_EVENTS || {};
  const event = catalog[id] || catalog[window.SPEAK_EVENTS_DEFAULT];

  if (!event) return;

  document.title = event.title + " · Speak Events";

  const setText = (sel, value) => {
    const el = document.querySelector(sel);
    if (el && value != null) el.textContent = value;
  };

  const upcoming = event.status === "upcoming";

  setText("#ed-tag", event.tag);
  setText("#ed-status-text", upcoming ? "À venir" : "Passé");
  setText("#ed-title", event.title);
  setText("#ed-lead", event.lead);
  setText("#ed-date", event.dateShort);
  setText("#ed-place", event.place);
  setText("#ed-time", event.time);
  setText("#ed-format", event.format);
  setText(
    "#ed-promise-intro",
    event.promiseIntro ||
      "Une journée Speak pour travailler l'anglais là où il compte."
  );
  setText("#ed-foot-date", event.dateLong);
  setText("#ed-foot-place", event.place);
  setText("#ed-foot-time", event.time);
  setText("#ed-foot-format", event.format);
  setText("#ed-speaker-name", event.speaker.name);
  setText("#ed-speaker-role", event.speaker.role);
  setText("#ed-speaker-bio", event.speaker.bio);

  const img = document.querySelector("#ed-image");
  if (img) {
    img.src = event.image;
    img.alt = event.title;
  }

  const speakerImg = document.querySelector("#ed-speaker-img");
  if (speakerImg) {
    speakerImg.src = event.speaker.image;
    speakerImg.alt = event.speaker.name;
  }

  const formEvent = document.querySelector("#ed-form-event");
  if (formEvent) formEvent.value = event.title;

  if (!upcoming) {
    document.body.classList.add("is-past-event");
    setText("#ed-nav-cta", "Voir les events");
    setText("#ed-seats", "Événement terminé");
    const navCta = document.querySelector("#ed-nav-cta");
    if (navCta) navCta.setAttribute("href", "./index.html#tedx-deck-section");
  }

  const valuesEl = document.querySelector("#ed-values");
  if (valuesEl) {
    valuesEl.innerHTML = (event.values || [])
      .map((text) => `<li>${text}</li>`)
      .join("");
  }

  const agendaEl = document.querySelector("#ed-agenda");
  if (agendaEl) {
    agendaEl.innerHTML = (event.agenda || [])
      .map((item) => {
        const breakClass = item.type === "break" ? " is-break" : "";
        const desc = item.desc
          ? `<p class="ed-agenda-desc">${item.desc}</p>`
          : "";
        return `<li class="ed-agenda-item${breakClass}">
          <span class="ed-agenda-time">${item.time}</span>
          <div>
            <p class="ed-agenda-title">${item.title}</p>
            ${desc}
          </div>
        </li>`;
      })
      .join("");
  }

  const audienceEl = document.querySelector("#ed-audience");
  if (audienceEl) {
    audienceEl.innerHTML = (event.audience || [])
      .map((item) => `<li>${item}</li>`)
      .join("");
  }

  const form = document.querySelector("#ed-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.querySelector("#ed-name")?.value || "";
      const company = document.querySelector("#ed-company")?.value || "";
      const email = document.querySelector("#ed-email")?.value || "";
      const phone = document.querySelector("#ed-phone")?.value || "";
      const subject = encodeURIComponent("Inscription — " + event.title);
      const body = encodeURIComponent(
        `Événement: ${event.title}\nNom: ${name}\nEntreprise: ${company}\nEmail: ${email}\nTéléphone: ${phone}`
      );
      window.location.href = `mailto:Contact@speak.ma?subject=${subject}&body=${body}`;
    });
  }
})();
