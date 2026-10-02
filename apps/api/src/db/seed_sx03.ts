import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedSX03(db: Pool, orgId: string) {
  const cdId = crypto.randomUUID();
  const cdRes = await db.query('SELECT id FROM "CongDoan" WHERE organization_id = $1 LIMIT 1', [orgId]);
  
  if (cdRes.rows.length > 0) {
    const cd = cdRes.rows[0];
    await db.query(`
      INSERT INTO "NhatKySX" (id, organization_id, cong_doan_id, ty_le_dat_truoc, ty_le_dat_sau, trang_thai_truoc, trang_thai_sau, ghi_chu)
      VALUES ($1, $2, $3, 0, 0.5, 'PENDING', 'IN_PROGRESS', 'Bắt đầu làm')
      ON CONFLICT DO NOTHING
    `, [crypto.randomUUID(), orgId, cd.id]);
    console.log('Seeded SX03 successfully');
  } else {
    console.log('SX03 Seed: No CongDoan found to seed NhatKySX');
  }
}
