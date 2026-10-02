import { Router } from 'express';
import { getDb } from '../db/index.js';
import { kv04Domain, DotKiemKe } from '@web-app-template/domain';
import { generateKv04Workbook } from '@web-app-template/workbook-engine';

export const kv04Router = Router();

kv04Router.get('/kiem-ke', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "DotKiemKe" ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

kv04Router.put('/kiem-ke/:id/chot', async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  try {
    await db.query('BEGIN');
    const dotRes = await db.query('SELECT * FROM "DotKiemKe" WHERE id = $1 FOR UPDATE', [id]);
    if (dotRes.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Không tìm thấy đợt kiểm kê' });
    }
    
    const linesRes = await db.query('SELECT * FROM "DongKiemKe" WHERE dot_kiem_ke_id = $1 FOR UPDATE', [id]);
    
    const dot = {
      ...dotRes.rows[0],
      lines: linesRes.rows
    } as DotKiemKe;
    
    const updated = kv04Domain.chotKiemKe(dot);
    
    await db.query(
      'UPDATE "DotKiemKe" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3',
      [updated.trang_thai, updated.row_version, id]
    );
    
    for (const line of updated.lines) {
      await db.query(
        'UPDATE "DongKiemKe" SET lech = $1, updated_at = NOW() WHERE id = $2',
        [line.lech, line.id]
      );
    }
    
    await db.query('COMMIT');
    res.json(updated);
  } catch (err: any) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

kv04Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT k.ma_kiem_ke, k.trang_thai, k.ngay_kiem_ke, 
             d.san_pham_id, d.ton_so, d.dem_thuc_te, d.lech
      FROM "DotKiemKe" k
      JOIN "DongKiemKe" d ON k.id = d.dot_kiem_ke_id
      ORDER BY k.created_at DESC
    `);
    const buffer = await generateKv04Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=KV04_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
