import { Router } from 'express';
import { getDb } from '../db/index.js';
import { kt02Domain, PhaiThu, ThanhToanPhaiThu } from '@web-app-template/domain';
import { generateKt02Workbook } from '@web-app-template/workbook-engine';

export const kt02Router = Router();

kt02Router.get('/phai-thu', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "PhaiThu" ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

kt02Router.post('/phai-thu/:id/thanh-toan', async (req, res) => {
  const { id } = req.params;
  const { so_tien, ngay_thanh_toan } = req.body;
  const db = getDb();
  
  try {
    const ptRes = await db.query('SELECT * FROM "PhaiThu" WHERE id = $1', [id]);
    if (ptRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy khoản phải thu' });
    
    const result = await db.query(
      `INSERT INTO "ThanhToanPhaiThu" (organization_id, phai_thu_id, so_tien, ngay_thanh_toan, trang_thai)
       VALUES ($1, $2, $3, $4, 'DRAFT') RETURNING *`,
      [ptRes.rows[0].organization_id, id, so_tien, ngay_thanh_toan]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

kt02Router.put('/thanh-toan/:id/doi-soat', async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  try {
    await db.query('BEGIN');
    const ttRes = await db.query('SELECT * FROM "ThanhToanPhaiThu" WHERE id = $1 FOR UPDATE', [id]);
    if (ttRes.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Không tìm thấy thanh toán' });
    }
    const tt = ttRes.rows[0] as ThanhToanPhaiThu;
    
    const ptRes = await db.query('SELECT * FROM "PhaiThu" WHERE id = $1 FOR UPDATE', [tt.phai_thu_id]);
    const pt = ptRes.rows[0] as PhaiThu;
    
    const { phaiThu, thanhToan } = kt02Domain.doiSoatThu(pt, tt);
    
    await db.query(
      'UPDATE "PhaiThu" SET da_thanh_toan = $1, con_lai = $2, trang_thai = $3, row_version = $4, updated_at = NOW() WHERE id = $5',
      [phaiThu.da_thanh_toan, phaiThu.con_lai, phaiThu.trang_thai, phaiThu.row_version, phaiThu.id]
    );
    
    await db.query(
      'UPDATE "ThanhToanPhaiThu" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3',
      [thanhToan.trang_thai, thanhToan.row_version, thanhToan.id]
    );
    
    await db.query('COMMIT');
    res.json({ phaiThu, thanhToan });
  } catch (err: any) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

kt02Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`SELECT * FROM "PhaiThu" ORDER BY created_at DESC`);
    const buffer = await generateKt02Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=KT02_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
