import { Client } from 'pg';

export async function seedKd05(db: Client) {
    const orgRes = await db.query('SELECT id FROM "ToChuc" LIMIT 1');
    if (orgRes.rows.length === 0) return;
    const orgId = orgRes.rows[0].id;

    const customers = await db.query('SELECT id FROM "KhachHang" WHERE organization_id = $1 LIMIT 10', [orgId]);
    if (customers.rows.length === 0) return;

    for (let i = 0; i < customers.rows.length; i++) {
        const cId = customers.rows[i].id;
        
        if (i < 3) {
            continue;
        } else if (i < 6) {
            await db.query(`
                INSERT INTO "TuongTac" (organization_id, customer_id, interaction_date, type, status, notes)
                VALUES ($1, $2, NOW() - interval '10 days', 'Call', 'COMPLETED', 'Đã gọi')
            `, [orgId, cId]);
        } else if (i < 8) {
            await db.query(`
                INSERT INTO "TuongTac" (organization_id, customer_id, interaction_date, type, status, notes)
                VALUES ($1, $2, NOW() + interval '2 days', 'Email', 'PLANNED', 'Lên lịch email')
            `, [orgId, cId]);
        } else {
            await db.query(`
                INSERT INTO "TuongTac" (organization_id, customer_id, interaction_date, type, status, notes)
                VALUES ($1, $2, NOW() - interval '60 days', 'Meeting', 'COMPLETED', 'Gặp mặt')
            `, [orgId, cId]);
        }
    }
}