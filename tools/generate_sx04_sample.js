const { generateSx04Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { ma_lenh: 'LSX-001', so_luong_kiem: 100, so_luong_loi: 5, trang_thai: 'INSPECTED' },
    { ma_lenh: 'LSX-001', so_luong_kiem: 200, so_luong_loi: 2, trang_thai: 'APPROVED' }
  ];

  const buffer = await generateSx04Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/SX04/workbook/SX04_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('SX04 Excel generated at:', outPath);
}

main().catch(console.error);
