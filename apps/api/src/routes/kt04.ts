import { Router } from 'express';
import { getDb } from '../db/index.js';
import { kt04Domain, NganSach } from '@web-app-template/domain';
import { generateKt04Workbook } from '@web-app-template/workbook-engine';

export const kt04Router = Router();

kt04Router.get('/ngan-sach', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "NganSach" ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

kt04Router.put('/ngan-sach/:id/thuc-chi', async (req, res) => {
  const { id } = req.params;
  const { thuc_chi } = req.body;
  const db = getDb();
  
  try {
    const nsRes = await db.query('SELECT * FROM "NganSach" WHERE id = $1', [id]);
    if (nsRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy ngân sách' });
    
    const ns = nsRes.rows[0] as NganSach;
    const updated = kt04Domain.kiemSoatVuotChi(ns, thuc_chi);
    
    const result = await db.query(
      'UPDATE "NganSach" SET thuc_chi = $1, chenh_lech = $2, row_version = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [updated.thuc_chi, updated.chenh_lech, updated.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

kt04Router.put('/ngan-sach/:id/trang-thai', async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;
  const db = getDb();
  
  try {
    const nsRes = await db.query('SELECT * FROM "NganSach" WHERE id = $1', [id]);
    if (nsRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy ngân sách' });
    
    const ns = nsRes.rows[0] as NganSach;
    const updated = kt04Domain.changeStatus(ns, trang_thai);
    
    const result = await db.query(
      'UPDATE "NganSach" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [updated.trang_thai, updated.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

kt04Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`SELECT * FROM "NganSach" ORDER BY ky_ngan_sach DESC, created_at DESC`);
    const buffer = await generateKt04Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=KT04_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
