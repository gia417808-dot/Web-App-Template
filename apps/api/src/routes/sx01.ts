import { Router } from 'express';
import { getDb } from '../db/index.js';
import { sx01Domain, LenhSanXuat } from '@web-app-template/domain';
import { generateSx01Workbook } from '@web-app-template/workbook-engine';

export const sx01Router = Router();

sx01Router.get('/lenh', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "LenhSanXuat" ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

sx01Router.post('/lenh/:id/phat-hanh', async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  try {
    const lenhRes = await db.query('SELECT * FROM "LenhSanXuat" WHERE id = $1', [id]);
    if (lenhRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy lệnh' });
    const lenh = lenhRes.rows[0] as LenhSanXuat;
    
    lenh.luong_ke_hoach = Number(lenh.luong_ke_hoach);

    const computed = sx01Domain.phatHanhLenh(lenh);
    
    const result = await db.query(
      `UPDATE "LenhSanXuat" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [computed.trang_thai, computed.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

sx01Router.post('/lenh/:id/ghi-nhan', async (req, res) => {
  const { id } = req.params;
  const { luong_dat = 0, luong_loi = 0 } = req.body;
  const db = getDb();
  
  try {
    const lenhRes = await db.query('SELECT * FROM "LenhSanXuat" WHERE id = $1', [id]);
    if (lenhRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy lệnh' });
    const lenh = lenhRes.rows[0] as LenhSanXuat;
    
    lenh.luong_ke_hoach = Number(lenh.luong_ke_hoach);
    lenh.luong_dat = Number(lenh.luong_dat);
    lenh.luong_loi = Number(lenh.luong_loi);

    const computed = sx01Domain.ghiNhanSanLuong(lenh, Number(luong_dat), Number(luong_loi));
    
    const result = await db.query(
      `UPDATE "LenhSanXuat" SET 
        luong_dat = $1, luong_loi = $2, ty_le_hoan_thanh = $3, 
        trang_thai = $4, row_version = $5, updated_at = NOW() 
       WHERE id = $6 RETURNING *`,
      [computed.luong_dat, computed.luong_loi, computed.ty_le_hoan_thanh, computed.trang_thai, computed.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

sx01Router.put('/lenh/:id/trang-thai', async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;
  const db = getDb();
  
  try {
    const lenhRes = await db.query('SELECT * FROM "LenhSanXuat" WHERE id = $1', [id]);
    if (lenhRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy lệnh' });
    
    const lenh = lenhRes.rows[0] as LenhSanXuat;
    const computed = sx01Domain.changeStatus(lenh, trang_thai);
    
    const result = await db.query(
      `UPDATE "LenhSanXuat" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [computed.trang_thai, computed.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

sx01Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`SELECT * FROM "LenhSanXuat" ORDER BY created_at DESC`);
    const buffer = await generateSx01Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=SX01_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
