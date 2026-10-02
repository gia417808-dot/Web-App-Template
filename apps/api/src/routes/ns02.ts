import { Router } from 'express';
import { getDb } from '../db/index.js';
import { ns02Domain, ChamCong, CaLam } from '@web-app-template/domain';
import { generateNs02Workbook } from '@web-app-template/workbook-engine';

export const ns02Router = Router();

ns02Router.get('/cham-cong', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "ChamCong" ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

ns02Router.post('/cham-cong/:id/duyet', async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  try {
    const ccRes = await db.query('SELECT * FROM "ChamCong" WHERE id = $1', [id]);
    if (ccRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy phiếu chấm công' });
    const cc = ccRes.rows[0] as ChamCong;

    const caRes = await db.query('SELECT * FROM "CaLam" WHERE id = $1', [cc.ca_lam_id]);
    if (caRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy ca làm' });
    const caLam = caRes.rows[0] as CaLam;
    
    // Convert Decimal types from PG back to number
    caLam.tru_gio_nghi = Number(caLam.tru_gio_nghi);
    
    const computed = ns02Domain.duyetChamCong(cc, caLam);
    
    const result = await db.query(
      `UPDATE "ChamCong" SET 
        gio_vao_thuc_te = $1, gio_ra_thuc_te = $2, tong_gio_lam = $3, 
        trang_thai = $4, row_version = $5, updated_at = NOW() 
       WHERE id = $6 RETURNING *`,
      [computed.gio_vao_thuc_te, computed.gio_ra_thuc_te, computed.tong_gio_lam, computed.trang_thai, computed.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

ns02Router.put('/cham-cong/:id/trang-thai', async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;
  const db = getDb();
  
  try {
    const ccRes = await db.query('SELECT * FROM "ChamCong" WHERE id = $1', [id]);
    if (ccRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy phiếu chấm công' });
    
    const cc = ccRes.rows[0] as ChamCong;
    const computed = ns02Domain.changeStatus(cc, trang_thai);
    
    const result = await db.query(
      `UPDATE "ChamCong" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [computed.trang_thai, computed.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

ns02Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`SELECT * FROM "ChamCong" ORDER BY created_at DESC`);
    const buffer = await generateNs02Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=NS02_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
