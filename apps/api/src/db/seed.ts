import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const { rows: orgs } = await client.query(`
      INSERT INTO "ToChuc" (name, timezone, currency)
      VALUES ('Công ty Mặc định', 'Asia/Ho_Chi_Minh', 'VND')
      ON CONFLICT DO NOTHING
      RETURNING id;
    `);

    if (orgs.length > 0) {
      await client.query(`
        INSERT INTO "NguoiDung" (organization_id, email, auth_subject, role)
        VALUES ($1, 'admin@web-app-template.local', 'auth0|123', 'OWNER')
        ON CONFLICT DO NOTHING;
      `, [orgs[0].id]);
      console.log('Seeded default org');
    }
  } finally {
    await client.end();
  }
}

seed().catch(console.error);