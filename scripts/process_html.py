import os
import re
from urllib.parse import urlparse, unquote

def process_page(html, is_en_subfolder=False):
    prefix = "../" if is_en_subfolder else "./"

    # Replace CSS paths
    html = re.sub(r'href=["\'](?:https://www\.davidecarusio\.it/)?css/([^"\']+)["\']', 
                  lambda m: f'href="{prefix}css/{m.group(1)}"', html)

    # Replace JS paths
    js_replacements = {
        r'https://d3e54v103j8qbb\.cloudfront\.net/js/jquery-3\.5\.1\.min\.dc5e7f18c8\.js\?site=[^"\']+': f'{prefix}js/jquery-3.5.1.min.js',
        r'(?:https://www\.davidecarusio\.it/)?js/webflow\.js': f'{prefix}js/webflow.js',
        r'https://cdn\.jsdelivr\.net/npm/lenis@1\.3\.26/dist/lenis\.min\.js': f'{prefix}js/lenis.min.js',
        r'https://cdn\.prod\.website-files\.com/gsap/3\.15\.0/gsap\.min\.js': f'{prefix}js/gsap.min.js',
        r'https://cdn\.prod\.website-files\.com/gsap/3\.15\.0/CustomEase\.min\.js': f'{prefix}js/CustomEase.min.js',
        r'https://cdn\.prod\.website-files\.com/gsap/3\.15\.0/ScrollTrigger\.min\.js': f'{prefix}js/ScrollTrigger.min.js',
        r'https://cdn\.prod\.website-files\.com/gsap/3\.15\.0/SplitText\.min\.js': f'{prefix}js/SplitText.min.js',
        r'https://cdn\.jsdelivr\.net/gh/hiunicornstudio/unicornstudio\.js@v2\.2\.7/dist/unicornStudio\.umd\.js': f'{prefix}js/unicornStudio.umd.js',
        r'https://app\.cal\.eu/embed/embed\.js': f'{prefix}js/cal-embed.js'
    }

    for pattern, target in js_replacements.items():
        html = re.sub(pattern, target, html)

    # Replace Unicorn scene JSON
    html = re.sub(r'data-us-project-src=["\'][^"\']+flow_gradient_remix_scene\.json\.txt["\']',
                  f'data-us-project-src="{prefix}assets/flow_gradient_remix_scene.json.txt"', html)

    # Replace videos in pub-2ca688d8c3fd407b84f57655774d5927.r2.dev everywhere (including inside scripts)
    def replace_video_url(m):
        full = m.group(1)
        vname = unquote(os.path.basename(urlparse(full).path))
        return f'"{prefix}videos/{vname}"'

    html = re.sub(r'["\']https://pub-2ca688d8c3fd407b84f57655774d5927\.r2\.dev/([^"\']+\.mp4)["\']',
                  lambda m: f'"{prefix}videos/{unquote(os.path.basename(m.group(1)))}"', html)

    # Open graph image
    html = re.sub(r'https://cdn\.prod\.website-files\.com/[^"\']+Open%20graph\.webp',
                  f'{prefix}images/Open graph.webp', html)

    # Replace all images in attributes:
    def replace_img_src(m):
        attr = m.group(1) # src, data-src, href, etc.
        val = m.group(2)
        if re.search(r'\.(webp|avif|png|jpg|jpeg|svg|ico)(?:\?[^"\']*)?$', val, re.IGNORECASE):
            fname = unquote(os.path.basename(urlparse(val).path))
            return f'{attr}="{prefix}images/{fname}"'
        return m.group(0)

    html = re.sub(r'(src|data-src|data-thumb|href)=["\']([^"\']+\.(?:webp|avif|png|jpg|jpeg|svg|ico)(?:\?[^"\']*)?)["\']',
                  replace_img_src, html)

    # Replace srcset images
    def replace_srcset(m):
        raw = m.group(1)
        parts = raw.split(',')
        new_parts = []
        for p in parts:
            p_strip = p.strip()
            if not p_strip:
                continue
            segs = p_strip.split(' ')
            url_part = segs[0]
            desc = " " + segs[1] if len(segs) > 1 else ""
            fname = unquote(os.path.basename(urlparse(url_part).path))
            new_parts.append(f"{prefix}images/{fname}{desc}")
        return f'srcset="{", ".join(new_parts)}"'

    html = re.sub(r'srcset=["\']([^"\']+)["\']', replace_srcset, html)

    # Navigation links
    if is_en_subfolder:
        html = re.sub(r'href=["\'](?:https://(?:www\.)?davidecarusio\.it/|/)["\']', 'href="../index.html"', html)
        html = re.sub(r'href=["\'](?:https://(?:www\.)?davidecarusio\.it/en|/en)["\']', 'href="./index.html"', html)
    else:
        html = re.sub(r'href=["\'](?:https://(?:www\.)?davidecarusio\.it/en|/en)["\']', 'href="./en/index.html"', html)
        html = re.sub(r'href=["\'](?:https://(?:www\.)?davidecarusio\.it/|/)["\']', 'href="./index.html"', html)

    # Auto-redirect comment
    html = re.sub(r'if \(!lang\.startsWith\(\x27it\x27\)\) \{\s*window\.location\.replace\(\x27/en\x27\);\s*\}',
                  '// auto-redirect disabled for local development\n    // if (!lang.startsWith(\'it\')) { window.location.replace(\'./en/index.html\'); }',
                  html)

    return html

def main():
    # Also download Open graph.webp if needed
    og_url = "https://cdn.prod.website-files.com/6a3a84272e4493d30711d604/6ab39d3f8369fe34bbe6be02_Open%20graph.webp"
    import urllib.request, ssl
    ctx = ssl.create_default_context()
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        req = urllib.request.Request(og_url, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as r:
            with open("images/Open graph.webp", "wb") as f:
                f.write(r.read())
            print("Downloaded Open graph.webp")
    except Exception as e:
        print("Error downloading og image:", e)

    with open('index_raw.html', 'r', encoding='utf-8') as f:
        it_raw = f.read()
    with open('en_raw.html', 'r', encoding='utf-8') as f:
        en_raw = f.read()

    it_clean = process_page(it_raw, is_en_subfolder=False)
    en_clean_sub = process_page(en_raw, is_en_subfolder=True)
    en_clean_root = process_page(en_raw, is_en_subfolder=False)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(it_clean)
    with open('en.html', 'w', encoding='utf-8') as f:
        f.write(en_clean_root)
    with open('en/index.html', 'w', encoding='utf-8') as f:
        f.write(en_clean_sub)

    print("Generated localized HTML files successfully!")

if __name__ == '__main__':
    main()
