import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedMK05(db: Pool, orgId: string) {
  // Assume MK01 already seeded some "NoiDung". Let's get one.
  const ndRes = await db.query('SELECT id FROM "NoiDung" WHERE organization_id = $1 LIMIT 1', [orgId]);
  
  if (ndRes.rows.length === 0) {
    console.log('Chưa có NoiDung, bỏ qua seed MK05');
    return;
  }
  const noiDungId = ndRes.rows[0].id;
  const thuNghiemId = crypto.randomUUID();

  await db.query(`
    INSERT INTO "ThuNghiem" (id, organization_id, noi_dung_id, ten_thu_nghiem, trang_thai, ngay_bat_dau, ngay_ket_thuc)
    VALUES ($1, $2, $3, 'Thử nghiệm Tiêu đề Bài viết Mới', 'RUNNING', '2026-02-01', '2026-02-15')
    ON CONFLICT DO NOTHING
  `, [thuNghiemId, orgId, noiDungId]);

  await db.query(`
    INSERT INTO "BienThe" (id, organization_id, thu_nghiem_id, ten_bien_the, luot_tiep_can, phan_hoi, ty_le_phan_hoi)
    VALUES 
    ($1, $4, $5, 'Tiêu đề A', 1500, 45, NULL),
    ($2, $4, $5, 'Tiêu đề B', 1450, 60, NULL),
    ($3, $4, $5, 'Tiêu đề C', 0, 0, NULL)
    ON CONFLICT DO NOTHING
  `, [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID(), orgId, thuNghiemId]);
  
  console.log('Seeded MK05 successfully');
}
