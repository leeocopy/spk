import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

url = 'https://www.igloo.inc'
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, context=ctx) as r:
        html = r.read().decode('utf-8', errors='ignore')
        print(f"Status: {r.status}, Length: {len(html)}")
        
        # Save html
        with open('scripts/igloo_raw.html', 'w', encoding='utf-8') as f:
            f.write(html)
            
        # check video tags
        videos = re.findall(r'<video[^>]*>.*?</video>', html, re.DOTALL | re.IGNORECASE)
        print(f"Videos found: {len(videos)}")
        for v in videos:
            print("VIDEO TAG:", v[:400])
        
        # check mp4/webm/mov
        media_urls = re.findall(r'https?://[^\s"\'<>]+\.(?:mp4|webm|mov|m4v)', html, re.IGNORECASE)
        print(f"Media URLs found: {len(media_urls)}")
        for m in set(media_urls):
            print("MEDIA:", m)
            
        # relative video/media
        rel_media = re.findall(r'["\']([^"\']+\.(?:mp4|webm|mov|m4v))["\']', html, re.IGNORECASE)
        print("Relative Media:", set(rel_media))

        # check canvas/three/spline/lottie/rive/webgl
        canvas = re.findall(r'<canvas[^>]*>', html, re.IGNORECASE)
        print(f"Canvas tags: {len(canvas)}")
        
        # Check all script tags
        scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\']', html)
        print(f"Scripts count: {len(scripts)}")
        for s in scripts:
            print("SCRIPT:", s)

except Exception as e:
    print("Error:", e)

