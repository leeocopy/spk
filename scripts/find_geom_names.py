with open('scripts/App3D.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re

# find where geometry is loaded or requested, e.g. .load("...") or instanced("...")
matches = re.findall(r'(?:load|geometry|curves|skin|instanced|batched)\s*\(\s*["\']([^"\']+)["\']', c)
print(f"Geometry / Asset identifiers found: {len(matches)}")
for m in sorted(set(matches)):
    print(" -", m)

# Also check for .drc or .glb or .gltf or other file extensions
exts = re.findall(r'["\']([a-zA-Z0-9_\-\./]+\.(?:drc|glb|gltf|bin|json|mp4|webm))["\']', c)
print(f"Files with 3D / media exts: {set(exts)}")

