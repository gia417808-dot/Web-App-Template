import ExcelJS from 'exceljs';

export async function generateNs04Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Lương Quản Trị');

  sheet.columns = [
    { header: 'Kỳ Lương', key: 'ky_luong', width: 15 },
    { header: 'Nhân Sự ID', key: 'nhan_su_id', width: 40 },
    { header: 'Lương Thỏa Thuận', key: 'luong_thoa_thuan', width: 20 },
    { header: 'Tổng Phụ Cấp', key: 'tong_phu_cap', width: 20 },
    { header: 'Tổng Khấu Trừ', key: 'tong_khau_tru', width: 20 },
    { header: 'Thực Nhận', key: 'thuc_nhan', width: 20 },
    { header: 'Trạng Thái', key: 'trang_thai', width: 15 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      ky_luong: r.ky_luong,
      nhan_su_id: r.nhan_su_id,
      luong_thoa_thuan: r.luong_thoa_thuan || 0,
      tong_phu_cap: r.tong_phu_cap || 0,
      tong_khau_tru: r.tong_khau_tru || 0,
      thuc_nhan: '',
      trang_thai: r.trang_thai
    });

    const rowIndex = i + 2;
    row.getCell('thuc_nhan').value = {
      formula: `MAX(0, C${rowIndex}+D${rowIndex}-E${rowIndex})`,
      date1904: false
    };
  });

  sheet.autoFilter = {
    from: 'A1',
    to: 'G1'
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as Buffer;
}
