const { generateKt04Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { ky_ngan_sach: '2026-01', ma_ngan_sach: 'NS-001', trang_thai: 'APPROVED', du_toan: 50000, thuc_chi: 20000 },
    { ky_ngan_sach: '2026-01', ma_ngan_sach: 'NS-002', trang_thai: 'LOCKED', du_toan: 10000, thuc_chi: 12000 }
  ];

  const buffer = await generateKt04Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/KT04/workbook/KT04_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('KT04 Excel generated at:', outPath);
}

main().catch(console.error);
