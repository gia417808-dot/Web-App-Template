with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { kv05Router } from './routes/kv05.js';",
    "import { kv05Router } from './routes/kv05.js';\nimport { kt02Router } from './routes/kt02.js';"
)

content = content.replace(
    "app.use('/api/kv05', kv05Router);",
    "app.use('/api/kv05', kv05Router);\napp.use('/api/kt02', kt02Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
