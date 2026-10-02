const { generateNs01Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { ma_nhan_vien: 'NV-001', ho_ten: 'Nguyễn A', ngay_vao_lam: '2024-01-01', trang_thai: 'ACTIVE' },
    { ma_nhan_vien: 'NV-002', ho_ten: 'Trần B', ngay_vao_lam: '2025-06-01', trang_thai: 'INACTIVE' }
  ];

  const buffer = await generateNs01Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/NS01/workbook/NS01_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('NS01 Excel generated at:', outPath);
}

main().catch(console.error);
