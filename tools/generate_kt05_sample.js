const { generateKt05Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { don_hang_id: 'DH-001', trang_thai: 'CALCULATED', doanh_thu_thuan: 1000, tong_gia_von: 800 },
    { don_hang_id: 'DH-002', trang_thai: 'MISSING_COST', doanh_thu_thuan: 2000, tong_gia_von: null }
  ];

  const buffer = await generateKt05Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/KT05/workbook/KT05_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('KT05 Excel generated at:', outPath);
}

main().catch(console.error);
