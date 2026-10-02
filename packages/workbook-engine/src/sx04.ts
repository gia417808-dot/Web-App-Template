import ExcelJS from 'exceljs';

export async function generateSx04Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Chất Lượng');

  sheet.columns = [
    { header: 'Lệnh SX', key: 'ma_lenh', width: 20 },
    { header: 'Số Lượng Kiểm', key: 'so_luong_kiem', width: 15 },
    { header: 'Số Lượng Lỗi', key: 'so_luong_loi', width: 15 },
    { header: 'Tỷ Lệ Lỗi', key: 'ty_le_loi', width: 15 },
    { header: 'Trạng Thái', key: 'trang_thai', width: 15 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      ma_lenh: r.ma_lenh,
      so_luong_kiem: r.so_luong_kiem,
      so_luong_loi: r.so_luong_loi,
      ty_le_loi: '',
      trang_thai: r.trang_thai
    });

    const rowIndex = i + 2;
    const tyLeCell = row.getCell('ty_le_loi');
    tyLeCell.value = {
      formula: `IF(B${rowIndex}>0, C${rowIndex}/B${rowIndex}, "")`,
      date1904: false
    };
    tyLeCell.numFmt = '0.00%';
  });

  sheet.autoFilter = {
    from: 'A1',
    to: 'E1'
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as Buffer;
}
