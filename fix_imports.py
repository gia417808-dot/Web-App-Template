import sys

with open("packages/workbook-engine/src/index.ts", "w", encoding="utf-8") as f:
    f.write("""export * from './kd01.js';
export * from './kv01.js';
export * from './kd03.js';
export * from './mk01.js';
export * from './kt01.js';
export * from './kd02.js';
export * from './kv02.js';
export * from './kd05.js';
export * from './mk02.js';
export * from './mk03.js';
export * from './mk04.js';
""")

with open("packages/domain/src/index.ts", "w", encoding="utf-8") as f:
    f.write("""export * from './kd01.js';
export * from './kv01.js';
export * from './kd03.js';
export * from './mk01.js';
export * from './kt01.js';
export * from './decimal.js';
export * from './kd02.js';
export * from './kv02.js';
export * from './kd05.js';
export * from './mk02.js';
export * from './mk03.js';
export * from './mk04.js';
""")

with open("apps/api/src/routes/mk02.ts", "w", encoding="utf-8") as f:
    f.write("import { Router } from 'express';\nexport const mk02Router = Router();\n")

with open("apps/api/src/db/seed_mk04.ts", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("import { v4 as uuidv4 } from 'uuid';", "import crypto from 'crypto';")
content = content.replace("import { v4 as uuidv4 } from \"uuid\";", "import crypto from 'crypto';")
content = content.replace("uuidv4()", "crypto.randomUUID()")
with open("apps/api/src/db/seed_mk04.ts", "w", encoding="utf-8") as f:
    f.write(content)
