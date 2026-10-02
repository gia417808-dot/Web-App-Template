import ExcelJS from 'exceljs';

export async function generateSx05Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Giá Thành Lệnh');

  sheet.columns = [
    { header: 'Mã Lệnh', key: 'ma_lenh', width: 20 },
    { header: 'Lượng Đạt', key: 'luong_dat', width: 15 },
    { header: 'Tổng Chi Phí', key: 'tong_chi_phi', width: 20 },
    { header: 'Giá Thành ĐV', key: 'gia_thanh_don_vi', width: 20 },
    { header: 'Trạng Thái', key: 'trang_thai_gia_thanh', width: 15 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      ma_lenh: r.ma_lenh,
      luong_dat: r.luong_dat,
      tong_chi_phi: r.tong_chi_phi,
      gia_thanh_don_vi: '',
      trang_thai_gia_thanh: r.trang_thai_gia_thanh
    });

    const rowIndex = i + 2;
    row.getCell('gia_thanh_don_vi').value = {
      formula: `IF(B${rowIndex}>0, C${rowIndex}/B${rowIndex}, "")`,
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
