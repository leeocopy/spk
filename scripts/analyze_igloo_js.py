import urllib.request
import ssl
import re
from urllib.parse import urljoin

ctx = ssl.create_default_context()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

js_url = "https://www.igloo.inc/assets/index-2e130bc1.js"
req = urllib.request.Request(js_url, headers=headers)
js_content = urllib.request.urlopen(req, context=ctx).read().decode('utf-8', errors='ignore')

print(f"JS Length: {len(js_content)}")

with open('scripts/igloo_bundle.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

# Search for video, mp4, webm, mov, webgl, canvas, three, gltf, glb
videos = re.findall(r'["\']([^"\']+\.(?:mp4|webm|mov|m4v))["\']', js_content, re.IGNORECASE)
print("Videos in JS:", set(videos))

models = re.findall(r'["\']([^"\']+\.(?:gltf|glb|obj|fbx|spline|json))["\']', js_content, re.IGNORECASE)
print("3D models / JSON in JS:", set(models))

# Search for any asset paths in /assets/
assets = re.findall(r'["\'](?:/assets/|assets/|https://www\.igloo\.inc/assets/)([^"\']+)["\']', js_content)
print(f"Assets found: {len(assets)}")
for a in sorted(set(assets))[:30]:
    print(" -", a)

# Search for strings containing 'video' or 'intro' or 'loader' or 'igloo'
for kw in ['video', 'intro', 'loader', 'loading', 'webm', 'mp4']:
    matches = re.findall(rf'[^"\'`]{{0,30}}{kw}[^"\'`]{{0,30}}', js_content, re.IGNORECASE)
    print(f"Keyword '{kw}' matches (sample): {len(matches)}")
    for m in matches[:5]:
        print("  *", m)

