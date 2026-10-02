import ExcelJS from 'exceljs';

export async function generateNs02Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Chấm Công');

  sheet.columns = [
    { header: 'Nhân Sự ID', key: 'nhan_su_id', width: 40 },
    { header: 'Ngày', key: 'ngay_cham_cong', width: 15 },
    { header: 'Giờ Vào', key: 'gio_vao_thuc_te', width: 15 },
    { header: 'Giờ Ra', key: 'gio_ra_thuc_te', width: 15 },
    { header: 'Trạng Thái', key: 'trang_thai', width: 15 },
    { header: 'Giờ Nghỉ', key: 'tru_gio_nghi', width: 10 },
    { header: 'Tổng Giờ', key: 'tong_gio_lam', width: 15 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      nhan_su_id: r.nhan_su_id,
      ngay_cham_cong: new Date(r.ngay_cham_cong),
      gio_vao_thuc_te: r.gio_vao_thuc_te,
      gio_ra_thuc_te: r.gio_ra_thuc_te,
      trang_thai: r.trang_thai,
      tru_gio_nghi: r.tru_gio_nghi || 1, // Default mock break hours
      tong_gio_lam: ''
    });

    row.getCell('ngay_cham_cong').numFmt = 'yyyy-mm-dd';

    const rowIndex = i + 2;
    // Excel time is a fraction of a day, so (ra - vao) is the fraction.
    // If ra < vao, it passed midnight, so we can use MOD(ra-vao, 1).
    // Multiply by 24 to get hours, then subtract break.
    row.getCell('tong_gio_lam').value = {
      formula: `(MOD(D${rowIndex}-C${rowIndex}, 1)*24) - F${rowIndex}`,
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
