import ExcelJS from 'exceljs';

export async function generateSx03Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Tiến Độ Công Đoạn');

  sheet.columns = [
    { header: 'Lệnh SX', key: 'ma_lenh', width: 20 },
    { header: 'Tên Công Đoạn', key: 'ten_cong_doan', width: 30 },
    { header: 'Trọng Số', key: 'trong_so', width: 15 },
    { header: 'Tỷ Lệ Đạt', key: 'ty_le_dat', width: 15 },
    { header: 'Trạng Thái', key: 'trang_thai', width: 15 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      ma_lenh: r.ma_lenh,
      ten_cong_doan: r.ten_cong_doan,
      trong_so: r.trong_so,
      ty_le_dat: r.ty_le_dat,
      trang_thai: r.trang_thai
    });

    row.getCell('ty_le_dat').numFmt = '0.00%';
  });

  sheet.autoFilter = {
    from: 'A1',
    to: 'E1'
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as Buffer;
}
