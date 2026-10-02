import { Router } from 'express';
import { getDb } from '../db/index.js';
import { ns05Domain, UngVien } from '@web-app-template/domain';
import { generateNs05Workbook } from '@web-app-template/workbook-engine';

export const ns05Router = Router();

ns05Router.get('/ung-vien', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "UngVien" ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

ns05Router.post('/ung-vien/:id/chuyen-vong', async (req, res) => {
  const { id } = req.params;
  const { trang_thai, ngay_nhan_viec } = req.body;
  const db = getDb();
  
  try {
    await db.query('BEGIN');
    
    const uvRes = await db.query('SELECT * FROM "UngVien" WHERE id = $1 FOR UPDATE', [id]);
    if (uvRes.rows.length === 0) throw new Error('Không tìm thấy ứng viên');
    const uv = uvRes.rows[0] as UngVien;
    
    // Fix dates mapping
    if (uv.ngay_mo_vi_tri) uv.ngay_mo_vi_tri = new Date(uv.ngay_mo_vi_tri).toISOString().split('T')[0];
    if (uv.ngay_nhan_viec) uv.ngay_nhan_viec = new Date(uv.ngay_nhan_viec).toISOString().split('T')[0];

    const currentStatus = uv.trang_thai;
    const computed = ns05Domain.chuyenVongTuyen(uv, trang_thai, ngay_nhan_viec);
    
    const result = await db.query(
      `UPDATE "UngVien" SET 
        trang_thai = $1, ngay_nhan_viec = $2, thoi_gian_tuyen = $3, 
        updated_at = NOW(), row_version = $4 
       WHERE id = $5 RETURNING *`,
      [computed.trang_thai, computed.ngay_nhan_viec, computed.thoi_gian_tuyen, computed.row_version, id]
    );

    await db.query(
      `INSERT INTO "VongTuyen" (organization_id, ung_vien_id, vong_truoc, vong_sau) VALUES ($1, $2, $3, $4)`,
      [computed.organization_id, id, currentStatus, computed.trang_thai]
    );
    
    await db.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err: any) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

ns05Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`SELECT * FROM "UngVien" ORDER BY created_at DESC`);
    const buffer = await generateNs05Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=NS05_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
