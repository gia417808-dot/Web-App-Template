with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { sx01Router } from './routes/sx01.js';",
    "import { sx01Router } from './routes/sx01.js';\nimport { sx03Router } from './routes/sx03.js';"
)

content = content.replace(
    "app.use('/api/sx01', sx01Router);",
    "app.use('/api/sx01', sx01Router);\napp.use('/api/sx03', sx03Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
