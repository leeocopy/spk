const fs = require("fs");

const SECTION = `<!-- Speak Events — Past & Upcoming cards -->
      <section id="tedx-deck-section" class="tedx-deck-section speak-events-section" data-theme-section="dark" data-theme="dark" aria-label="Speak Events">
        <div class="tedx-slider-container">
          <div class="tedx-track speak-events-track">

            <div class="tedx-card-col speak-events-col">
              <a href="mailto:Contact@speak.ma?subject=Past%20Event%20-%20Executive%20Communication" class="tedx-card se-card is-past" data-event-status="past" aria-label="Past event — Executive Communication in English">
                <div class="se-media">
                  <img src="./images/formats/format-03-executive-workshops.jpg?v=1" alt="" loading="lazy">
                </div>
                <div class="se-overlay" aria-hidden="true"></div>
                <div class="se-inner">
                  <div class="se-top">
                    <span class="se-date">May 09, 2025</span>
                    <div class="se-brand">
                      <span class="se-brand-speak">Speak</span>
                      <span class="se-brand-events">Events</span>
                    </div>
                  </div>
                  <div class="se-mid">
                    <span class="se-tag">Workshop</span>
                    <h3 class="se-title">Executive Communication in English</h3>
                  </div>
                  <div class="se-bottom">
                    <p class="se-loc">
                      <svg class="se-pin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>
                      Marrakech
                    </p>
                    <span class="se-cta">Past event</span>
                  </div>
                </div>
              </a>
            </div>

            <div class="tedx-card-col speak-events-col">
              <a href="mailto:Contact@speak.ma?subject=Past%20Event%20-%20Leading%20Meetings" class="tedx-card se-card is-past" data-event-status="past" aria-label="Past event — Leading Meetings with Clarity">
                <div class="se-media">
                  <img src="./images/formats/format-02-corporate-training.jpg?v=1" alt="" loading="lazy">
                </div>
                <div class="se-overlay" aria-hidden="true"></div>
                <div class="se-inner">
                  <div class="se-top">
                    <span class="se-date">Apr 18, 2026</span>
                    <div class="se-brand">
                      <span class="se-brand-speak">Speak</span>
                      <span class="se-brand-events">Events</span>
                    </div>
                  </div>
                  <div class="se-mid">
                    <span class="se-tag">Seminar</span>
                    <h3 class="se-title">Leading Meetings with Clarity</h3>
                  </div>
                  <div class="se-bottom">
                    <p class="se-loc">
                      <svg class="se-pin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>
                      Marrakech
                    </p>
                    <span class="se-cta">Past event</span>
                  </div>
                </div>
              </a>
            </div>

            <div class="tedx-card-col speak-events-col">
              <a href="mailto:Contact@speak.ma?subject=Upcoming%20Event%20-%20AI%20Business%20English" class="tedx-card se-card is-upcoming" data-event-status="upcoming" aria-label="Upcoming event — AI &amp; Business English">
                <div class="se-media">
                  <img src="./images/formats/format-01-executive-coaching.jpg?v=1" alt="" loading="lazy">
                </div>
                <div class="se-overlay" aria-hidden="true"></div>
                <div class="se-glow" aria-hidden="true"></div>
                <div class="se-inner">
                  <div class="se-top">
                    <span class="se-date">Dec 12, 2026</span>
                    <div class="se-brand">
                      <span class="se-brand-speak">Speak</span>
                      <span class="se-brand-events">Events</span>
                    </div>
                  </div>
                  <div class="se-mid">
                    <span class="se-tag">Workshop</span>
                    <h3 class="se-title">AI &amp; Business English</h3>
                    <p class="se-desc">Practice the conversations that matter when tools and teams move fast.</p>
                  </div>
                  <div class="se-bottom">
                    <p class="se-loc">
                      <svg class="se-pin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>
                      Marrakech
                    </p>
                    <span class="se-cta">Upcoming event</span>
                  </div>
                </div>
              </a>
            </div>

            <div class="tedx-card-col speak-events-col">
              <a href="mailto:Contact@speak.ma?subject=Upcoming%20Event%20-%20Pitch%20with%20Presence" class="tedx-card se-card is-upcoming" data-event-status="upcoming" aria-label="Upcoming event — Pitch with Presence">
                <div class="se-media">
                  <img src="./images/formats/format-04-corporate-seminars.jpg?v=1" alt="" loading="lazy">
                </div>
                <div class="se-overlay" aria-hidden="true"></div>
                <div class="se-glow" aria-hidden="true"></div>
                <div class="se-inner">
                  <div class="se-top">
                    <span class="se-date">Jan 23, 2027</span>
                    <div class="se-brand">
                      <span class="se-brand-speak">Speak</span>
                      <span class="se-brand-events">Events</span>
                    </div>
                  </div>
                  <div class="se-mid">
                    <span class="se-tag">Public speak</span>
                    <h3 class="se-title">Pitch with Presence</h3>
                    <p class="se-desc">Own the room: structure, voice and confidence under pressure.</p>
                  </div>
                  <div class="se-bottom">
                    <p class="se-loc">
                      <svg class="se-pin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>
                      Marrakech
                    </p>
                    <span class="se-cta">Upcoming event</span>
                  </div>
                </div>
              </a>
            </div>

            <div class="tedx-card-col speak-events-col">
              <a href="mailto:Contact@speak.ma?subject=Upcoming%20Event%20-%20Evening%20Conversations" class="tedx-card se-card is-upcoming" data-event-status="upcoming" aria-label="Upcoming event — Evening Conversations">
                <div class="se-media">
                  <img src="./images/formats/format-05-networking-events.jpg?v=1" alt="" loading="lazy">
                </div>
                <div class="se-overlay" aria-hidden="true"></div>
                <div class="se-glow" aria-hidden="true"></div>
                <div class="se-inner">
                  <div class="se-top">
                    <span class="se-date">Mar 06, 2027</span>
                    <div class="se-brand">
                      <span class="se-brand-speak">Speak</span>
                      <span class="se-brand-events">Events</span>
                    </div>
                  </div>
                  <div class="se-mid">
                    <span class="se-tag">Networking</span>
                    <h3 class="se-title">Evening Conversations</h3>
                    <p class="se-desc">Meet professionals in English — ideas, introductions, real exchange.</p>
                  </div>
                  <div class="se-bottom">
                    <p class="se-loc">
                      <svg class="se-pin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>
                      Marrakech
                    </p>
                    <span class="se-cta">Upcoming event</span>
                  </div>
                </div>
              </a>
            </div>

          </div>
          <button type="button" class="tedx-nav-btn tedx-nav-prev is-hidden" aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style="transform: scaleX(-1);"><path d="M5 2l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button type="button" class="tedx-nav-btn tedx-nav-next" aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M5 2l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </section>
      <!-- END Speak Events -->`;

const paths = [
  "c:/Users/huaweui/Downloads/Speak site/spk-main/en.html",
  "c:/Users/huaweui/Downloads/Speak site/spk-main/index.html",
];

const re =
  /<!-- TEDxPortland Hero Event Deck[\s\S]*?<!-- END TEDxPortland Hero Event Deck -->|<!-- Speak Events — Past & Upcoming cards -->[\s\S]*?<!-- END Speak Events -->|<section id="tedx-deck-section"[\s\S]*?<!-- END TEDxPortland Hero Event Deck -->/;

for (const p of paths) {
  let html = fs.readFileSync(p, "utf8");
  if (!re.test(html)) {
    // fallback: from section id to next services section
    html = html.replace(
      /<section id="tedx-deck-section"[\s\S]*?(?=\s*<section id="services")/,
      SECTION + "\n\n      "
    );
  } else {
    html = html.replace(re, SECTION);
  }
  fs.writeFileSync(p, html);
  console.log(
    p.split("/").pop(),
    "cards",
    (html.match(/se-card/g) || []).length,
    "upcoming",
    (html.match(/is-upcoming/g) || []).length,
    "past",
    (html.match(/se-card is-past/g) || []).length
  );
}
