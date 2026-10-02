import ExcelJS from 'exceljs';

export async function generateNs03Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Số Dư Phép');

  sheet.columns = [
    { header: 'Nhân Sự ID', key: 'nhan_su_id', width: 40 },
    { header: 'Năm', key: 'nam', width: 10 },
    { header: 'Đầu Kỳ', key: 'phep_dau_ky', width: 15 },
    { header: 'Phát Sinh', key: 'phep_phat_sinh', width: 15 },
    { header: 'Đã Duyệt', key: 'phep_da_duyet', width: 15 },
    { header: 'Còn Lại', key: 'phep_con_lai', width: 15 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      nhan_su_id: r.nhan_su_id,
      nam: r.nam,
      phep_dau_ky: r.phep_dau_ky,
      phep_phat_sinh: r.phep_phat_sinh,
      phep_da_duyet: r.phep_da_duyet,
      phep_con_lai: ''
    });

    const rowIndex = i + 2;
    row.getCell('phep_con_lai').value = {
      formula: `C${rowIndex}+D${rowIndex}-E${rowIndex}`,
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
