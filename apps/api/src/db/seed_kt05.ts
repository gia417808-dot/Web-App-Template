import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedKT05(db: Pool, orgId: string) {
  const dhRes = await db.query('SELECT id FROM "DonHang" WHERE organization_id = $1 LIMIT 1', [orgId]);
  
  if (dhRes.rows.length === 0) {
    console.log('Chưa đủ master data cho KT05 (DonHang)');
    return;
  }
  
  const dhId = dhRes.rows[0].id;

  const lgId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "LaiGopDonHang" (id, organization_id, don_hang_id, doanh_thu_thuan, tong_gia_von, lai_gop, trang_thai)
    VALUES ($1, $2, $3, 15000000, 10000000, 5000000, 'CALCULATED')
    ON CONFLICT DO NOTHING
  `, [lgId, orgId, dhId]);
  
  console.log('Seeded KT05 successfully');
}
