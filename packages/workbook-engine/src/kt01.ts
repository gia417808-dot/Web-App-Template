import ExcelJS from 'exceljs';

export async function generateKt01Workbook(transactions: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Giao Dịch');

  sheet.columns = [
    { header: 'ID', key: 'id', width: 36 },
    { header: 'Mã GD', key: 'code', width: 15 },
    { header: 'Loại', key: 'direction', width: 10 },
    { header: 'Số Tiền', key: 'amount_vnd', width: 20 },
    { header: 'Ngày', key: 'business_date', width: 15 },
    { header: 'Trạng Thái', key: 'status', width: 15 }
  ];

  transactions.forEach(t => {
    sheet.addRow({
      id: t.id,
      code: t.code,
      direction: t.direction,
      amount_vnd: t.amount_vnd,
      business_date: t.business_date,
      status: t.status
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
