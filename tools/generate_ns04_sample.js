const { generateNs04Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { ky_luong: '2026-10', nhan_su_id: 'NS-001', luong_thoa_thuan: 20000000, tong_phu_cap: 2000000, tong_khau_tru: 500000, trang_thai: 'REVIEWED' }
  ];

  const buffer = await generateNs04Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/NS04/workbook/NS04_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('NS04 Excel generated at:', outPath);
}

main().catch(console.error);
