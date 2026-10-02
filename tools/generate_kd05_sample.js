const { generateKd05Workbook } = require('../packages/workbook-engine/dist/kd05.js');
const fs = require('fs');

async function run() {
    const data = [
        {
            code: 'KH001',
            name: 'Nguyễn Văn A',
            last_interaction: { interaction_date: new Date(Date.now() - 10 * 24 * 3600 * 1000) },
            days_since_last_interaction: 10
        },
        {
            code: 'KH002',
            name: 'Công ty ABC',
            last_interaction: null,
            days_since_last_interaction: 'NO_CONTACT'
        }
    ];

    const buffer = await generateKd05Workbook(data);
    fs.mkdirSync('../planning/company-kit/products/KD05/workbook', { recursive: true });
    fs.writeFileSync('../planning/company-kit/products/KD05/workbook/KD05_3.0.0-vi.xlsx', buffer);
    console.log('Excel KD05 generated at planning/company-kit/products/KD05/workbook/KD05_3.0.0-vi.xlsx');
}

run().catch(console.error);