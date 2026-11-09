import urllib.request
import ssl
import os

ctx = ssl.create_default_context()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

base = "https://www.igloo.inc/assets/libs/draco/"
files = [
    'draco_decoder.wasm',
    'draco_wasm_wrapper.js',
    'draco_decoder.js'
]

os.makedirs('libs/draco', exist_ok=True)
os.makedirs('assets/igloo', exist_ok=True)

for f in files:
    url = base + f
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as r:
            data = r.read()
            out_path = os.path.join('libs/draco', f)
            with open(out_path, 'wb') as out:
                out.write(data)
            print(f"Downloaded draco lib: {f} ({len(data)} bytes)")
    except Exception as e:
        print(f"Error {f}: {e}")

# Copy the drc files to assets/igloo
drc_files = ['igloo.drc', 'igloo_cage.drc', 'igloo_outline.drc', 'patch.drc', 'intro_particles.drc']
import shutil
for df in drc_files:
    src = os.path.join('scripts/igloo_assets', df if df != 'igloo_cage.drc' and df != 'igloo_outline.drc' and df != 'patch.drc' else os.path.join('igloo', df))
    if os.path.exists(src):
        dst = os.path.join('assets/igloo', df)
        shutil.copyfile(src, dst)
        print(f"Copied {df} -> {dst}")

