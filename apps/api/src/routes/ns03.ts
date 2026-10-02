import { Router } from 'express';
import { getDb } from '../db/index.js';
import { ns03Domain, DonNghi, SoDuPhep } from '@web-app-template/domain';
import { generateNs03Workbook } from '@web-app-template/workbook-engine';

export const ns03Router = Router();

ns03Router.get('/don-nghi', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "DonNghi" ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

ns03Router.post('/don-nghi/:id/duyet', async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  try {
    await db.query('BEGIN');
    const dnRes = await db.query('SELECT * FROM "DonNghi" WHERE id = $1 FOR UPDATE', [id]);
    if (dnRes.rows.length === 0) throw new Error('Không tìm thấy đơn nghỉ');
    const dn = dnRes.rows[0] as DonNghi;

    const currentYear = new Date(dn.ngay_bat_dau).getFullYear();

    const sdRes = await db.query('SELECT * FROM "SoDuPhep" WHERE nhan_su_id = $1 AND nam = $2 FOR UPDATE', [dn.nhan_su_id, currentYear]);
    if (sdRes.rows.length === 0) throw new Error('Không tìm thấy số dư phép của nhân viên cho năm này');
    const sd = sdRes.rows[0] as SoDuPhep;
    
    // Convert numeric from pg to number
    dn.so_ngay_nghi = Number(dn.so_ngay_nghi);
    sd.phep_dau_ky = Number(sd.phep_dau_ky);
    sd.phep_phat_sinh = Number(sd.phep_phat_sinh);
    sd.phep_da_duyet = Number(sd.phep_da_duyet);
    sd.phep_con_lai = Number(sd.phep_con_lai);

    const computed = ns03Domain.duyetNghiPhep(dn, sd);
    
    const resultDn = await db.query(
      `UPDATE "DonNghi" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [computed.donNghi.trang_thai, computed.donNghi.row_version, id]
    );

    await db.query(
      `UPDATE "SoDuPhep" SET phep_da_duyet = $1, phep_con_lai = $2, row_version = $3, updated_at = NOW() WHERE id = $4`,
      [computed.soDu.phep_da_duyet, computed.soDu.phep_con_lai, computed.soDu.row_version, computed.soDu.id]
    );
    
    await db.query('COMMIT');
    res.json(resultDn.rows[0]);
  } catch (err: any) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

ns03Router.post('/don-nghi/:id/huy', async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  try {
    await db.query('BEGIN');
    const dnRes = await db.query('SELECT * FROM "DonNghi" WHERE id = $1 FOR UPDATE', [id]);
    if (dnRes.rows.length === 0) throw new Error('Không tìm thấy đơn nghỉ');
    const dn = dnRes.rows[0] as DonNghi;

    const currentYear = new Date(dn.ngay_bat_dau).getFullYear();

    const sdRes = await db.query('SELECT * FROM "SoDuPhep" WHERE nhan_su_id = $1 AND nam = $2 FOR UPDATE', [dn.nhan_su_id, currentYear]);
    if (sdRes.rows.length === 0) throw new Error('Không tìm thấy số dư phép');
    const sd = sdRes.rows[0] as SoDuPhep;
    
    dn.so_ngay_nghi = Number(dn.so_ngay_nghi);
    sd.phep_dau_ky = Number(sd.phep_dau_ky);
    sd.phep_phat_sinh = Number(sd.phep_phat_sinh);
    sd.phep_da_duyet = Number(sd.phep_da_duyet);
    sd.phep_con_lai = Number(sd.phep_con_lai);

    const computed = ns03Domain.huyNghiPhep(dn, sd);
    
    const resultDn = await db.query(
      `UPDATE "DonNghi" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [computed.donNghi.trang_thai, computed.donNghi.row_version, id]
    );

    await db.query(
      `UPDATE "SoDuPhep" SET phep_da_duyet = $1, phep_con_lai = $2, row_version = $3, updated_at = NOW() WHERE id = $4`,
      [computed.soDu.phep_da_duyet, computed.soDu.phep_con_lai, computed.soDu.row_version, computed.soDu.id]
    );
    
    await db.query('COMMIT');
    res.json(resultDn.rows[0]);
  } catch (err: any) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

ns03Router.put('/don-nghi/:id/trang-thai', async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;
  const db = getDb();
  
  try {
    const dnRes = await db.query('SELECT * FROM "DonNghi" WHERE id = $1', [id]);
    if (dnRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy đơn nghỉ' });
    
    const dn = dnRes.rows[0] as DonNghi;
    const computed = ns03Domain.changeStatus(dn, trang_thai);
    
    const result = await db.query(
      `UPDATE "DonNghi" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [computed.trang_thai, computed.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

ns03Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`SELECT * FROM "SoDuPhep" ORDER BY nam DESC, created_at DESC`);
    const buffer = await generateNs03Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=NS03_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
