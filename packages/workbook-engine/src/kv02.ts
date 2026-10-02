import ExcelJS from 'exceljs';

export async function generateKv02Workbook(vouchers: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Phiếu Kho');

  sheet.columns = [
    { header: 'ID', key: 'id', width: 36 },
    { header: 'Mã', key: 'code', width: 15 },
    { header: 'Kho', key: 'warehouse_id', width: 36 },
    { header: 'Loại', key: 'movement_type', width: 10 },
    { header: 'Ngày', key: 'business_date', width: 15 },
    { header: 'Trạng Thái', key: 'status', width: 15 }
  ];

  vouchers.forEach(v => {
    sheet.addRow({
      id: v.id,
      code: v.code,
      warehouse_id: v.warehouse_id,
      movement_type: v.movement_type,
      business_date: v.business_date,
      status: v.status
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
