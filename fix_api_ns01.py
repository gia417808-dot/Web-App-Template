with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { kt05Router } from './routes/kt05.js';",
    "import { kt05Router } from './routes/kt05.js';\nimport { ns01Router } from './routes/ns01.js';"
)

content = content.replace(
    "app.use('/api/kt05', kt05Router);",
    "app.use('/api/kt05', kt05Router);\napp.use('/api/ns01', ns01Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
