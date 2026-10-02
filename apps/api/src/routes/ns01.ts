import { Router } from 'express';
import { getDb } from '../db/index.js';
import { ns01Domain, NhanSu } from '@web-app-template/domain';
import { generateNs01Workbook } from '@web-app-template/workbook-engine';

export const ns01Router = Router();

ns01Router.get('/nhan-su', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "NhanSu" ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

ns01Router.post('/nhan-su', async (req, res) => {
  const { organization_id, ma_nhan_vien, ho_ten, ngay_vao_lam } = req.body;
  const db = getDb();
  
  try {
    const dummy: NhanSu = {
      id: '', organization_id, ma_nhan_vien, ho_ten: '', ngay_vao_lam: '',
      tham_nien_ngay: 0, trang_thai: 'ACTIVE', row_version: 0
    };
    const computed = ns01Domain.capNhatHoSo(dummy, ho_ten, ngay_vao_lam);
    
    const result = await db.query(
      `INSERT INTO "NhanSu" (organization_id, ma_nhan_vien, ho_ten, ngay_vao_lam, tham_nien_ngay, trang_thai)
       VALUES ($1, $2, $3, $4, $5, 'ACTIVE') RETURNING *`,
      [organization_id, ma_nhan_vien, computed.ho_ten, computed.ngay_vao_lam, computed.tham_nien_ngay]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

ns01Router.put('/nhan-su/:id/cap-nhat', async (req, res) => {
  const { id } = req.params;
  const { ho_ten, ngay_vao_lam } = req.body;
  const db = getDb();
  
  try {
    const nsRes = await db.query('SELECT * FROM "NhanSu" WHERE id = $1', [id]);
    if (nsRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy nhân sự' });
    
    const ns = nsRes.rows[0] as NhanSu;
    const computed = ns01Domain.capNhatHoSo(ns, ho_ten, ngay_vao_lam);
    
    const result = await db.query(
      `UPDATE "NhanSu" SET ho_ten = $1, ngay_vao_lam = $2, tham_nien_ngay = $3, row_version = $4, updated_at = NOW() WHERE id = $5 RETURNING *`,
      [computed.ho_ten, computed.ngay_vao_lam, computed.tham_nien_ngay, computed.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

ns01Router.put('/nhan-su/:id/trang-thai', async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;
  const db = getDb();
  
  try {
    const nsRes = await db.query('SELECT * FROM "NhanSu" WHERE id = $1', [id]);
    if (nsRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy nhân sự' });
    
    const ns = nsRes.rows[0] as NhanSu;
    const computed = ns01Domain.changeStatus(ns, trang_thai);
    
    const result = await db.query(
      `UPDATE "NhanSu" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [computed.trang_thai, computed.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

ns01Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`SELECT * FROM "NhanSu" ORDER BY created_at DESC`);
    const buffer = await generateNs01Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=NS01_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
