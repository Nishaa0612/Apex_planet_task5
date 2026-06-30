import os
js_files = [f for f in os.listdir('.') if f.endswith('.js')]
for file in js_files:
    with open(file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    with open(file, 'w', encoding='utf-8') as f:
        for line in lines:
            if 'console.log' not in line:
                f.write(line)

with open('.gitignore', 'w', encoding='utf-8') as f:
    f.write('node_modules/\n.env\n.DS_Store\n')
print("Codebase cleaned for Task 5!")
