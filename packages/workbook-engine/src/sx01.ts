import ExcelJS from 'exceljs';

export async function generateSx01Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Lệnh Sản Xuất');

  sheet.columns = [
    { header: 'Mã Lệnh', key: 'ma_lenh', width: 20 },
    { header: 'Mã Sản Phẩm', key: 'san_pham_ma', width: 20 },
    { header: 'Kế Hoạch', key: 'luong_ke_hoach', width: 15 },
    { header: 'Đạt', key: 'luong_dat', width: 15 },
    { header: 'Lỗi', key: 'luong_loi', width: 15 },
    { header: 'Tỷ Lệ', key: 'ty_le_hoan_thanh', width: 15 },
    { header: 'Trạng Thái', key: 'trang_thai', width: 15 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      ma_lenh: r.ma_lenh,
      san_pham_ma: r.san_pham_ma,
      luong_ke_hoach: r.luong_ke_hoach,
      luong_dat: r.luong_dat,
      luong_loi: r.luong_loi,
      ty_le_hoan_thanh: '',
      trang_thai: r.trang_thai
    });

    const rowIndex = i + 2;
    const tyLeCell = row.getCell('ty_le_hoan_thanh');
    tyLeCell.value = {
      formula: `IF(C${rowIndex}>0, D${rowIndex}/C${rowIndex}, 0)`,
      date1904: false
    };
    tyLeCell.numFmt = '0.00%';
  });

  sheet.autoFilter = {
    from: 'A1',
    to: 'G1'
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as Buffer;
}
