import { Router } from 'express';
import { getDb } from '../db/index.js';
import { sx03Domain, CongDoan } from '@web-app-template/domain';
import { generateSx03Workbook } from '@web-app-template/workbook-engine';

export const sx03Router = Router();

sx03Router.get('/cong-doan', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT c.*, l.ma_lenh 
      FROM "CongDoan" c 
      JOIN "LenhSanXuat" l ON c.lenh_san_xuat_id = l.id
      ORDER BY c.created_at DESC
    `);
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

sx03Router.post('/cong-doan/:id/cap-nhat', async (req, res) => {
  const { id } = req.params;
  const { ty_le_dat, trang_thai, ghi_chu } = req.body;
  const db = getDb();
  
  try {
    await db.query('BEGIN');
    const cdRes = await db.query('SELECT * FROM "CongDoan" WHERE id = $1 FOR UPDATE', [id]);
    if (cdRes.rows.length === 0) throw new Error('Không tìm thấy công đoạn');
    const cd = cdRes.rows[0] as CongDoan;
    
    cd.trong_so = Number(cd.trong_so);
    cd.ty_le_dat = Number(cd.ty_le_dat);

    const { updatedCd, nhatKy } = sx03Domain.capNhatTienDo(cd, Number(ty_le_dat), trang_thai, ghi_chu);
    
    const result = await db.query(
      `UPDATE "CongDoan" SET 
        ty_le_dat = $1, trang_thai = $2, row_version = $3, updated_at = NOW() 
       WHERE id = $4 RETURNING *`,
      [updatedCd.ty_le_dat, updatedCd.trang_thai, updatedCd.row_version, id]
    );

    await db.query(
      `INSERT INTO "NhatKySX" (organization_id, cong_doan_id, ty_le_dat_truoc, ty_le_dat_sau, trang_thai_truoc, trang_thai_sau, ghi_chu)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [nhatKy.organization_id, nhatKy.cong_doan_id, nhatKy.ty_le_dat_truoc, nhatKy.ty_le_dat_sau, nhatKy.trang_thai_truoc, nhatKy.trang_thai_sau, nhatKy.ghi_chu]
    );
    
    await db.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err: any) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

sx03Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT c.*, l.ma_lenh 
      FROM "CongDoan" c 
      JOIN "LenhSanXuat" l ON c.lenh_san_xuat_id = l.id
      ORDER BY c.created_at DESC
    `);
    const buffer = await generateSx03Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=SX03_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
