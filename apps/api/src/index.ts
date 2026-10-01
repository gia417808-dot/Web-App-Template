import express from 'express';
import { tenantMiddleware } from '@web-app-template/auth-audit';
import kv01Router from './routes/kv01';
import kd01Router from './routes/kd01';
import { kt01Router } from './routes/kt01';
import { kv02Router } from './routes/kv02';
import { mk01Router } from './routes/mk01';
import { kd02Router } from './routes/kd02';
import { kd03Router } from './routes/kd03';
import { kd04Router } from './routes/kd04';
import kd05Router from './routes/kd05';
import { mk02Router } from './routes/mk02';
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
app.use('/api/kt01', kt01Router);
app.use('/api/kv02', kv02Router);
app.use('/api/mk01', mk01Router);
app.use('/api/kd02', kd02Router);
app.use('/api/kd03', kd03Router);
app.use('/api/kd04', kd04Router);
app.use('/api/kd05', kd05Router);
app.use('/api/mk02', mk02Router);

export { app };
