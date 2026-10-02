import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedSX04(db: Pool, orgId: string) {
  const llId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "LoaiLoi" (id, organization_id, ma_loi, ten_loi)
    VALUES ($1, $2, 'ERR-001', 'Xước Bề Mặt')
    ON CONFLICT DO NOTHING
  `, [llId, orgId]);

  const lsxRes = await db.query('SELECT id FROM "LenhSanXuat" WHERE organization_id = $1 LIMIT 1', [orgId]);
  if (lsxRes.rows.length > 0) {
    const lsx = lsxRes.rows[0];
    await db.query(`
      INSERT INTO "PhieuKiem" (id, organization_id, lenh_san_xuat_id, so_luong_kiem, so_luong_loi, ty_le_loi, trang_thai)
      VALUES ($1, $2, $3, 100, 5, 0.05, 'INSPECTED')
      ON CONFLICT DO NOTHING
    `, [crypto.randomUUID(), orgId, lsx.id]);
    console.log('Seeded SX04 successfully');
  } else {
    console.log('SX04 Seed: No LenhSanXuat found to seed PhieuKiem');
  }
}
