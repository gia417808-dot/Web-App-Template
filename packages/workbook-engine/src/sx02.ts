import ExcelJS from 'exceljs';

export async function generateSx02Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Dự Trù Vật Tư');

  sheet.columns = [
    { header: 'Mã Sản Phẩm', key: 'san_pham_ma', width: 20 },
    { header: 'Mã Vật Tư', key: 'ma_vat_tu', width: 20 },
    { header: 'Tên Vật Tư', key: 'ten_vat_tu', width: 30 },
    { header: 'ĐVT', key: 'dvt', width: 10 },
    { header: 'Định Mức', key: 'so_luong_dinh_muc', width: 15 },
    { header: 'Hao Hụt (%)', key: 'ty_le_hao_hut', width: 15 },
    { header: 'Kế Hoạch', key: 'luong_ke_hoach', width: 15 },
    { header: 'Lượng Cần', key: 'luong_can', width: 15 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      san_pham_ma: r.san_pham_ma,
      ma_vat_tu: r.ma_vat_tu,
      ten_vat_tu: r.ten_vat_tu,
      dvt: r.dvt,
      so_luong_dinh_muc: r.so_luong_dinh_muc,
      ty_le_hao_hut: r.ty_le_hao_hut,
      luong_ke_hoach: 100, // mock default plan
      luong_can: ''
    });

    const rowIndex = i + 2;
    row.getCell('luong_can').value = {
      formula: `E${rowIndex}*G${rowIndex}*(1+F${rowIndex}/100)`,
      date1904: false
    };
  });

  sheet.autoFilter = {
    from: 'A1',
    to: 'H1'
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as Buffer;
}
