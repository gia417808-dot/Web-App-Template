import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedKV03(db: Pool, orgId: string) {
  const spRes = await db.query('SELECT id FROM "SanPham" WHERE organization_id = $1 LIMIT 1', [orgId]);
  
  if (spRes.rows.length === 0) {
    console.log('Chưa có SanPham, bỏ qua seed KV03');
    return;
  }
  const sanPhamId = spRes.rows[0].id;
  const donMuaId = crypto.randomUUID();

  await db.query(`
    INSERT INTO "DonMua" (id, organization_id, san_pham_id, ma_don, trang_thai, luong_dat, luong_nhan_hop_le, chenh_lech_nhan)
    VALUES ($1, $2, $3, 'PO-2026-001', 'APPROVED', 100, 0, 100)
    ON CONFLICT DO NOTHING
  `, [donMuaId, orgId, sanPhamId]);
  
  console.log('Seeded KV03 successfully');
}
