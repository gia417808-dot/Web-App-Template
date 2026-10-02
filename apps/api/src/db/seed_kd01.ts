import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const orgId = '11111111-1111-1111-1111-111111111111';

  try {
    // Check if KhachHang already exists
    const { rows: existingKh } = await client.query(`SELECT id FROM "KhachHang" WHERE organization_id = $1 AND code = 'KH01'`, [orgId]);
    let khId = existingKh[0]?.id;

    if (!khId) {
      const res = await client.query(
        `INSERT INTO "KhachHang" (organization_id, code, name, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [orgId, 'KH01', 'Khách hàng 1', 'kh01@example.com', '0123456789']
      );
      khId = res.rows[0].id;
    }

    // Get a product
    const { rows: sps } = await client.query(`SELECT id, name, unit FROM "SanPham" WHERE organization_id = $1 LIMIT 2`, [orgId]);
    if (sps.length === 0) {
      console.log('No SanPham found, skipping KD01 seed');
      return;
    }

    // Insert 30 DonHang
    for (let i = 1; i <= 30; i++) {
      const dhCode = `DH${i.toString().padStart(3, '0')}`;
      const res = await client.query(`
        INSERT INTO "DonHang" (organization_id, code, customer_id, business_date, status, total_vnd)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (organization_id, code) DO NOTHING
        RETURNING id
      `, [orgId, dhCode, khId, '2026-10-01', 'DRAFT', 100000 * i]);

      if (res.rows.length > 0) {
        const orderId = res.rows[0].id;
        await client.query(`
          INSERT INTO "ChiTietDon" (organization_id, order_id, product_id, sequence, product_name_snapshot, unit_snapshot, quantity, unit_price_vnd, discount_pct, line_total_vnd)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          orgId, orderId, sps[0].id, 1, sps[0].name, sps[0].unit, 
          i, 100000, 0, i * 100000
        ]);
      }
    }

    console.log('Seeded KD01');
  } finally {
    await client.end();
  }
}

seed().catch(console.error);
