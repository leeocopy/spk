import os
import re
import ssl
import json
import urllib.request
from urllib.parse import urljoin, urlparse, unquote

ctx = ssl.create_default_context()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

BASE_URL = "https://www.davidecarusio.it"

def download_file(url, local_path):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        print(f"Already exists: {local_path}")
        return True
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            data = resp.read()
            with open(local_path, 'wb') as f:
                f.write(data)
        print(f"Downloaded: {url} -> {local_path} ({len(data)} bytes)")
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

def fetch_text(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

print("Fetching index.html and en.html...")
html_it = fetch_text(BASE_URL + "/")
html_en = fetch_text(BASE_URL + "/en")

if not html_it or not html_en:
    print("Failed to fetch HTML!")
    exit(1)

# Create folders
for d in ['css', 'js', 'images', 'fonts', 'videos', 'assets', 'en']:
    os.makedirs(d, exist_ok=True)

# 1. Download CSS files and their internal fonts/images
css_files = [
    'css/davidecarusio-it-v3.webflow.css',
    'css/normalize.css',
    'css/webflow.css'
]

font_urls = [
    'https://www.davidecarusio.it/fonts/Geist-Medium.woff2',
    'https://www.davidecarusio.it/fonts/Geist-Bold.woff2',
    'https://www.davidecarusio.it/fonts/GeistMono-SemiBold.woff2',
    'https://www.davidecarusio.it/fonts/FunnelDisplay-VariableFont_wght.ttf',
    'https://www.davidecarusio.it/fonts/Geist-SemiBold.woff2'
]

for f_url in font_urls:
    fname = os.path.basename(f_url)
    download_file(f_url, os.path.join('fonts', fname))

noise_img = 'https://www.davidecarusio.it/images/noise_1noise.avif'
download_file(noise_img, os.path.join('images', 'noise_1noise.avif'))

for css_rel in css_files:
    css_url = f"{BASE_URL}/{css_rel}"
    download_file(css_url, css_rel)

# 2. Download JS files
js_urls = [
    ('https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6a3a84272e4493d30711d604', 'js/jquery-3.5.1.min.js'),
    ('https://www.davidecarusio.it/js/webflow.js', 'js/webflow.js'),
    ('https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.min.js', 'js/lenis.min.js'),
    ('https://cdn.prod.website-files.com/gsap/3.15.0/gsap.min.js', 'js/gsap.min.js'),
    ('https://cdn.prod.website-files.com/gsap/3.15.0/CustomEase.min.js', 'js/CustomEase.min.js'),
    ('https://cdn.prod.website-files.com/gsap/3.15.0/ScrollTrigger.min.js', 'js/ScrollTrigger.min.js'),
    ('https://cdn.prod.website-files.com/gsap/3.15.0/SplitText.min.js', 'js/SplitText.min.js'),
    ('https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.7/dist/unicornStudio.umd.js', 'js/unicornStudio.umd.js'),
    ('https://app.cal.eu/embed/embed.js', 'js/cal-embed.js')
]

for url, local in js_urls:
    download_file(url, local)

# 3. Download Unicorn Scene JSON
scene_url = "https://cdn.prod.website-files.com/6a3a84272e4493d30711d604/6ab2613ff3b200149db78bf8_flow_gradient_remix_scene.json.txt"
download_file(scene_url, "assets/flow_gradient_remix_scene.json.txt")

# 4. Download Videos
video_urls = [
    'https://pub-2ca688d8c3fd407b84f57655774d5927.r2.dev/Jesuisvir%20Showreel-1-1.mp4',
    'https://pub-2ca688d8c3fd407b84f57655774d5927.r2.dev/Luca%20Maglierie%20Showreel-1-1.mp4',
    'https://pub-2ca688d8c3fd407b84f57655774d5927.r2.dev/Omar%20Essam%20Showreel-1-1.mp4',
    'https://pub-2ca688d8c3fd407b84f57655774d5927.r2.dev/Team%20App%20Showreel-1.mp4',
    'https://pub-2ca688d8c3fd407b84f57655774d5927.r2.dev/Vergnani%20Clip%20Casa%20Compressed-1.mp4'
]

for v in video_urls:
    vname = unquote(os.path.basename(v))
    download_file(v, os.path.join('videos', vname))

# 5. Extract and Download all images from both HTMLs
combined_html = html_it + "\n" + html_en

# Collect all image URLs
img_urls = set()

# Matches in src, data-src, srcset, og:image, link rel=shortcut icon, etc.
raw_urls = re.findall(r'(?:src|data-src|data-thumb|href)=["\']([^"\']+\.(?:png|jpg|jpeg|webp|avif|svg|ico)(?:\?[^"\']*)?)["\']', combined_html, re.IGNORECASE)
img_urls.update(raw_urls)

raw_srcsets = re.findall(r'srcset=["\']([^"\']+)["\']', combined_html, re.IGNORECASE)
for ss in raw_srcsets:
    for item in ss.split(','):
        clean = item.strip().split(' ')[0]
        if clean:
            img_urls.add(clean)

print(f"Total candidate images to download: {len(img_urls)}")
for img_ref in img_urls:
    full_url = urljoin(BASE_URL, img_ref)
    parsed = urlparse(full_url)
    img_name = unquote(os.path.basename(parsed.path))
    if not img_name:
        continue
    local_path = os.path.join('images', img_name)
    download_file(full_url, local_path)

print("All primary downloads triggered!")
