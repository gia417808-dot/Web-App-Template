const { generateMk02Workbook } = require('../packages/workbook-engine/dist/mk02.js');
const fs = require('fs');

async function run() {
  const data = [
    {
      code: 'CD01',
      name: 'Chiến dịch Tết 2026',
      budget_vnd: 50000000,
      confirmed_cost: 30000000
    },
    {
      code: 'CD02',
      name: 'Mùa Hè Sôi Động',
      budget_vnd: 20000000,
      confirmed_cost: 25000000
    },
    {
      code: 'CD03',
      name: 'Back to School',
      budget_vnd: 10000000,
      confirmed_cost: 5000000
    }
  ];

  const buffer = await generateMk02Workbook(data);
  fs.mkdirSync('../planning/company-kit/products/MK02/workbook', { recursive: true });
  const outPath = '../planning/company-kit/products/MK02/workbook/MK02_3.0.0-vi.xlsx';
  fs.writeFileSync(outPath, buffer);
  console.log('Generated Excel MK02 successfully at:', outPath);
}

run().catch(console.error);
