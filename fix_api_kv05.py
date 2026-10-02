with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { kv04Router } from './routes/kv04.js';",
    "import { kv04Router } from './routes/kv04.js';\nimport { kv05Router } from './routes/kv05.js';"
)

content = content.replace(
    "app.use('/api/kv04', kv04Router);",
    "app.use('/api/kv04', kv04Router);\napp.use('/api/kv05', kv05Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
