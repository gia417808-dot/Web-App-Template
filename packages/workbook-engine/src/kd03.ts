import ExcelJS from 'exceljs';
import { calculateTargetProgress } from '@web-app-template/domain';

export async function generateKd03Workbook(targets: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Chỉ Tiêu Bán Hàng');

  sheet.columns = [
    { header: 'Nhân Viên', key: 'owner_id', width: 36 },
    { header: 'Từ Ngày', key: 'period_start', width: 15 },
    { header: 'Đến Ngày', key: 'period_end', width: 15 },
    { header: 'Chỉ Tiêu (VND)', key: 'target_vnd', width: 20 },
    { header: 'Doanh Thu (VND)', key: 'confirmed_revenue_vnd', width: 20 },
    { header: 'Tiến Độ (%)', key: 'progress_pct', width: 15 }
  ];

  targets.forEach(t => {
    const progress = calculateTargetProgress(parseFloat(t.confirmed_revenue_vnd || 0), parseFloat(t.target_vnd));
    sheet.addRow({
      owner_id: t.owner_id,
      period_start: t.period_start,
      period_end: t.period_end,
      target_vnd: parseFloat(t.target_vnd),
      confirmed_revenue_vnd: parseFloat(t.confirmed_revenue_vnd || 0),
      progress_pct: progress
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
