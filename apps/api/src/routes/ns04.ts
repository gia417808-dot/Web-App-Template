import { Router } from 'express';
import { getDb } from '../db/index.js';
import { ns04Domain, BangLuong, KhoanDieuChinh } from '@web-app-template/domain';
import { generateNs04Workbook } from '@web-app-template/workbook-engine';

export const ns04Router = Router();

ns04Router.get('/bang-luong', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "BangLuong" ORDER BY ky_luong DESC, created_at DESC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

ns04Router.post('/bang-luong/:id/tinh-toan', async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  try {
    await db.query('BEGIN');
    const blRes = await db.query('SELECT * FROM "BangLuong" WHERE id = $1 FOR UPDATE', [id]);
    if (blRes.rows.length === 0) throw new Error('Không tìm thấy bảng lương');
    const bl = blRes.rows[0] as BangLuong;
    bl.luong_thoa_thuan = Number(bl.luong_thoa_thuan);

    if (bl.trang_thai === 'LOCKED') throw new Error('Không thể tính lại bảng lương đã chốt');

    const dcRes = await db.query('SELECT * FROM "KhoanDieuChinh" WHERE bang_luong_id = $1', [id]);
    const dieuChinhs = dcRes.rows.map(r => ({ ...r, so_tien: Number(r.so_tien) })) as KhoanDieuChinh[];

    const computed = ns04Domain.tinhThucNhan(bl.luong_thoa_thuan, dieuChinhs);
    
    const result = await db.query(
      `UPDATE "BangLuong" SET tong_phu_cap = $1, tong_khau_tru = $2, thuc_nhan = $3, updated_at = NOW(), row_version = row_version + 1 WHERE id = $4 RETURNING *`,
      [computed.tongPhuCap, computed.tongKhauTru, computed.thucNhan, id]
    );
    
    await db.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err: any) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

ns04Router.post('/bang-luong/:id/chot', async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  try {
    const blRes = await db.query('SELECT * FROM "BangLuong" WHERE id = $1', [id]);
    if (blRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy bảng lương' });
    
    const bl = blRes.rows[0] as BangLuong;
    const computed = ns04Domain.chotBangLuong(bl);
    
    const result = await db.query(
      `UPDATE "BangLuong" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [computed.trang_thai, computed.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

ns04Router.put('/bang-luong/:id/trang-thai', async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;
  const db = getDb();
  
  try {
    const blRes = await db.query('SELECT * FROM "BangLuong" WHERE id = $1', [id]);
    if (blRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy bảng lương' });
    
    const bl = blRes.rows[0] as BangLuong;
    const computed = ns04Domain.changeStatus(bl, trang_thai);
    
    const result = await db.query(
      `UPDATE "BangLuong" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [computed.trang_thai, computed.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

ns04Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`SELECT * FROM "BangLuong" ORDER BY ky_luong DESC`);
    const buffer = await generateNs04Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=NS04_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
