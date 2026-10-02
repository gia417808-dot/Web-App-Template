import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedSX01(db: Pool, orgId: string) {
  const lsxId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "LenhSanXuat" (id, organization_id, ma_lenh, san_pham_ma, luong_ke_hoach, luong_dat, luong_loi, ty_le_hoan_thanh, trang_thai)
    VALUES ($1, $2, 'LSX-001', 'SP-BAN-001', 100, 50, 2, 0.50, 'IN_PROGRESS')
    ON CONFLICT DO NOTHING
  `, [lsxId, orgId]);
  
  await db.query(`
    INSERT INTO "CongDoan" (id, organization_id, lenh_san_xuat_id, ten_cong_doan, trang_thai)
    VALUES 
      ($1, $2, $3, 'Cắt Gỗ', 'DONE'),
      ($4, $2, $3, 'Lắp Ráp', 'DOING')
    ON CONFLICT DO NOTHING
  `, [crypto.randomUUID(), orgId, lsxId, crypto.randomUUID()]);
  
  console.log('Seeded SX01 successfully');
}
