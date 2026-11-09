with open('scripts/App3D.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re

# find file extensions loaded (e.g. .vdb, .bin, .glb, .gltf, .ogg, .mp3, .png, etc.)
files = re.findall(r'["\']([^"\'\s]+\.(?:vdb|bin|glb|gltf|ogg|mp3|wav|hdr|exr|json|png|jpg|webp))["\']', c)
print("Files referenced in App3D:", set(files))

# Look for loader classes (GLTFLoader, etc.)
loaders = re.findall(r'[A-Za-z0-9_]+Loader', c)
print("Loaders found:", set(loaders))

