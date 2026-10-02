import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedKT03(db: Pool, orgId: string) {
  const nccId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "NhaCungCap" (id, organization_id, ma_nha_cung_cap, ten_nha_cung_cap)
    VALUES ($1, $2, 'NCC-01', 'Nhà Cung Cấp ABC')
    ON CONFLICT DO NOTHING
  `, [nccId, orgId]);
  
  const ptId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "PhaiTra" (id, organization_id, nha_cung_cap_id, ma_phai_tra, so_goc, da_thanh_toan, con_lai, trang_thai, han_thanh_toan)
    VALUES ($1, $2, $3, 'PT-2026-02', 10000000, 3000000, 7000000, 'PARTIALLY_PAID', '2026-03-31')
    ON CONFLICT DO NOTHING
  `, [ptId, orgId, nccId]);

  await db.query(`
    INSERT INTO "ThanhToanPhaiTra" (id, organization_id, phai_tra_id, so_tien, ngay_thanh_toan, trang_thai)
    VALUES ($1, $2, $3, 3000000, '2026-02-15', 'CONFIRMED')
    ON CONFLICT DO NOTHING
  `, [crypto.randomUUID(), orgId, ptId]);
  
  console.log('Seeded KT03 successfully');
}
