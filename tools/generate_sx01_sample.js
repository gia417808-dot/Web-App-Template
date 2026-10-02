const { generateSx01Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { ma_lenh: 'LSX-001', san_pham_ma: 'SP-BAN-001', luong_ke_hoach: 100, luong_dat: 50, luong_loi: 2, trang_thai: 'IN_PROGRESS' }
  ];

  const buffer = await generateSx01Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/SX01/workbook/SX01_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('SX01 Excel generated at:', outPath);
}

main().catch(console.error);
