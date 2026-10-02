import { Router } from 'express';
import { getDb } from '../db/index.js';
import { sx02Domain, DinhMuc } from '@web-app-template/domain';
import { generateSx02Workbook } from '@web-app-template/workbook-engine';

export const sx02Router = Router();

sx02Router.get('/dinh-muc', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT d.*, v.ma_vat_tu, v.ten_vat_tu, v.dvt 
      FROM "DinhMuc" d
      JOIN "VatTu" v ON d.vat_tu_id = v.id
      ORDER BY d.created_at DESC
    `);
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

sx02Router.post('/dinh-muc/:id/du-tru', async (req, res) => {
  const { id } = req.params;
  const { luong_ke_hoach } = req.body;
  const db = getDb();
  
  try {
    const dmRes = await db.query('SELECT * FROM "DinhMuc" WHERE id = $1', [id]);
    if (dmRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy định mức' });
    const dm = dmRes.rows[0] as DinhMuc;
    
    dm.so_luong_dinh_muc = Number(dm.so_luong_dinh_muc);
    dm.ty_le_hao_hut = Number(dm.ty_le_hao_hut);

    const computed = sx02Domain.duTruVatTu(dm, luong_ke_hoach);
    
    const result = await db.query(
      `INSERT INTO "DuTruVatTu" (organization_id, dinh_muc_id, luong_ke_hoach, luong_can)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [computed.organization_id, computed.dinh_muc_id, computed.luong_ke_hoach, computed.luong_can]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

sx02Router.put('/dinh-muc/:id/trang-thai', async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;
  const db = getDb();
  
  try {
    const dmRes = await db.query('SELECT * FROM "DinhMuc" WHERE id = $1', [id]);
    if (dmRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy định mức' });
    
    const dm = dmRes.rows[0] as DinhMuc;
    const computed = sx02Domain.changeStatus(dm, trang_thai);
    
    const result = await db.query(
      `UPDATE "DinhMuc" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [computed.trang_thai, computed.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

sx02Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT d.*, v.ma_vat_tu, v.ten_vat_tu, v.dvt 
      FROM "DinhMuc" d
      JOIN "VatTu" v ON d.vat_tu_id = v.id
      ORDER BY d.created_at DESC
    `);
    const buffer = await generateSx02Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=SX02_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
