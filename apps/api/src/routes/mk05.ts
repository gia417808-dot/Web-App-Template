import { Router } from 'express';
import { getDb } from '../db/index.js';
import { mk05Domain, ThuNghiem, BienThe, MK05Status } from '@web-app-template/domain';
import { generateMk05Workbook } from '@web-app-template/workbook-engine';

export const mk05Router = Router();

mk05Router.get('/thu-nghiem', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "ThuNghiem" ORDER BY created_at DESC');
    const thuNghiems = result.rows;
    
    // Fetch variants for all
    const btResult = await db.query('SELECT * FROM "BienThe" ORDER BY created_at ASC');
    const bienThes = btResult.rows;

    const data = thuNghiems.map((tn: any) => ({
      ...tn,
      bien_thes: bienThes.filter((bt: any) => bt.thu_nghiem_id === tn.id)
    }));

    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

mk05Router.post('/thu-nghiem/:id/chot', async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  try {
    await db.query('BEGIN');
    
    const tnRes = await db.query('SELECT * FROM "ThuNghiem" WHERE id = $1 FOR UPDATE', [id]);
    if (tnRes.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Không tìm thấy thử nghiệm' });
    }
    const thuNghiem = tnRes.rows[0] as ThuNghiem;
    
    const btRes = await db.query('SELECT * FROM "BienThe" WHERE thu_nghiem_id = $1 FOR UPDATE', [id]);
    const bienThes = btRes.rows as BienThe[];
    
    const { thuNghiem: updatedTn, bienTheList: updatedBts } = mk05Domain.chotThuNghiem(thuNghiem, bienThes);
    
    await db.query(
      'UPDATE "ThuNghiem" SET trang_thai = $1, revision = $2, row_version = $3, updated_at = NOW() WHERE id = $4',
      [updatedTn.trang_thai, updatedTn.revision, updatedTn.row_version, id]
    );
    
    for (const bt of updatedBts) {
      await db.query(
        'UPDATE "BienThe" SET ty_le_phan_hoi = $1, revision = $2, row_version = $3, updated_at = NOW() WHERE id = $4',
        [bt.ty_le_phan_hoi, bt.revision, bt.row_version, bt.id]
      );
    }
    
    await db.query('COMMIT');
    res.json({ thuNghiem: updatedTn, bienTheList: updatedBts });
  } catch (err: any) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

mk05Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT b.ten_bien_the, b.luot_tiep_can, b.phan_hoi, b.ty_le_phan_hoi, t.ten_thu_nghiem, t.trang_thai
      FROM "BienThe" b
      JOIN "ThuNghiem" t ON b.thu_nghiem_id = t.id
      ORDER BY t.created_at DESC, b.created_at ASC
    `);
    
    const buffer = await generateMk05Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=MK05_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
