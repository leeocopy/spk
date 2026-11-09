with open('scripts/igloo_bundle.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re

# find import(..) or chunk names
imports = re.findall(r'import\s*\(\s*["\']([^"\']+)["\']\s*\)', c)
print("Static dynamic imports:", imports)

# Find chunk hashes or paths
chunks = re.findall(r'["\']([a-zA-Z0-9_\-\./]+\.js)["\']', c)
print("JS files referenced:", chunks)

# Look at loader css / html in bundle
loader_match = re.findall(r'div#loader[^}]+}', c)
print("Loader styles:", loader_match)

print("\n--- Full text preview ---")
print(c[:2000])

