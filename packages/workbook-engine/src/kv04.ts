import ExcelJS from 'exceljs';

export async function generateKv04Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Kiểm Kê Kho');

  sheet.columns = [
    { header: 'Mã Kiểm Kê', key: 'ma_kiem_ke', width: 20 },
    { header: 'Trạng Thái', key: 'trang_thai', width: 20 },
    { header: 'Tồn Sổ', key: 'ton_so', width: 15 },
    { header: 'Đếm Thực Tế', key: 'dem_thuc_te', width: 15 },
    { header: 'Chênh Lệch', key: 'lech', width: 15 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      ma_kiem_ke: r.ma_kiem_ke,
      trang_thai: r.trang_thai,
      ton_so: r.ton_so || 0,
      dem_thuc_te: r.dem_thuc_te || 0,
      lech: ''
    });

    const rowIndex = i + 2;
    row.getCell('lech').value = {
      formula: `D${rowIndex}-C${rowIndex}`,
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
