const { generateMk05Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    {
      ngay_bat_dau: '2026-02-01',
      ten_thu_nghiem: 'Thử nghiệm Banner Tết',
      trang_thai: 'RUNNING',
      ten_bien_the: 'Variant A (Màu đỏ)',
      luot_tiep_can: 12000,
      phan_hoi: 450
    },
    {
      ngay_bat_dau: '2026-02-01',
      ten_thu_nghiem: 'Thử nghiệm Banner Tết',
      trang_thai: 'RUNNING',
      ten_bien_the: 'Variant B (Màu vàng)',
      luot_tiep_can: 11500,
      phan_hoi: 600
    },
    {
      ngay_bat_dau: '2026-02-01',
      ten_thu_nghiem: 'Thử nghiệm Banner Tết',
      trang_thai: 'RUNNING',
      ten_bien_the: 'Variant C (Màu xanh)',
      luot_tiep_can: 0,
      phan_hoi: 0
    }
  ];

  const buffer = await generateMk05Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/MK05/workbook/MK05_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('MK05 Excel generated at:', outPath);
}

main().catch(console.error);
