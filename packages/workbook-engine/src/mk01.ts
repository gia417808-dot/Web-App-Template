import ExcelJS from 'exceljs';
import { calculateOnTimePublishRate } from '@web-app-template/domain';

export async function generateMk01Workbook(contents: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Lịch Nội Dung');

  sheet.columns = [
    { header: 'Mã', key: 'code', width: 15 },
    { header: 'Tiêu Đề', key: 'title', width: 30 },
    { header: 'Kênh', key: 'channel_id', width: 15 },
    { header: 'Lịch Đăng', key: 'scheduled_at', width: 20 },
    { header: 'Thực Đăng', key: 'published_at', width: 20 },
    { header: 'Trạng Thái', key: 'status', width: 15 }
  ];

  contents.forEach(c => {
    sheet.addRow({
      code: c.code,
      title: c.title,
      channel_id: c.channel_id,
      scheduled_at: c.scheduled_at,
      published_at: c.published_at,
      status: c.status
    });
  });

  const rate = calculateOnTimePublishRate(contents);
  sheet.addRow([]);
  sheet.addRow(['Tỷ lệ đăng đúng hạn:', `${rate.toFixed(2)}%`]);

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
