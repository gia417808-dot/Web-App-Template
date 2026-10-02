import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedSX02(db: Pool, orgId: string) {
  const vtId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "VatTu" (id, organization_id, ma_vat_tu, ten_vat_tu, dvt)
    VALUES ($1, $2, 'VT-GO-001', 'Gỗ Sồi 1m3', 'Khối')
    ON CONFLICT DO NOTHING
  `, [vtId, orgId]);
  
  await db.query(`
    INSERT INTO "DinhMuc" (id, organization_id, san_pham_ma, vat_tu_id, so_luong_dinh_muc, ty_le_hao_hut, trang_thai)
    VALUES ($1, $2, 'SP-BAN-001', $3, 0.5, 10, 'APPROVED')
    ON CONFLICT DO NOTHING
  `, [crypto.randomUUID(), orgId, vtId]);
  
  console.log('Seeded SX02 successfully');
}
