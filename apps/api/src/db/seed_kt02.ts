import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedKT02(db: Pool, orgId: string) {
  const khRes = await db.query('SELECT id FROM "KhachHang" WHERE organization_id = $1 LIMIT 1', [orgId]);
  
  if (khRes.rows.length === 0) {
    console.log('Chưa đủ master data cho KT02');
    return;
  }
  
  const ptId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "PhaiThu" (id, organization_id, khach_hang_id, ma_phai_thu, so_goc, da_thanh_toan, con_lai, trang_thai, han_thanh_toan)
    VALUES ($1, $2, $3, 'PT-2026-01', 5000000, 2000000, 3000000, 'PARTIALLY_PAID', '2026-02-28')
    ON CONFLICT DO NOTHING
  `, [ptId, orgId, khRes.rows[0].id]);

  await db.query(`
    INSERT INTO "ThanhToanPhaiThu" (id, organization_id, phai_thu_id, so_tien, ngay_thanh_toan, trang_thai)
    VALUES ($1, $2, $3, 2000000, '2026-01-15', 'CONFIRMED')
    ON CONFLICT DO NOTHING
  `, [crypto.randomUUID(), orgId, ptId]);
  
  console.log('Seeded KT02 successfully');
}
