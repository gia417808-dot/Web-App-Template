const { generateSx03Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { ma_lenh: 'LSX-001', ten_cong_doan: 'Cắt Gỗ', trong_so: 1, ty_le_dat: 0.5, trang_thai: 'IN_PROGRESS' },
    { ma_lenh: 'LSX-001', ten_cong_doan: 'Lắp Ráp', trong_so: 2, ty_le_dat: 0, trang_thai: 'PENDING' }
  ];

  const buffer = await generateSx03Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/SX03/workbook/SX03_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('SX03 Excel generated at:', outPath);
}

main().catch(console.error);
