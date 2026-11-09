import os

SLIDER_HTML = """      <!-- ZOOM SLIDER COMPONENT SECTION -->
      <section class="zoom-slider-section" data-theme-section="dark" data-theme="dark">
        <div class="zoom-slider-header">
          <h2 class="zoom-slider-title">SPEAK Corporate Vault</h2>
          <p class="zoom-slider-subheading">Drag horizontally to explore high-impact scenarios</p>
        </div>

        <div class="zoom-slider-strip">
          <div class="zoom-slider-card">
            <div class="zoom-slider-text">
              <p data-number>01</p>
              <p data-title>Executive Alignment</p>
              <p data-desc>Boardroom impact and leadership discourse</p>
            </div>
            <div class="zoom-slider-image-wrap">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop" alt="Executive Alignment" />
            </div>
          </div>

          <div class="zoom-slider-card">
            <div class="zoom-slider-text">
              <p data-number>02</p>
              <p data-title>Strategic Keynotes</p>
              <p data-desc>Inspiring global summits and conventions</p>
            </div>
            <div class="zoom-slider-image-wrap">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop" alt="Strategic Keynotes" />
            </div>
          </div>

          <div class="zoom-slider-card">
            <div class="zoom-slider-text">
              <p data-number>03</p>
              <p data-title>High-Stakes Pitch</p>
              <p data-desc>Convincing investors and closing alliances</p>
            </div>
            <div class="zoom-slider-image-wrap">
              <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop" alt="High-Stakes Pitch" />
            </div>
          </div>

          <div class="zoom-slider-card">
            <div class="zoom-slider-text">
              <p data-number>04</p>
              <p data-title>Cross-Border Teams</p>
              <p data-desc>Multicultural harmony in Fortune 500 teams</p>
            </div>
            <div class="zoom-slider-image-wrap">
              <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop" alt="Cross-Border Teams" />
            </div>
          </div>

          <div class="zoom-slider-card">
            <div class="zoom-slider-text">
              <p data-number>05</p>
              <p data-title>Crisis Speech</p>
              <p data-desc>Calm authority under corporate pressure</p>
            </div>
            <div class="zoom-slider-image-wrap">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" alt="Crisis Speech" />
            </div>
          </div>

          <div class="zoom-slider-card">
            <div class="zoom-slider-text">
              <p data-number>06</p>
              <p data-title>Executive Retreats</p>
              <p data-desc>Intensive 3-day immersive communication</p>
            </div>
            <div class="zoom-slider-image-wrap">
              <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop" alt="Executive Retreats" />
            </div>
          </div>

          <div class="zoom-slider-card">
            <div class="zoom-slider-text">
              <p data-number>07</p>
              <p data-title>Media Training</p>
              <p data-desc>Broadcast confidence for CEOs and directors</p>
            </div>
            <div class="zoom-slider-image-wrap">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" alt="Media Training" />
            </div>
          </div>

          <div class="zoom-slider-card">
            <div class="zoom-slider-text">
              <p data-number>08</p>
              <p data-title>Change Dynamics</p>
              <p data-desc>Guiding restructuring with empathy and force</p>
            </div>
            <div class="zoom-slider-image-wrap">
              <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop" alt="Change Dynamics" />
            </div>
          </div>

          <div class="zoom-slider-card">
            <div class="zoom-slider-text">
              <p data-number>09</p>
              <p data-title>Workshop Labs</p>
              <p data-desc>Hands-on rhetorical mastery and voice control</p>
            </div>
            <div class="zoom-slider-image-wrap">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop" alt="Workshop Labs" />
            </div>
          </div>

          <div class="zoom-slider-card">
            <div class="zoom-slider-text">
              <p data-number>10</p>
              <p data-title>Diplomatic Protocol</p>
              <p data-desc>Refined speech for institutional forums</p>
            </div>
            <div class="zoom-slider-image-wrap">
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop" alt="Diplomatic Protocol" />
            </div>
          </div>
        </div>

        <div class="zoom-slider-nav-hint">
          <button type="button" class="zoom-slider-nav-btn" data-slider-prev aria-label="Previous slide">
            <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          </button>
          <span class="zoom-slider-counter">01 / 10</span>
          <button type="button" class="zoom-slider-nav-btn" data-slider-next aria-label="Next slide">
            <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        </div>
      </section>
      <!-- END ZOOM SLIDER SECTION -->
"""

ANCHOR = "<!-- END YOU CAN SCROLL COMPONENT SECTION -->"

def update_file(path, is_sub=False):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()

    prefix = "../" if is_sub else "./"
    css_tag = f'  <link href="{prefix}css/zoom-slider.css" rel="stylesheet" type="text/css" />\n'
    js_tag = f'  <script src="{prefix}js/zoom-slider.js" type="text/javascript"></script>\n'

    # Avoid duplicate
    if "zoom-slider-section" in html:
        print(f"Already updated {path}")
        return

    # Add CSS in head
    if "zoom-slider.css" not in html:
        head_idx = html.find("</head>")
        if head_idx != -1:
            html = html[:head_idx] + css_tag + html[head_idx:]

    # Add HTML right after ANCHOR
    anchor_idx = html.find(ANCHOR)
    if anchor_idx != -1:
        insert_pos = anchor_idx + len(ANCHOR)
        html = html[:insert_pos] + "\n" + SLIDER_HTML + html[insert_pos:]
    else:
        print(f"ANCHOR not found in {path}")
        return

    # Add JS before </body>
    body_idx = html.rfind("</body>")
    if body_idx != -1:
        html = html[:body_idx] + js_tag + html[body_idx:]

    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Successfully injected zoom slider into {path}")

update_file("index.html", False)
update_file("en.html", False)
update_file("en/index.html", True)

