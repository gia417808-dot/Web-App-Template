const path = require('path');
const fs = require('fs');

async function generate() {
    const { generateMk03Workbook } = await import('../packages/workbook-engine/dist/mk03.js');
    
    const leads = [
        { id: 'L1', nguon_id: 'S1', ten_lead: 'Khách 1', trang_thai: 'converted', ngay_tao: new Date(), tenant_id: 'org1' },
        { id: 'L2', nguon_id: 'S2', ten_lead: 'Khách 2', trang_thai: 'qualified', ngay_tao: new Date(), tenant_id: 'org1' }
    ];
    const sources = [
        { id: 'S1', ten_nguon: 'Facebook Ads', mo_ta: 'FB', tenant_id: 'org1' },
        { id: 'S2', ten_nguon: 'Google', mo_ta: 'GG', tenant_id: 'org1' }
    ];

    const buf = await generateMk03Workbook(leads, sources);
    const dest = path.join(__dirname, '../planning/company-kit/products/MK03/workbook');
    fs.mkdirSync(dest, { recursive: true });
    const filepath = path.join(dest, 'MK03_3.0.0-vi.xlsx');
    fs.writeFileSync(filepath, buf);
    console.log('MK03 Excel generated at:', filepath);
}

generate().catch(console.error);
