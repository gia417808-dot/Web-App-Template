import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const orgId = '11111111-1111-1111-1111-111111111111';
  try {
    await client.query(`INSERT INTO "ToChuc" (id, name, timezone, currency) VALUES ($1, 'Công ty Mặc định', 'Asia/Ho_Chi_Minh', 'VND') ON CONFLICT DO NOTHING`, [orgId]);
    for (let i = 1; i <= 30; i++) {
      await client.query(`
        INSERT INTO "SanPham" (organization_id, sku, name, unit, kind, min_qty, max_qty)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [orgId, `SP${i.toString().padStart(2, '0')}`, `Sản phẩm ${i}`, 'Cái', 'Hàng hóa', 1, 100]);
    }
    console.log('Seeded KV01');
  } finally {
    await client.end();
  }
}
seed().catch(console.error);