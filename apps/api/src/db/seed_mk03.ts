import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const dbClient = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
    await dbClient.connect();
    const tenantId = 'org1';
    console.log('Seeding MK03 data...');

    const srcId1 = randomUUID();
    const srcId2 = randomUUID();

    await dbClient.query(`
        INSERT INTO "NguonLead" (id, ten_nguon, mo_ta, organization_id)
        VALUES 
            ($1, 'Facebook Ads', 'Quảng cáo FB', $3),
            ($2, 'Google Search', 'Tìm kiếm tự nhiên', $3)
        ON CONFLICT (id) DO NOTHING;
    `, [srcId1, srcId2, tenantId]);

    await dbClient.query(`
        INSERT INTO "Lead" (id, nguon_id, ten_lead, so_dien_thoai, trang_thai, ngay_tao, organization_id)
        VALUES
            ($1, $4, 'Nguyễn Văn Facebook', '0901234567', 'new', NOW() - INTERVAL '5 days', $6),
            ($2, $5, 'Trần Thị Google', '0912345678', 'qualified', NOW() - INTERVAL '3 days', $6),
            ($3, $4, 'Lê Văn Spam', '0987654321', 'invalid', NOW() - INTERVAL '2 days', $6)
    `, [randomUUID(), randomUUID(), randomUUID(), srcId1, srcId2, tenantId]);

    console.log('Done MK03 seed.');
    await dbClient.end();
}

run().catch(console.error);
