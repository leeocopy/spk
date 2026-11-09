import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

url = "https://www.igloo.inc/assets/App3D-d68cb154.js"
req = urllib.request.Request(url, headers=headers)
content = urllib.request.urlopen(req, context=ctx).read().decode('utf-8', errors='ignore')

print(f"App3D length: {len(content)}")
with open('scripts/App3D.js', 'w', encoding='utf-8') as f:
    f.write(content)

# Search for assets in App3D
# Videos
videos = re.findall(r'["\']([^"\']+\.(?:mp4|webm|mov|m4v))["\']', content, re.IGNORECASE)
print("Videos in App3D:", set(videos))

# Models / Shaders / Binary
models = re.findall(r'["\']([^"\']+\.(?:gltf|glb|bin|obj|fbx|json|hdr|exr|png|jpg|webp))["\']', content, re.IGNORECASE)
print("Assets in App3D:", set(models))

# URLs
urls = re.findall(r'https?://[^\s"\'<>)]+', content)
print(f"URLs found in App3D: {len(urls)}")
for u in set(urls):
    print(" -", u)

# Check for three / webgl keywords
for kw in ['three', 'webgl', 'wireframe', 'igloo', 'canvas', 'video', 'shader', 'geometry', 'sphere', 'dome']:
    cnt = len(re.findall(kw, content, re.IGNORECASE))
    print(f"Keyword '{kw}': {cnt} occurrences")

