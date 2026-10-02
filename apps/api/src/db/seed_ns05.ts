import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedNS05(db: Pool, orgId: string) {
  const uvId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "UngVien" (id, organization_id, ho_ten, vi_tri_ung_tuyen, ngay_mo_vi_tri, ngay_nhan_viec, thoi_gian_tuyen, trang_thai)
    VALUES ($1, $2, 'Trần Văn Tuyển', 'Developer', '2026-09-01', NULL, NULL, 'INTERVIEW')
    ON CONFLICT DO NOTHING
  `, [uvId, orgId]);
  
  await db.query(`
    INSERT INTO "VongTuyen" (id, organization_id, ung_vien_id, vong_truoc, vong_sau)
    VALUES 
      ($1, $2, $3, 'APPLIED', 'SCREENING'),
      ($4, $2, $3, 'SCREENING', 'INTERVIEW')
    ON CONFLICT DO NOTHING
  `, [crypto.randomUUID(), orgId, uvId, crypto.randomUUID()]);
  
  console.log('Seeded NS05 successfully');
}
