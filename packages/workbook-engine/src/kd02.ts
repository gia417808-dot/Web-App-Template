import ExcelJS from 'exceljs';
import { calculateExpectedValue } from '@web-app-template/domain';

export async function generateKd02Workbook(opportunities: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Cơ Hội');

  sheet.columns = [
    { header: 'Mã', key: 'code', width: 15 },
    { header: 'Giai Đoạn', key: 'stage_id', width: 36 },
    { header: 'Giá Trị', key: 'value_vnd', width: 20 },
    { header: 'Xác Suất (%)', key: 'probability_pct', width: 15 },
    { header: 'Trạng Thái', key: 'status', width: 15 },
    { header: 'Giá Trị Kỳ Vọng', key: 'expected_value', width: 20 }
  ];

  opportunities.forEach(o => {
    const expectedValue = calculateExpectedValue(parseFloat(o.value_vnd), parseFloat(o.probability_pct), o.status);
    sheet.addRow({
      code: o.code,
      stage_id: o.stage_id,
      value_vnd: parseFloat(o.value_vnd),
      probability_pct: parseFloat(o.probability_pct),
      status: o.status,
      expected_value: expectedValue
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
