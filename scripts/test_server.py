from urllib.parse import quote
import urllib.request
import json

BASE = "http://localhost:3001"

def test_url(endpoint, method="GET", data=None):
    url = BASE + quote(endpoint, safe="/?=&")
    req = urllib.request.Request(url, method=method)
    if data:
        req.data = json.dumps(data).encode('utf-8')
        req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read()
            return resp.status, body
    except Exception as e:
        return None, str(e)

tests = [
    ("/", "GET", None),
    ("/en", "GET", None),
    ("/css/davidecarusio-it-v3.webflow.css", "GET", None),
    ("/fonts/Geist-Medium.woff2", "GET", None),
    ("/videos/Vergnani Clip Casa Compressed-1.mp4", "GET", None),
    ("/assets/flow_gradient_remix_scene.json.txt", "GET", None),
    ("/api/health", "GET", None),
    ("/api/projects", "GET", None),
    ("/api/contact", "POST", {"name": "Test User", "email": "test@example.com", "message": "Reverse engineering test", "service": "Webflow"})
]

print("=== RUNNING AUTOMATED SUITE ===")
all_passed = True
for ep, m, d in tests:
    status, body = test_url(ep, m, d)
    if status in [200, 201]:
        print(f" PASS: {m} {ep} -> {status} (Bytes: {len(body) if isinstance(body, bytes) else len(str(body))})")
    else:
        print(f" FAIL: {m} {ep} -> Status: {status}, Error: {body}")
        all_passed = False

if all_passed:
    print("\n ALL TESTS PASSED SUCCESSFULLY!")
else:
    print("\n SOME TESTS FAILED.")
