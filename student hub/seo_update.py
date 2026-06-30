import os

seo_tags = """
    <meta name="keywords" content="student, productivity, hub, study, planner">
    <meta name="author" content="StudyHub Team">
    <meta property="og:title" content="Student Productivity Hub">
    <meta property="og:description" content="The ultimate student productivity hub designed to help you organize, focus, and achieve your goals.">
    <meta property="og:type" content="website">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>">
"""

for f in os.listdir('.'):
    if f.endswith('.html'):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        if '<meta name="keywords"' not in content:
            content = content.replace('</title>', '</title>\n' + seo_tags)
            
        content = content.replace('<img ', '<img loading="lazy" ')
        content = content.replace('loading="lazy" loading="lazy"', 'loading="lazy"')
        content = content.replace('q=80"', 'q=80&fm=webp"')
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
print("SEO and Image optimizations done.")
