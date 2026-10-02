import { Router } from 'express';
import { getDb } from '../db/index.js';
import { kt03Domain, PhaiTra, ThanhToanPhaiTra } from '@web-app-template/domain';
import { generateKt03Workbook } from '@web-app-template/workbook-engine';

export const kt03Router = Router();

kt03Router.get('/phai-tra', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "PhaiTra" ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

kt03Router.post('/phai-tra/:id/thanh-toan', async (req, res) => {
  const { id } = req.params;
  const { so_tien, ngay_thanh_toan } = req.body;
  const db = getDb();
  
  try {
    const ptRes = await db.query('SELECT * FROM "PhaiTra" WHERE id = $1', [id]);
    if (ptRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy khoản phải trả' });
    
    const result = await db.query(
      `INSERT INTO "ThanhToanPhaiTra" (organization_id, phai_tra_id, so_tien, ngay_thanh_toan, trang_thai)
       VALUES ($1, $2, $3, $4, 'DRAFT') RETURNING *`,
      [ptRes.rows[0].organization_id, id, so_tien, ngay_thanh_toan]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

kt03Router.put('/thanh-toan/:id/doi-soat', async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  try {
    await db.query('BEGIN');
    const ttRes = await db.query('SELECT * FROM "ThanhToanPhaiTra" WHERE id = $1 FOR UPDATE', [id]);
    if (ttRes.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Không tìm thấy thanh toán' });
    }
    const tt = ttRes.rows[0] as ThanhToanPhaiTra;
    
    const ptRes = await db.query('SELECT * FROM "PhaiTra" WHERE id = $1 FOR UPDATE', [tt.phai_tra_id]);
    const pt = ptRes.rows[0] as PhaiTra;
    
    const { phaiTra, thanhToan } = kt03Domain.doiSoatChi(pt, tt);
    
    await db.query(
      'UPDATE "PhaiTra" SET da_thanh_toan = $1, con_lai = $2, trang_thai = $3, row_version = $4, updated_at = NOW() WHERE id = $5',
      [phaiTra.da_thanh_toan, phaiTra.con_lai, phaiTra.trang_thai, phaiTra.row_version, phaiTra.id]
    );
    
    await db.query(
      'UPDATE "ThanhToanPhaiTra" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3',
      [thanhToan.trang_thai, thanhToan.row_version, thanhToan.id]
    );
    
    await db.query('COMMIT');
    res.json({ phaiTra, thanhToan });
  } catch (err: any) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

kt03Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`SELECT * FROM "PhaiTra" ORDER BY created_at DESC`);
    const buffer = await generateKt03Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=KT03_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
