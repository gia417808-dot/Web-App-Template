const { generateKt03Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { ma_phai_tra: 'PT-001', trang_thai: 'OPEN', so_goc: 1000, da_thanh_toan: 0 },
    { ma_phai_tra: 'PT-002', trang_thai: 'PARTIALLY_PAID', so_goc: 2000, da_thanh_toan: 500 },
    { ma_phai_tra: 'PT-003', trang_thai: 'SETTLED', so_goc: 3000, da_thanh_toan: 3000 },
    { ma_phai_tra: 'PT-004', trang_thai: 'OVERPAID', so_goc: 1000, da_thanh_toan: 1200 }
  ];

  const buffer = await generateKt03Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/KT03/workbook/KT03_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('KT03 Excel generated at:', outPath);
}

main().catch(console.error);
