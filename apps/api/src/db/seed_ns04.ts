import { Pool } from 'pg';
import crypto from 'crypto';

export async function seedNS04(db: Pool, orgId: string) {
  const nsRes = await db.query('SELECT id FROM "NhanSu" WHERE organization_id = $1 LIMIT 1', [orgId]);
  if (nsRes.rows.length === 0) return;
  const nsId = nsRes.rows[0].id;
  
  const blId = crypto.randomUUID();
  await db.query(`
    INSERT INTO "BangLuong" (id, organization_id, ky_luong, nhan_su_id, luong_thoa_thuan, tong_phu_cap, tong_khau_tru, thuc_nhan, trang_thai)
    VALUES ($1, $2, '2026-10', $3, 20000000, 2000000, 500000, 21500000, 'REVIEWED')
    ON CONFLICT DO NOTHING
  `, [blId, orgId, nsId]);
  
  await db.query(`
    INSERT INTO "KhoanDieuChinh" (id, organization_id, bang_luong_id, loai_dieu_chinh, so_tien, ly_do)
    VALUES 
      ($1, $2, $3, 'PHU_CAP', 2000000, 'Phụ cấp ăn trưa và xăng xe'),
      ($4, $2, $3, 'KHAU_TRU', 500000, 'Phạt đi trễ')
    ON CONFLICT DO NOTHING
  `, [crypto.randomUUID(), orgId, blId, crypto.randomUUID()]);
  
  console.log('Seeded NS04 successfully');
}
