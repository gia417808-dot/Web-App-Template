import express from 'express';
import { tenantMiddleware } from '@web-app-template/auth-audit';
import kv01Router from './routes/kv01';
import kd01Router from './routes/kd01';
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const app = express();
app.use(express.json());
app.use(tenantMiddleware);

// Initialize DB client
const dbClient = new Client({ connectionString: process.env.DATABASE_URL });
dbClient.connect().catch(e => console.error('DB connect error:', e));

app.use((req: any, res, next) => {
  req.db = dbClient;
  next();
});

app.get('/health', (req, res) => res.send('OK'));
app.get('/ready', (req, res) => res.send('Ready'));

app.use('/api/kv01', kv01Router);
app.use('/api/kd01', kd01Router);

export { app };
