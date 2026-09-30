import { Pool } from 'pg';

export async function seedKt01(pool: Pool, orgId: string) {
  const { rows: accounts } = await pool.query(
    `INSERT INTO "TaiKhoanTien" (organization_id, code, name, opening_balance, opening_date) 
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [orgId, 'TK01', 'Tiền mặt', 1000000, '2026-01-01']
  );

  const accountId = accounts[0].id;

  for (let i = 1; i <= 30; i++) {
    const code = `GD${String(i).padStart(3, '0')}`;
    const amount = 100000 + (i * 10000);
    const direction = i % 2 === 0 ? 'out' : 'in';
    
    await pool.query(
      `INSERT INTO "GiaoDich" (organization_id, code, account_id, business_date, direction, amount_vnd, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [orgId, code, accountId, '2026-09-30', direction, amount, 'POSTED']
    );
  }
}
