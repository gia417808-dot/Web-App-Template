import ExcelJS from 'exceljs';

export async function generateKt05Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Lãi Gộp Theo Đơn');

  sheet.columns = [
    { header: 'Đơn Hàng ID', key: 'don_hang_id', width: 40 },
    { header: 'Trạng Thái', key: 'trang_thai', width: 20 },
    { header: 'Doanh Thu Thuần', key: 'doanh_thu_thuan', width: 20 },
    { header: 'Tổng Giá Vốn', key: 'tong_gia_von', width: 20 },
    { header: 'Lãi Gộp', key: 'lai_gop', width: 20 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      don_hang_id: r.don_hang_id,
      trang_thai: r.trang_thai,
      doanh_thu_thuan: r.doanh_thu_thuan || 0,
      tong_gia_von: r.tong_gia_von || 0,
      lai_gop: ''
    });

    const rowIndex = i + 2;
    row.getCell('lai_gop').value = {
      formula: `C${rowIndex}-D${rowIndex}`,
      date1904: false
    };
  });

  sheet.autoFilter = {
    from: 'A1',
    to: 'E1'
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as Buffer;
}
