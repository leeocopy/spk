import urllib.request
import ssl
import os

ctx = ssl.create_default_context()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

base = "https://www.igloo.inc/assets/geometries/"
files = [
    'igloo.drc',
    'igloo/igloo_cage.drc',
    'igloo/igloo_outline.drc',
    'igloo/patch.drc',
    'intro_particles.drc'
]

os.makedirs('scripts/igloo_assets/igloo', exist_ok=True)

for f in files:
    url = base + f
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as r:
            data = r.read()
            local_path = os.path.join('scripts/igloo_assets', f.replace('/', os.sep))
            with open(local_path, 'wb') as out:
                out.write(data)
            print(f"Downloaded {f}: {len(data)} bytes")
    except Exception as e:
        print(f"Error {f}: {e}")

