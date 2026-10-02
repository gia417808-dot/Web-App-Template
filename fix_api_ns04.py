with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { ns03Router } from './routes/ns03.js';",
    "import { ns03Router } from './routes/ns03.js';\nimport { ns04Router } from './routes/ns04.js';"
)

content = content.replace(
    "app.use('/api/ns03', ns03Router);",
    "app.use('/api/ns03', ns03Router);\napp.use('/api/ns04', ns04Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
