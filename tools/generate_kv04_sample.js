const { generateKv04Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { ma_kiem_ke: 'KK-001', trang_thai: 'POSTED', ton_so: 100, dem_thuc_te: 95 },
    { ma_kiem_ke: 'KK-001', trang_thai: 'POSTED', ton_so: 50, dem_thuc_te: 55 },
    { ma_kiem_ke: 'KK-002', trang_thai: 'COUNTING', ton_so: 200, dem_thuc_te: 0 }
  ];

  const buffer = await generateKv04Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/KV04/workbook/KV04_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('KV04 Excel generated at:', outPath);
}

main().catch(console.error);
