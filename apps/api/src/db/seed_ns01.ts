import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedNS01(db: Pool, orgId: string) {
  const nvId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "NhanSu" (id, organization_id, ma_nhan_vien, ho_ten, ngay_vao_lam, tham_nien_ngay, trang_thai)
    VALUES ($1, $2, 'NV-001', 'Nguyễn Văn Admin', '2025-01-01', 365, 'ACTIVE')
    ON CONFLICT DO NOTHING
  `, [nvId, orgId]);
  
  await db.query(`
    INSERT INTO "TaiLieuNhanSu" (id, organization_id, nhan_su_id, ten_tai_lieu, url)
    VALUES ($1, $2, $3, 'CV.pdf', 'https://example.com/cv.pdf')
    ON CONFLICT DO NOTHING
  `, [crypto.randomUUID(), orgId, nvId]);
  
  console.log('Seeded NS01 successfully');
}
