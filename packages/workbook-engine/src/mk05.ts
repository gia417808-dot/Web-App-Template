import ExcelJS from 'exceljs';

export async function generateMk05Workbook(records: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Web App Template';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Thử Nghiệm Nội Dung');

  sheet.columns = [
    { header: 'Kỳ Báo Cáo', key: 'ky_bao_cao', width: 25 },
    { header: 'Tên Thử Nghiệm', key: 'ten_thu_nghiem', width: 30 },
    { header: 'Trạng Thái', key: 'trang_thai', width: 15 },
    { header: 'Tên Biến Thể', key: 'ten_bien_the', width: 25 },
    { header: 'Lượt Tiếp Cận', key: 'luot_tiep_can', width: 15 },
    { header: 'Phản Hồi', key: 'phan_hoi', width: 15 },
    { header: 'Tỷ Lệ Phản Hồi', key: 'ty_le_phan_hoi', width: 20 },
  ];

  records.forEach((r, i) => {
    const row = sheet.addRow({
      ky_bao_cao: r.ngay_bat_dau ? `${r.ngay_bat_dau}` : '',
      ten_thu_nghiem: r.ten_thu_nghiem,
      trang_thai: r.trang_thai,
      ten_bien_the: r.ten_bien_the,
      luot_tiep_can: r.luot_tiep_can || 0,
      phan_hoi: r.phan_hoi || 0,
      ty_le_phan_hoi: '' 
    });

    // Native Excel formula for CPL / Response Rate
    const rowIndex = i + 2;
    row.getCell('ty_le_phan_hoi').value = {
      formula: `IF(E${rowIndex}>0, F${rowIndex}/E${rowIndex}, "")`,
      date1904: false
    };
    row.getCell('ty_le_phan_hoi').numFmt = '0.00%';
  });

  sheet.autoFilter = {
    from: 'A1',
    to: 'G1'
  };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as Buffer;
}
