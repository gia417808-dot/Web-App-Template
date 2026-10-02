const { generateNs02Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { nhan_su_id: 'NS-001', ngay_cham_cong: '2026-10-02', gio_vao_thuc_te: '08:00', gio_ra_thuc_te: '17:00', trang_thai: 'APPROVED', tru_gio_nghi: 1 },
    { nhan_su_id: 'NS-002', ngay_cham_cong: '2026-10-02', gio_vao_thuc_te: '22:00', gio_ra_thuc_te: '06:00', trang_thai: 'SUBMITTED', tru_gio_nghi: 1 }
  ];

  const buffer = await generateNs02Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/NS02/workbook/NS02_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('NS02 Excel generated at:', outPath);
}

main().catch(console.error);
