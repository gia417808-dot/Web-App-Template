import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedKT04(db: Pool, orgId: string) {
  const hmId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "HangMucNganSach" (id, organization_id, code, name)
    VALUES ($1, $2, 'CP-MKT', 'Chi phí Marketing')
    ON CONFLICT DO NOTHING
  `, [hmId, orgId]);
  
  const nsId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "NganSach" (id, organization_id, hang_muc_id, ma_ngan_sach, ky_ngan_sach, du_toan, thuc_chi, chenh_lech, trang_thai)
    VALUES ($1, $2, $3, 'NS-2026-01-MKT', '2026-01', 50000000, 20000000, 30000000, 'APPROVED')
    ON CONFLICT DO NOTHING
  `, [nsId, orgId, hmId]);
  
  console.log('Seeded KT04 successfully');
}
