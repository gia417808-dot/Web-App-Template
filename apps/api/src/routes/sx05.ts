import { Router } from 'express';
import { getDb } from '../db/index.js';
import { sx05Domain, LenhSanXuatSX05, ChiPhiSX } from '@web-app-template/domain';
import { generateSx05Workbook } from '@web-app-template/workbook-engine';

export const sx05Router = Router();

sx05Router.get('/gia-thanh', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "LenhSanXuat" ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

sx05Router.post('/gia-thanh/:lenh_id/tinh-toan', async (req, res) => {
  const { lenh_id } = req.params;
  const db = getDb();
  
  try {
    const lenhRes = await db.query('SELECT id, organization_id, ma_lenh, luong_dat, tong_chi_phi, gia_thanh_don_vi, trang_thai_gia_thanh, row_version FROM "LenhSanXuat" WHERE id = $1', [lenh_id]);
    if (lenhRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy lệnh' });
    const lenh = lenhRes.rows[0] as LenhSanXuatSX05;
    
    const cpRes = await db.query('SELECT * FROM "ChiPhiSX" WHERE lenh_san_xuat_id = $1', [lenh_id]);
    const chiPhis = cpRes.rows as ChiPhiSX[];

    const computed = sx05Domain.tinhGiaThanh(lenh, chiPhis);
    
    const result = await db.query(
      `UPDATE "LenhSanXuat" SET 
        tong_chi_phi = $1, gia_thanh_don_vi = $2, trang_thai_gia_thanh = $3, 
        row_version = $4, updated_at = NOW() 
       WHERE id = $5 RETURNING *`,
      [computed.tong_chi_phi, computed.gia_thanh_don_vi, computed.trang_thai_gia_thanh, computed.row_version, lenh_id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

sx05Router.put('/gia-thanh/:lenh_id/trang-thai', async (req, res) => {
  const { lenh_id } = req.params;
  const db = getDb();
  
  try {
    const lenhRes = await db.query('SELECT id, organization_id, ma_lenh, luong_dat, tong_chi_phi, gia_thanh_don_vi, trang_thai_gia_thanh, row_version FROM "LenhSanXuat" WHERE id = $1', [lenh_id]);
    if (lenhRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy lệnh' });
    
    const lenh = lenhRes.rows[0] as LenhSanXuatSX05;
    const computed = sx05Domain.lockGiaThanh(lenh); // Only supports locking for now based on UI action
    
    const result = await db.query(
      `UPDATE "LenhSanXuat" SET trang_thai_gia_thanh = $1, row_version = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [computed.trang_thai_gia_thanh, computed.row_version, lenh_id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

sx05Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`SELECT * FROM "LenhSanXuat" ORDER BY created_at DESC`);
    const buffer = await generateSx05Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=SX05_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
