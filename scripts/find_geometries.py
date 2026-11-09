with open('scripts/App3D.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re

# find all occurrences of /assets/geometries/
geoms = re.finditer(r'assets/geometries/', c)
for m in geoms:
    start = max(0, m.start() - 100)
    end = min(len(c), m.end() + 500)
    print("GEOMETRIES:")
    print(c[start:end])
    print("=" * 60)

