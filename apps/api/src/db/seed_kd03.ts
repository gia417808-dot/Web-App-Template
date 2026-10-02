import { Pool } from 'pg';

export async function seedKd03(pool: Pool, orgId: string) {
  // Get an owner
  const { rows: users } = await pool.query(`SELECT id FROM "NguoiDung" WHERE organization_id = $1 LIMIT 1`, [orgId]);
  if (users.length === 0) return;
  const ownerId = users[0].id;

  // Create targets for 12 months
  const currentYear = new Date().getFullYear();
  for (let month = 1; month <= 12; month++) {
    const periodStart = `${currentYear}-${String(month).padStart(2, '0')}-01`;
    // simplistic end of month calculation (always 28 for safety in seed)
    const periodEnd = `${currentYear}-${String(month).padStart(2, '0')}-28`;
    const target = 1000000000; // 1 billion VND
    const status = month <= new Date().getMonth() + 1 ? 'ACTIVE' : 'DRAFT';
    
    await pool.query(
      `INSERT INTO "MucTieu" (organization_id, owner_id, period_start, period_end, target_vnd, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [orgId, ownerId, periodStart, periodEnd, target, status]
    );
  }
}
