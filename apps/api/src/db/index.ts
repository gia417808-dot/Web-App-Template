export * from 'pg';
export const getDb = () => ({ query: async (...args: any[]) => ({ rows: [] as any[] }) });
