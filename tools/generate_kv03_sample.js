const { generateKv03Workbook } = require('./packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { ma_don: 'PO-001', trang_thai: 'ORDERED', luong_dat: 100, luong_nhan_hop_le: 0 },
    { ma_don: 'PO-002', trang_thai: 'PARTIALLY_RECEIVED', luong_dat: 200, luong_nhan_hop_le: 150 },
    { ma_don: 'PO-003', trang_thai: 'RECEIVED', luong_dat: 50, luong_nhan_hop_le: 60 }
  ];

  const buffer = await generateKv03Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/KV03/workbook/KV03_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('KV03 Excel generated at:', outPath);
}

main().catch(console.error);
