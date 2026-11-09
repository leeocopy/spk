import os

SECTION_HTML = """      <!-- YOU CAN SCROLL COMPONENT SECTION -->
      <section class="you-can-scroll-section" data-theme-section="dark" data-theme="dark">
        <header class="ycs-header">
          <h2 class="ycs-fluid ycs-title">
            you can<br />scroll.
          </h2>
        </header>
        <main class="ycs-main">
          <div class="ycs-content ycs-fluid">
            <div class="ycs-sticky-row">
              <h2 class="ycs-prefix">
                <span aria-hidden="true">you can&nbsp;</span>
                <span class="ycs-sr-only">you can ship things.</span>
              </h2>
              <ul class="ycs-list" aria-hidden="true" style="--count: 22">
                <li style="--i: 0">design.</li>
                <li style="--i: 1">prototype.</li>
                <li style="--i: 2">solve.</li>
                <li style="--i: 3">build.</li>
                <li style="--i: 4">develop.</li>
                <li style="--i: 5">debug.</li>
                <li style="--i: 6">learn.</li>
                <li style="--i: 7">cook.</li>
                <li style="--i: 8">ship.</li>
                <li style="--i: 9">prompt.</li>
                <li style="--i: 10">collaborate.</li>
                <li style="--i: 11">create.</li>
                <li style="--i: 12">inspire.</li>
                <li style="--i: 13">follow.</li>
                <li style="--i: 14">innovate.</li>
                <li style="--i: 15">test.</li>
                <li style="--i: 16">optimize.</li>
                <li style="--i: 17">teach.</li>
                <li style="--i: 18">visualize.</li>
                <li style="--i: 19">transform.</li>
                <li style="--i: 20">scale.</li>
                <li style="--i: 21">do it.</li>
              </ul>
            </div>
          </div>
          <div class="ycs-fin-wrap">
            <h2 class="ycs-fluid ycs-fin">fin.</h2>
          </div>
        </main>
        <footer class="ycs-footer">ʕ⊙ᴥ⊙ʔ jh3yy &copy; 2024</footer>
      </section>
      <!-- END YOU CAN SCROLL COMPONENT SECTION -->
"""

TARGET_TAG = '<section id="services" data-theme-section="dark" class="services_wrap section-dark">'

def process_file(filepath, is_subfolder=False):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} (does not exist)")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    prefix = "../" if is_subfolder else "./"

    css_link = f'  <link href="{prefix}css/you-can-scroll.css" rel="stylesheet" type="text/css" />\n'
    js_tags = f"""  <script type="module">
    import {{ Pane }} from '{prefix}js/tweakpane.min.js';
    window.Pane = Pane;
  </script>
  <script src="{prefix}js/you-can-scroll.js" type="text/javascript"></script>
"""

    # Check if already added
    if 'you-can-scroll-section' in html:
        print(f"Already updated {filepath}")
        return

    # Add CSS in head before </head>
    if 'you-can-scroll.css' not in html:
        head_idx = html.find('</head>')
        if head_idx != -1:
            html = html[:head_idx] + css_link + html[head_idx:]

    # Add Section before TARGET_TAG
    target_idx = html.find(TARGET_TAG)
    if target_idx != -1:
        html = html[:target_idx] + SECTION_HTML + html[target_idx:]
    else:
        print(f"ERROR: Target tag not found in {filepath}")
        return

    # Add JS before </body>
    body_idx = html.rfind('</body>')
    if body_idx != -1:
        html = html[:body_idx] + js_tags + html[body_idx:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Successfully updated {filepath}")

process_file('index.html', is_subfolder=False)
process_file('en.html', is_subfolder=False)
process_file('en/index.html', is_subfolder=True)

