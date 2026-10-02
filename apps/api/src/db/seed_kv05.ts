import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedKV05(db: Pool, orgId: string) {
  const khoRes = await db.query('SELECT id FROM "Kho" WHERE organization_id = $1 LIMIT 1', [orgId]);
  const spRes = await db.query('SELECT id FROM "SanPham" WHERE organization_id = $1 LIMIT 1', [orgId]);
  
  if (khoRes.rows.length === 0 || spRes.rows.length === 0) {
    console.log('Chưa đủ master data cho KV05');
    return;
  }
  
  const mucTonId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "MucTonKho" (id, organization_id, kho_id, san_pham_id, ton_muc_tieu)
    VALUES ($1, $2, $3, $4, 200)
    ON CONFLICT DO NOTHING
  `, [mucTonId, orgId, khoRes.rows[0].id, spRes.rows[0].id]);

  await db.query(`
    INSERT INTO "CanhBaoBoSung" (id, organization_id, muc_ton_id, ton_kha_dung, luong_goi_y, trang_thai)
    VALUES ($1, $2, $3, 50, 150, 'OPEN')
    ON CONFLICT DO NOTHING
  `, [crypto.randomUUID(), orgId, mucTonId]);
  
  console.log('Seeded KV05 successfully');
}
