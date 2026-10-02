with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { mk05Router } from './routes/mk05.js';",
    "import { mk05Router } from './routes/mk05.js';\nimport { kv03Router } from './routes/kv03.js';"
)

content = content.replace(
    "app.use('/api/mk05', mk05Router);",
    "app.use('/api/mk05', mk05Router);\napp.use('/api/kv03', kv03Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
