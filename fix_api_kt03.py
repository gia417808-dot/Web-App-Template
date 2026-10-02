with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { kt02Router } from './routes/kt02.js';",
    "import { kt02Router } from './routes/kt02.js';\nimport { kt03Router } from './routes/kt03.js';"
)

content = content.replace(
    "app.use('/api/kt02', kt02Router);",
    "app.use('/api/kt02', kt02Router);\napp.use('/api/kt03', kt03Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
