with open('scripts/App3D.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re

# find classes or functions related to igloo
matches = re.finditer(r'igloo', c, re.IGNORECASE)
indices = [m.start() for m in matches]
print(f"Total 'igloo' matches: {len(indices)}")

# Print contexts around first 10 matches
for i in indices[:8]:
    start = max(0, i - 150)
    end = min(len(c), i + 250)
    print("MATCH AT", i)
    print(c[start:end])
    print("-" * 50)

