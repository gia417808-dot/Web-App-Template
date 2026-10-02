with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { kt03Router } from './routes/kt03.js';",
    "import { kt03Router } from './routes/kt03.js';\nimport { kt04Router } from './routes/kt04.js';"
)

content = content.replace(
    "app.use('/api/kt03', kt03Router);",
    "app.use('/api/kt03', kt03Router);\napp.use('/api/kt04', kt04Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
