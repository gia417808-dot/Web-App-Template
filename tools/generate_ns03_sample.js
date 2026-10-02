const { generateNs03Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { nhan_su_id: 'NS-001', nam: 2026, phep_dau_ky: 0, phep_phat_sinh: 12, phep_da_duyet: 2 }
  ];

  const buffer = await generateNs03Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/NS03/workbook/NS03_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('NS03 Excel generated at:', outPath);
}

main().catch(console.error);
