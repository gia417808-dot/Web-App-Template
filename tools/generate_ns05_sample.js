const { generateNs05Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { ho_ten: 'Trần Văn Tuyển', vi_tri_ung_tuyen: 'Dev', ngay_mo_vi_tri: '2026-09-01', ngay_nhan_viec: null, trang_thai: 'INTERVIEW' },
    { ho_ten: 'Lê Thị Lương', vi_tri_ung_tuyen: 'HR', ngay_mo_vi_tri: '2026-08-01', ngay_nhan_viec: '2026-08-20', trang_thai: 'HIRED' }
  ];

  const buffer = await generateNs05Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/NS05/workbook/NS05_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('NS05 Excel generated at:', outPath);
}

main().catch(console.error);
