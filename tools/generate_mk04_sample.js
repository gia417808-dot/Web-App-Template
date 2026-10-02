const { generateMk04Workbook } = require('../packages/workbook-engine/dist/mk04.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const buffer = await generateMk04Workbook([
    {
      channel_name: 'Facebook Ads',
      period_start: '2026-01-01',
      period_end: '2026-01-31',
      total_cost: 15000000,
      valid_leads: 150,
      status: 'VERIFIED'
    },
    {
      channel_name: 'Google Search',
      period_start: '2026-01-01',
      period_end: '2026-01-31',
      total_cost: 10000000,
      valid_leads: 80,
      status: 'LOCKED'
    },
    {
      channel_name: 'Zalo',
      period_start: '2026-01-01',
      period_end: '2026-01-31',
      total_cost: 5000000,
      valid_leads: 0,
      status: 'DRAFT'
    }
  ]);

  const outDir = path.join(__dirname, '../planning/company-kit/products/MK04/workbook');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'MK04_3.0.0-vi.xlsx');
  fs.writeFileSync(outFile, Buffer.from(buffer));
  console.log('MK04 Excel generated at:', outFile);
}

main().catch(console.error);
