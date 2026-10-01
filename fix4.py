with open('packages/domain/src/index.ts', 'w', encoding='utf-8') as f:
    f.write('''export * from './decimal.js';
export * from './kv01.js';
export * from './kd01.js';
export * from './kt01.js';
export * from './kv02.js';
export * from './mk01.js';
export * from './kd02.js';
export * from './kd03.js';
export * from './kd04.js';
export * from './kd05.js';
''')