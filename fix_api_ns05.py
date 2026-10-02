with open('apps/api/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "import { ns04Router } from './routes/ns04.js';",
    "import { ns04Router } from './routes/ns04.js';\nimport { ns05Router } from './routes/ns05.js';"
)

content = content.replace(
    "app.use('/api/ns04', ns04Router);",
    "app.use('/api/ns04', ns04Router);\napp.use('/api/ns05', ns05Router);"
)

with open('apps/api/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
