with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { ns05Router } from './routes/ns05.js';",
    "import { ns05Router } from './routes/ns05.js';\nimport { sx02Router } from './routes/sx02.js';"
)

content = content.replace(
    "app.use('/api/ns05', ns05Router);",
    "app.use('/api/ns05', ns05Router);\napp.use('/api/sx02', sx02Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
