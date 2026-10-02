import ExcelJS from 'exceljs';

export async function generateKt04Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Ngân Sách Thực Chi');

  sheet.columns = [
    { header: 'Kỳ', key: 'ky_ngan_sach', width: 15 },
    { header: 'Mã Ngân Sách', key: 'ma_ngan_sach', width: 20 },
    { header: 'Trạng Thái', key: 'trang_thai', width: 15 },
    { header: 'Dự Toán', key: 'du_toan', width: 15 },
    { header: 'Thực Chi', key: 'thuc_chi', width: 15 },
    { header: 'Chênh Lệch', key: 'chenh_lech', width: 15 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      ky_ngan_sach: r.ky_ngan_sach,
      ma_ngan_sach: r.ma_ngan_sach,
      trang_thai: r.trang_thai,
      du_toan: r.du_toan || 0,
      thuc_chi: r.thuc_chi || 0,
      chenh_lech: ''
    });

    const rowIndex = i + 2;
    row.getCell('chenh_lech').value = {
      formula: `D${rowIndex}-E${rowIndex}`,
      date1904: false
    };
  });

  sheet.autoFilter = {
    from: 'A1',
    to: 'F1'
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as Buffer;
}
