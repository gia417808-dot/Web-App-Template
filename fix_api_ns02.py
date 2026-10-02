with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { ns01Router } from './routes/ns01.js';",
    "import { ns01Router } from './routes/ns01.js';\nimport { ns02Router } from './routes/ns02.js';"
)

content = content.replace(
    "app.use('/api/ns01', ns01Router);",
    "app.use('/api/ns01', ns01Router);\napp.use('/api/ns02', ns02Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
