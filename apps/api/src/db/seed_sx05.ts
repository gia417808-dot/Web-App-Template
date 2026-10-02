import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedSX05(db: Pool, orgId: string) {
  const lsxRes = await db.query('SELECT id FROM "LenhSanXuat" WHERE organization_id = $1 LIMIT 1', [orgId]);
  if (lsxRes.rows.length > 0) {
    const lsx = lsxRes.rows[0];
    
    // Add ChiPhi
    await db.query(`
      INSERT INTO "ChiPhiSX" (id, organization_id, lenh_san_xuat_id, loai_chi_phi, so_tien, trang_thai)
      VALUES 
        ($1, $2, $3, 'VAT_TU', 5000000, 'APPROVED'),
        ($4, $2, $3, 'NHAN_CONG', 2000000, 'APPROVED')
      ON CONFLICT DO NOTHING
    `, [crypto.randomUUID(), orgId, lsx.id, crypto.randomUUID()]);
    
    // Update LenhSanXuat
    await db.query(`
      UPDATE "LenhSanXuat"
      SET tong_chi_phi = 7000000, gia_thanh_don_vi = 140000, trang_thai_gia_thanh = 'CALCULATED'
      WHERE id = $1
    `, [lsx.id]);
    
    console.log('Seeded SX05 successfully');
  } else {
    console.log('SX05 Seed: No LenhSanXuat found');
  }
}
