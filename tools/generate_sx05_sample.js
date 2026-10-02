const { generateSx05Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { ma_lenh: 'LSX-001', luong_dat: 50, tong_chi_phi: 7000000, trang_thai_gia_thanh: 'CALCULATED' },
    { ma_lenh: 'LSX-002', luong_dat: 0, tong_chi_phi: 1000000, trang_thai_gia_thanh: 'DRAFT' }
  ];

  const buffer = await generateSx05Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/SX05/workbook/SX05_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('SX05 Excel generated at:', outPath);
}

main().catch(console.error);
