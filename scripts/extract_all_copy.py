from html.parser import HTMLParser
import re

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.texts = []
        self.tag_stack = []
        self.in_script = False
        self.in_style = False

    def handle_starttag(self, tag, attrs):
        self.tag_stack.append((tag, dict(attrs)))
        if tag in ['script', 'noscript']:
            self.in_script = True
        elif tag == 'style':
            self.in_style = True

    def handle_endtag(self, tag):
        if tag in ['script', 'noscript']:
            self.in_script = False
        elif tag == 'style':
            self.in_style = False
        if self.tag_stack:
            self.tag_stack.pop()

    def handle_data(self, data):
        if self.in_script or self.in_style:
            return
        cleaned = data.strip()
        if cleaned and len(cleaned) > 1:
            curr_tag, curr_attrs = self.tag_stack[-1] if self.tag_stack else ('', {})
            cls = curr_attrs.get('class', '')
            self.texts.append((curr_tag, cls, cleaned))

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

parser = TextExtractor()
parser.feed(html)

print(f"Total text blocks extracted: {len(parser.texts)}")
with open('all_texts_it.txt', 'w', encoding='utf-8') as out:
    for tag, cls, t in parser.texts:
        out.write(f"[{tag}.{cls}] {t}\n")

print("Saved all text blocks to all_texts_it.txt")

