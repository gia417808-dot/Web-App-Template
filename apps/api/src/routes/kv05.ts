import { Router } from 'express';
import { getDb } from '../db/index.js';
import { kv05Domain, CanhBaoBoSung, MucTonKho } from '@web-app-template/domain';
import { generateKv05Workbook } from '@web-app-template/workbook-engine';

export const kv05Router = Router();

kv05Router.get('/canh-bao', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "CanhBaoBoSung" ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

kv05Router.post('/de-xuat', async (req, res) => {
  const { muc_ton_id, ton_kha_dung } = req.body;
  const db = getDb();
  
  try {
    const mtRes = await db.query('SELECT * FROM "MucTonKho" WHERE id = $1', [muc_ton_id]);
    if (mtRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy mức tồn' });
    
    const prop = kv05Domain.deXuatBoSung(mtRes.rows[0] as MucTonKho, ton_kha_dung);
    
    const result = await db.query(
      `INSERT INTO "CanhBaoBoSung" (organization_id, muc_ton_id, ton_kha_dung, luong_goi_y, trang_thai)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [prop.organization_id, prop.muc_ton_id, prop.ton_kha_dung, prop.luong_goi_y, prop.trang_thai]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

kv05Router.put('/canh-bao/:id/trang-thai', async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;
  const db = getDb();
  
  try {
    await db.query('BEGIN');
    const cbRes = await db.query('SELECT * FROM "CanhBaoBoSung" WHERE id = $1 FOR UPDATE', [id]);
    if (cbRes.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Không tìm thấy cảnh báo' });
    }
    
    const updated = kv05Domain.changeStatus(cbRes.rows[0] as CanhBaoBoSung, trang_thai);
    
    await db.query(
      'UPDATE "CanhBaoBoSung" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3',
      [updated.trang_thai, updated.row_version, id]
    );
    
    await db.query('COMMIT');
    res.json(updated);
  } catch (err: any) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

kv05Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT c.id, c.trang_thai, c.ton_kha_dung, c.luong_goi_y,
             m.ton_muc_tieu, m.san_pham_id, m.kho_id
      FROM "CanhBaoBoSung" c
      JOIN "MucTonKho" m ON c.muc_ton_id = m.id
      ORDER BY c.created_at DESC
    `);
    const buffer = await generateKv05Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=KV05_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
