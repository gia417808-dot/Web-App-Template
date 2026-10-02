const { generateSx02Workbook } = require('../packages/workbook-engine/dist/index.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const records = [
    { san_pham_ma: 'SP-BAN-001', ma_vat_tu: 'VT-GO-001', ten_vat_tu: 'Gỗ Sồi', dvt: 'Khối', so_luong_dinh_muc: 0.5, ty_le_hao_hut: 10 }
  ];

  const buffer = await generateSx02Workbook(records);
  const outPath = path.join(__dirname, '../planning/company-kit/products/SX02/workbook/SX02_3.0.0-vi.xlsx');
  
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  
  console.log('SX02 Excel generated at:', outPath);
}

main().catch(console.error);
