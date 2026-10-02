with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { sx02Router } from './routes/sx02.js';",
    "import { sx02Router } from './routes/sx02.js';\nimport { sx01Router } from './routes/sx01.js';"
)

content = content.replace(
    "app.use('/api/sx02', sx02Router);",
    "app.use('/api/sx02', sx02Router);\napp.use('/api/sx01', sx01Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
