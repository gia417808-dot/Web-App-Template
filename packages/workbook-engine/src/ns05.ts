import ExcelJS from 'exceljs';

export async function generateNs05Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Tuyển Dụng');

  sheet.columns = [
    { header: 'Họ Tên', key: 'ho_ten', width: 25 },
    { header: 'Vị Trí', key: 'vi_tri_ung_tuyen', width: 20 },
    { header: 'Ngày Mở', key: 'ngay_mo_vi_tri', width: 15 },
    { header: 'Ngày Nhận Việc', key: 'ngay_nhan_viec', width: 15 },
    { header: 'Thời Gian Tuyển', key: 'thoi_gian_tuyen', width: 15 },
    { header: 'Trạng Thái', key: 'trang_thai', width: 15 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      ho_ten: r.ho_ten,
      vi_tri_ung_tuyen: r.vi_tri_ung_tuyen,
      ngay_mo_vi_tri: r.ngay_mo_vi_tri ? new Date(r.ngay_mo_vi_tri) : null,
      ngay_nhan_viec: r.ngay_nhan_viec ? new Date(r.ngay_nhan_viec) : null,
      thoi_gian_tuyen: '',
      trang_thai: r.trang_thai
    });

    if (row.getCell('ngay_mo_vi_tri').value) row.getCell('ngay_mo_vi_tri').numFmt = 'yyyy-mm-dd';
    if (row.getCell('ngay_nhan_viec').value) row.getCell('ngay_nhan_viec').numFmt = 'yyyy-mm-dd';

    const rowIndex = i + 2;
    row.getCell('thoi_gian_tuyen').value = {
      formula: `IF(ISBLANK(D${rowIndex}), "", D${rowIndex}-C${rowIndex})`,
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
