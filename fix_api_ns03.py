with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { ns02Router } from './routes/ns02.js';",
    "import { ns02Router } from './routes/ns02.js';\nimport { ns03Router } from './routes/ns03.js';"
)

content = content.replace(
    "app.use('/api/ns02', ns02Router);",
    "app.use('/api/ns02', ns02Router);\napp.use('/api/ns03', ns03Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
