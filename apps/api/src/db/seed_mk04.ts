import { Pool } from 'pg';
import crypto from 'crypto';

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/webapp'
  });

  try {
    console.log('Seeding MK04...');
    await pool.query('BEGIN');

    // Create a Kenh/Nguon
    const channelId = 'N-FB-' + Date.now();
    await pool.query(`
      INSERT INTO "NguonLead" (id, ten_nguon, do_tin_cay, trang_thai)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING
    `, [channelId, 'Facebook Ads (MK04 Seed)', 1, 'active']);

    // Create a Campaign and ChiPhi for MK02
    const campaignId = crypto.randomUUID();
    await pool.query(`
      INSERT INTO "ChienDich" (id, organization_id, code, name, start_date, end_date, budget_vnd, status)
      VALUES ($1, 'org1', $2, 'Campaign MK04', '2026-01-01', '2026-01-31', 50000000, 'ACTIVE')
    `, [campaignId, 'C-MK04-' + Date.now()]);

    // Insert ChiPhi. Wait, in MK02, ChiPhi references Kenh(id). But NguonLead is TEXT. ChiPhi channel_id is UUID.
    // Let's insert a dummy Kenh for MK02, then use it as channel_id. 
    // This script might fail if the schema is strict. We will just use the API to aggregate instead of strict seeding if complex.
    // Or we just seed ChiSoKenh directly for MK04.

    const id1 = crypto.randomUUID();
    await pool.query(`
      INSERT INTO "ChiSoKenh" (id, organization_id, channel_id, period_start, period_end, total_cost, valid_leads, cpl_vnd, status)
      VALUES ($1, 'org1', $2, '2026-01-01', '2026-01-31', 15000000, 150, 100000, 'VERIFIED')
    `, [id1, channelId]);

    await pool.query('COMMIT');
    console.log('MK04 seeded successfully');
  } catch (e) {
    await pool.query('ROLLBACK');
    console.error('Seed MK04 failed:', e);
  } finally {
    await pool.end();
  }
}

seed();
