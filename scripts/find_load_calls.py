with open('scripts/App3D.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re

# find calls to .load(
loads = [m.start() for m in re.finditer(r'\.load\(', c)]
print(f"Total .load( calls: {len(loads)}")
for idx in loads[:15]:
    start = max(0, idx - 80)
    end = min(len(c), idx + 120)
    print("CALL:", c[start:end])
    print("-" * 50)

