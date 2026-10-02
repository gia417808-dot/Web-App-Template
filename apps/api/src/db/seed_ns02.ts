import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedNS02(db: Pool, orgId: string) {
  const caId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "CaLam" (id, organization_id, ma_ca, gio_vao, gio_ra, tru_gio_nghi)
    VALUES ($1, $2, 'CA_NGAY', '08:00:00', '17:00:00', 1.0)
    ON CONFLICT DO NOTHING
  `, [caId, orgId]);
  
  const nsRes = await db.query('SELECT id FROM "NhanSu" WHERE organization_id = $1 LIMIT 1', [orgId]);
  if (nsRes.rows.length === 0) return;
  const nsId = nsRes.rows[0].id;
  
  await db.query(`
    INSERT INTO "ChamCong" (id, organization_id, nhan_su_id, ca_lam_id, ngay_cham_cong, gio_vao_thuc_te, gio_ra_thuc_te, tong_gio_lam, trang_thai)
    VALUES ($1, $2, $3, $4, '2026-10-02', '08:15:00', '17:30:00', NULL, 'SUBMITTED')
    ON CONFLICT DO NOTHING
  `, [crypto.randomUUID(), orgId, nsId, caId]);
  
  console.log('Seeded NS02 successfully');
}
