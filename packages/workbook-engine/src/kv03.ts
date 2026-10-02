import ExcelJS from 'exceljs';

export async function generateKv03Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Đơn Mua Hàng');

  sheet.columns = [
    { header: 'Mã Đơn', key: 'ma_don', width: 20 },
    { header: 'Trạng Thái', key: 'trang_thai', width: 20 },
    { header: 'Lượng Đặt', key: 'luong_dat', width: 15 },
    { header: 'Lượng Nhận Hợp Lệ', key: 'luong_nhan_hop_le', width: 20 },
    { header: 'Chênh Lệch', key: 'chenh_lech_nhan', width: 15 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      ma_don: r.ma_don,
      trang_thai: r.trang_thai,
      luong_dat: r.luong_dat || 0,
      luong_nhan_hop_le: r.luong_nhan_hop_le || 0,
      chenh_lech_nhan: ''
    });

    const rowIndex = i + 2;
    row.getCell('chenh_lech_nhan').value = {
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
