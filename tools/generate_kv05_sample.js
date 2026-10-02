const { generateKv05Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { id: 'CB-001', trang_thai: 'OPEN', ton_muc_tieu: 200, ton_kha_dung: 50 },
    { id: 'CB-002', trang_thai: 'ACKNOWLEDGED', ton_muc_tieu: 150, ton_kha_dung: 160 },
    { id: 'CB-003', trang_thai: 'RESOLVED', ton_muc_tieu: 300, ton_kha_dung: 280 }
  ];

  const buffer = await generateKv05Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/KV05/workbook/KV05_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('KV05 Excel generated at:', outPath);
}

main().catch(console.error);
