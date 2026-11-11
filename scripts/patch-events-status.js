const fs = require("fs");

const paths = [
  "c:/Users/huaweui/Downloads/Speak site/spk-main/en.html",
  "c:/Users/huaweui/Downloads/Speak site/spk-main/index.html",
];

function patch(html) {
  html = html.replace(
    /<section id="tedx-deck-section" class="tedx-deck-section" data-theme-section="dark" data-theme="dark" aria-label="Annual Event Showcase by Year">\s*<div class="tedx-slider-container">/,
    `<section id="tedx-deck-section" class="tedx-deck-section" data-theme-section="dark" data-theme="dark" aria-label="Speak Events">
        <div class="tedx-deck-header">
          <p class="tedx-deck-eyebrow">Speak Events</p>
          <h2 class="tedx-deck-title">Past &amp; upcoming gatherings</h2>
          <p class="tedx-deck-sub">Workshops, talks and professional evenings — scroll to explore.</p>
        </div>
        <div class="tedx-slider-container">`
  );

  // Year 15 upcoming
  html = html.replace(
    /<!-- Year 15 -->\s*<div class="tedx-card-col">\s*<a href="\.\/event.html\?year=15" class="tedx-card" aria-label="Year 15">/,
    `<!-- Year 15 — Upcoming -->
            <div class="tedx-card-col">
              <a href="./event.html?year=15" class="tedx-card is-upcoming" data-event-status="upcoming" aria-label="Year 15 — Upcoming event">`
  );

  // Inject brand + status for year 15 once
  if (!html.includes('tedx-status--upcoming')) {
    html = html.replace(
      /(class="tedx-card is-upcoming"[^>]*>[\s\S]*?<div class="tedx-card-inner">)/,
      `$1
                  <div class="tedx-card-top">
                    <div class="tedx-brand">
                      <span class="tedx-brand-name">Speak</span>
                      <span class="tedx-brand-tag">Events</span>
                    </div>
                  </div>`
    );

    html = html.replace(
      /(<a href="\.\/event.html\?year=15"[\s\S]*?<span class="tedx-date-text">Save the Date<br>May 29, 2027<\/span>\s*<\/div>)/,
      `$1
                  <span class="tedx-status tedx-status--upcoming">Upcoming event</span>`
    );
  }

  // Remaining cards → past
  html = html.replace(
    /<a href="\.\/event.html\?year=(\d+)" class="tedx-card" aria-label="([^"]*)">/g,
    (m, year, label) => {
      if (year === "15") return m;
      return `<a href="./event.html?year=${year}" class="tedx-card is-past" data-event-status="past" aria-label="${label} — Past event">`;
    }
  );

  // Past status badges after date wraps for past cards
  html = html.replace(
    /(<a href="\.\/event.html\?year=(?!15)\d+"[\s\S]*?<div class="tedx-date-wrap">\s*<span class="tedx-date-text">[\s\S]*?<\/span>\s*<\/div>)(?!\s*<span class="tedx-status)/g,
    `$1
                  <span class="tedx-status tedx-status--past">Past event</span>`
  );

  return html;
}

for (const p of paths) {
  const before = fs.readFileSync(p, "utf8");
  const after = patch(before);
  fs.writeFileSync(p, after);
  console.log(
    p.split("/").pop(),
    "upcoming:",
    (after.match(/is-upcoming/g) || []).length,
    "past:",
    (after.match(/is-past/g) || []).length,
    "past badges:",
    (after.match(/tedx-status--past/g) || []).length
  );
}
