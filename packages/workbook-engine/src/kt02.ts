import ExcelJS from 'exceljs';

export async function generateKt02Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Công Nợ Phải Thu');

  sheet.columns = [
    { header: 'Mã Phải Thu', key: 'ma_phai_thu', width: 20 },
    { header: 'Trạng Thái', key: 'trang_thai', width: 20 },
    { header: 'Số Gốc', key: 'so_goc', width: 15 },
    { header: 'Đã Thanh Toán', key: 'da_thanh_toan', width: 15 },
    { header: 'Còn Lại', key: 'con_lai', width: 15 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      ma_phai_thu: r.ma_phai_thu,
      trang_thai: r.trang_thai,
      so_goc: r.so_goc || 0,
      da_thanh_toan: r.da_thanh_toan || 0,
      con_lai: ''
    });

    const rowIndex = i + 2;
    row.getCell('con_lai').value = {
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
