import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedNS03(db: Pool, orgId: string) {
  const nsRes = await db.query('SELECT id FROM "NhanSu" WHERE organization_id = $1 LIMIT 1', [orgId]);
  if (nsRes.rows.length === 0) return;
  const nsId = nsRes.rows[0].id;
  
  await db.query(`
    INSERT INTO "SoDuPhep" (id, organization_id, nhan_su_id, nam, phep_dau_ky, phep_phat_sinh, phep_da_duyet, phep_con_lai)
    VALUES ($1, $2, $3, 2026, 0, 12, 0, 12)
    ON CONFLICT DO NOTHING
  `, [crypto.randomUUID(), orgId, nsId]);
  
  await db.query(`
    INSERT INTO "DonNghi" (id, organization_id, nhan_su_id, ngay_bat_dau, ngay_ket_thuc, so_ngay_nghi, trang_thai)
    VALUES ($1, $2, $3, '2026-10-15', '2026-10-16', 2, 'SUBMITTED')
    ON CONFLICT DO NOTHING
  `, [crypto.randomUUID(), orgId, nsId]);
  
  console.log('Seeded NS03 successfully');
}
