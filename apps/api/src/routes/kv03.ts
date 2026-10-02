import { Router } from 'express';
import { getDb } from '../db/index.js';
import { kv03Domain, DonMua } from '@web-app-template/domain';
import { generateKv03Workbook } from '@web-app-template/workbook-engine';

export const kv03Router = Router();

kv03Router.get('/don-mua', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "DonMua" ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

kv03Router.post('/don-mua/:id/dat-mua', async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  try {
    await db.query('BEGIN');
    const dmRes = await db.query('SELECT * FROM "DonMua" WHERE id = $1 FOR UPDATE', [id]);
    if (dmRes.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Không tìm thấy đơn mua' });
    }
    
    const donMua = dmRes.rows[0] as DonMua;
    const updated = kv03Domain.datMuaHang(donMua);
    
    await db.query(
      'UPDATE "DonMua" SET trang_thai = $1, chenh_lech_nhan = $2, row_version = $3, updated_at = NOW() WHERE id = $4',
      [updated.trang_thai, updated.chenh_lech_nhan, updated.row_version, id]
    );
    
    await db.query('COMMIT');
    res.json(updated);
  } catch (err: any) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

kv03Router.post('/don-mua/:id/nhan-hang', async (req, res) => {
  const { id } = req.params;
  const { luong_nhan_them } = req.body;
  const db = getDb();
  
  try {
    await db.query('BEGIN');
    const dmRes = await db.query('SELECT * FROM "DonMua" WHERE id = $1 FOR UPDATE', [id]);
    if (dmRes.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Không tìm thấy đơn mua' });
    }
    
    const donMua = dmRes.rows[0] as DonMua;
    const updated = kv03Domain.nhanHang(donMua, luong_nhan_them);
    
    await db.query(
      'UPDATE "DonMua" SET trang_thai = $1, luong_nhan_hop_le = $2, chenh_lech_nhan = $3, row_version = $4, updated_at = NOW() WHERE id = $5',
      [updated.trang_thai, updated.luong_nhan_hop_le, updated.chenh_lech_nhan, updated.row_version, id]
    );
    
    await db.query('COMMIT');
    res.json(updated);
  } catch (err: any) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

kv03Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "DonMua" ORDER BY created_at DESC');
    const buffer = await generateKv03Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=KV03_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
