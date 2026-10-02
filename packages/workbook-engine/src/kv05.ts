import ExcelJS from 'exceljs';

export async function generateKv05Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Cảnh Báo Bổ Sung');

  sheet.columns = [
    { header: 'ID', key: 'id', width: 20 },
    { header: 'Trạng Thái', key: 'trang_thai', width: 20 },
    { header: 'Tồn Mục Tiêu', key: 'ton_muc_tieu', width: 15 },
    { header: 'Tồn Khả Dụng', key: 'ton_kha_dung', width: 15 },
    { header: 'Lượng Gợi Ý', key: 'luong_goi_y', width: 15 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      id: r.id,
      trang_thai: r.trang_thai,
      ton_muc_tieu: r.ton_muc_tieu || 0,
      ton_kha_dung: r.ton_kha_dung || 0,
      luong_goi_y: ''
    });

    const rowIndex = i + 2;
    row.getCell('luong_goi_y').value = {
      formula: `MAX(0, C${rowIndex}-D${rowIndex})`,
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
