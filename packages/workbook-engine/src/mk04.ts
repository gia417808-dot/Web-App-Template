import ExcelJS from 'exceljs';

export async function generateMk04Workbook(chiSoList: any[] = []) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Hiệu Quả Kênh MK04');

  sheet.columns = [
    { header: 'Kênh/Nguồn', key: 'channel_name', width: 25 },
    { header: 'Kỳ Báo Cáo', key: 'period', width: 25 },
    { header: 'Tổng Chi Phí', key: 'total_cost', width: 20, style: { numFmt: '#,##0' } },
    { header: 'Số Lead Hợp Lệ', key: 'valid_leads', width: 15 },
    { header: 'CPL (VND)', key: 'cpl_vnd', width: 20, style: { numFmt: '#,##0' } },
    { header: 'Trạng Thái', key: 'status', width: 15 }
  ];

  const tableRows = chiSoList.map(item => [
    item.channel_name || item.channel_id || '',
    `${item.period_start} -> ${item.period_end}`,
    Number(item.total_cost || 0),
    Number(item.valid_leads || 0),
    0, // Will be replaced by formula
    item.status || 'DRAFT'
  ]);

  sheet.addTable({
    name: 'MK04_ChiSoTable',
    ref: 'A1',
    headerRow: true,
    totalsRow: true,
    style: {
      theme: 'TableStyleMedium2',
      showRowStripes: true,
    },
    columns: [
      { name: 'Kênh/Nguồn', totalsRowLabel: 'Tổng cộng:' },
      { name: 'K Kỳ Báo Cáo' },
      { name: 'Tổng Chi Phí', totalsRowFunction: 'sum' },
      { name: 'Số Lead Hợp Lệ', totalsRowFunction: 'sum' },
      { name: 'CPL (VND)' },
      { name: 'Trạng Thái' }
    ],
    rows: tableRows.length > 0 ? tableRows : [['Mẫu kênh', '2026-01-01 -> 2026-01-31', 10000000, 100, 0, 'DRAFT']]
  });

  const rowCount = tableRows.length > 0 ? tableRows.length : 1;
  for (let i = 2; i <= rowCount + 1; i++) {
    const costCell = sheet.getCell(`C${i}`);
    const leadCell = sheet.getCell(`D${i}`);
    const cplCell = sheet.getCell(`E${i}`);

    cplCell.value = {
      formula: `IF(${leadCell.address}>0, ${costCell.address}/${leadCell.address}, "")`,
      result: Number(costCell.value) / (Number(leadCell.value) || 1)
    };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
