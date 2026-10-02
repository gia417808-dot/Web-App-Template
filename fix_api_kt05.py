with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { kt04Router } from './routes/kt04.js';",
    "import { kt04Router } from './routes/kt04.js';\nimport { kt05Router } from './routes/kt05.js';"
)

content = content.replace(
    "app.use('/api/kt04', kt04Router);",
    "app.use('/api/kt04', kt04Router);\napp.use('/api/kt05', kt05Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
