import { Router } from 'express';
import { getDb } from '../db/index.js';
import { sx04Domain, PhieuKiem } from '@web-app-template/domain';
import { generateSx04Workbook } from '@web-app-template/workbook-engine';

export const sx04Router = Router();

sx04Router.get('/phieu-kiem', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT p.*, l.ma_lenh 
      FROM "PhieuKiem" p
      JOIN "LenhSanXuat" l ON p.lenh_san_xuat_id = l.id
      ORDER BY p.created_at DESC
    `);
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

sx04Router.post('/phieu-kiem/:id/ghi-nhan', async (req, res) => {
  const { id } = req.params;
  const { so_luong_kiem, so_luong_loi } = req.body;
  const db = getDb();
  
  try {
    const pRes = await db.query('SELECT * FROM "PhieuKiem" WHERE id = $1', [id]);
    if (pRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy phiếu' });
    const p = pRes.rows[0] as PhieuKiem;
    
    p.so_luong_kiem = Number(p.so_luong_kiem);
    p.so_luong_loi = Number(p.so_luong_loi);

    const computed = sx04Domain.ghiNhanLoi(p, Number(so_luong_kiem), Number(so_luong_loi));
    
    const result = await db.query(
      `UPDATE "PhieuKiem" SET 
        so_luong_kiem = $1, so_luong_loi = $2, ty_le_loi = $3, 
        trang_thai = $4, row_version = $5, updated_at = NOW() 
       WHERE id = $6 RETURNING *`,
      [computed.so_luong_kiem, computed.so_luong_loi, computed.ty_le_loi, computed.trang_thai, computed.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

sx04Router.put('/phieu-kiem/:id/trang-thai', async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;
  const db = getDb();
  
  try {
    const pRes = await db.query('SELECT * FROM "PhieuKiem" WHERE id = $1', [id]);
    if (pRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy phiếu' });
    
    const p = pRes.rows[0] as PhieuKiem;
    const computed = sx04Domain.changeStatus(p, trang_thai);
    
    const result = await db.query(
      `UPDATE "PhieuKiem" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [computed.trang_thai, computed.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

sx04Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT p.*, l.ma_lenh 
      FROM "PhieuKiem" p
      JOIN "LenhSanXuat" l ON p.lenh_san_xuat_id = l.id
      ORDER BY p.created_at DESC
    `);
    const buffer = await generateSx04Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=SX04_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
