with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { sx03Router } from './routes/sx03.js';",
    "import { sx03Router } from './routes/sx03.js';\nimport { sx04Router } from './routes/sx04.js';"
)

content = content.replace(
    "app.use('/api/sx03', sx03Router);",
    "app.use('/api/sx03', sx03Router);\napp.use('/api/sx04', sx04Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
