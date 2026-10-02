import ExcelJS from 'exceljs';

export async function generateNs01Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Hồ Sơ Nhân Sự');

  sheet.columns = [
    { header: 'Mã Nhân Viên', key: 'ma_nhan_vien', width: 20 },
    { header: 'Họ Tên', key: 'ho_ten', width: 30 },
    { header: 'Ngày Vào Làm', key: 'ngay_vao_lam', width: 20 },
    { header: 'Trạng Thái', key: 'trang_thai', width: 15 },
    { header: 'Thâm Niên (Ngày)', key: 'tham_nien_ngay', width: 20 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      ma_nhan_vien: r.ma_nhan_vien,
      ho_ten: r.ho_ten,
      ngay_vao_lam: new Date(r.ngay_vao_lam),
      trang_thai: r.trang_thai,
      tham_nien_ngay: ''
    });
    
    // Format date column
    row.getCell('ngay_vao_lam').numFmt = 'yyyy-mm-dd';

    const rowIndex = i + 2;
    row.getCell('tham_nien_ngay').value = {
      formula: `DAYS(TODAY(), C${rowIndex})`,
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
