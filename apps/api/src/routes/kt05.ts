import { Router } from 'express';
import { getDb } from '../db/index.js';
import { kt05Domain, LaiGopDonHang } from '@web-app-template/domain';
import { generateKt05Workbook } from '@web-app-template/workbook-engine';

export const kt05Router = Router();

kt05Router.get('/lai-gop', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM "LaiGopDonHang" ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

kt05Router.post('/don-hang/:id/tinh-lai-gop', async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  try {
    const dhRes = await db.query('SELECT * FROM "DonHang" WHERE id = $1', [id]);
    if (dhRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    const dh = dhRes.rows[0];
    
    const linesRes = await db.query('SELECT * FROM "ChiTietDon" WHERE order_id = $1', [id]);
    
    // Giả lập lấy giá vốn từ đâu đó (trong thực tế lấy từ DongPhieuKho/StockLedger)
    // Ở đây ta mock 1 data đơn giản:
    const chiTietLines = linesRes.rows.map(line => ({
      chi_tiet_don_id: line.id,
      doanh_thu: parseInt(line.line_total_vnd),
      gia_von: parseInt(line.line_total_vnd) * 0.7 // Mock giá vốn bằng 70% doanh thu
    }));

    const computed = kt05Domain.tinhLaiGop(dh.organization_id, dh.id, chiTietLines);
    
    await db.query('BEGIN');
    
    const lgRes = await db.query(
      `INSERT INTO "LaiGopDonHang" (organization_id, don_hang_id, doanh_thu_thuan, tong_gia_von, lai_gop, trang_thai)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (organization_id, don_hang_id) 
       DO UPDATE SET doanh_thu_thuan = $3, tong_gia_von = $4, lai_gop = $5, trang_thai = $6, updated_at = NOW(), row_version = "LaiGopDonHang".row_version + 1
       RETURNING *`,
      [computed.organization_id, computed.don_hang_id, computed.doanh_thu_thuan, computed.tong_gia_von, computed.lai_gop, computed.trang_thai]
    );
    const lgId = lgRes.rows[0].id;
    
    // Delete old lines
    await db.query('DELETE FROM "LaiGopChiTiet" WHERE lai_gop_don_id = $1', [lgId]);
    
    for (const ct of computed.chi_tiet) {
      await db.query(
        `INSERT INTO "LaiGopChiTiet" (organization_id, lai_gop_don_id, chi_tiet_don_id, doanh_thu, gia_von, lai_gop)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [computed.organization_id, lgId, ct.chi_tiet_don_id, ct.doanh_thu, ct.gia_von, ct.lai_gop]
      );
    }
    
    await db.query('COMMIT');
    res.json(lgRes.rows[0]);
  } catch (err: any) {
    await db.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

kt05Router.put('/lai-gop/:id/trang-thai', async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;
  const db = getDb();
  
  try {
    const lgRes = await db.query('SELECT * FROM "LaiGopDonHang" WHERE id = $1', [id]);
    if (lgRes.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy phiếu tính lãi gộp' });
    
    const lg = lgRes.rows[0] as LaiGopDonHang;
    const updated = kt05Domain.changeStatus(lg, trang_thai);
    
    const result = await db.query(
      'UPDATE "LaiGopDonHang" SET trang_thai = $1, row_version = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [updated.trang_thai, updated.row_version, id]
    );
    
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

kt05Router.get('/export', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`SELECT * FROM "LaiGopDonHang" ORDER BY created_at DESC`);
    const buffer = await generateKt05Workbook(result.rows);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=KT05_3.0.0-vi.xlsx');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
