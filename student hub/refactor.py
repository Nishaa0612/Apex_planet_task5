import os
import re

# Read style.css
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Extract header CSS
header_pattern = r'/\* Header & Navigation \*/(.*?)(?=/\* Main Content \*/)'
header_match = re.search(header_pattern, css, re.DOTALL)
if header_match:
    with open('header.css', 'w', encoding='utf-8') as f:
        f.write(header_match.group(0))
    css = css.replace(header_match.group(0), '/* Header styles moved to header.css */\n')

# Extract footer CSS
footer_pattern = r'/\* Footer \*/(.*?)((?=/\* Responsive \*/)|$)'
footer_match = re.search(footer_pattern, css, re.DOTALL)
if footer_match:
    with open('footer.css', 'w', encoding='utf-8') as f:
        f.write(footer_match.group(0))
    css = css.replace(footer_match.group(0), '/* Footer styles moved to footer.css */\n')

# Write updated style.css
with open('style.css', 'w', encoding='utf-8') as f:
    # Add imports at the top
    f.write('@import url("header.css");\n@import url("footer.css");\n' + css)

# Split JS
os.rename('script.js', 'ui.js')
if os.path.exists('apps.js'):
    os.rename('apps.js', 'api.js')

with open('utils.js', 'w', encoding='utf-8') as f:
    f.write('// utils.js - Utility functions\nexport const sanitizeInput = (str) => str.trim();\n')

# Update script paths in HTML
html_files = [f for f in os.listdir('.') if f.endswith('.html')]
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('<script src="script.js" defer></script>', '<script src="ui.js" defer></script>')
    content = content.replace('<script src="apps.js" defer></script>', '<script src="api.js" defer></script>')
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Code organization complete.")
