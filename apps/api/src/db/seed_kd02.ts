import { Pool } from 'pg';

export async function seedKd02(pool: Pool, orgId: string) {
  // Create GiaiDoan
  const stages = [
    { code: 'STG1', name: 'Mới tiếp cận', order: 1, prob: 10 },
    { code: 'STG2', name: 'Đang thương lượng', order: 2, prob: 50 },
    { code: 'STG3', name: 'Chốt sale', order: 3, prob: 90 }
  ];

  const stageIds = [];
  for (const s of stages) {
    const { rows } = await pool.query(
      `INSERT INTO "GiaiDoan" (organization_id, code, name, sort_order, default_probability_pct)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [orgId, s.code, s.name, s.order, s.prob]
    );
    stageIds.push(rows[0].id);
  }

  // Create CoHoi
  for (let i = 1; i <= 30; i++) {
    const code = `CH${String(i).padStart(3, '0')}`;
    const stageIndex = i % 3;
    const stageId = stageIds[stageIndex];
    const prob = stages[stageIndex].prob;
    const value = 10000000 + (i * 1000000);
    let status = 'OPEN';
    if (i % 5 === 0) status = 'WON';
    if (i % 7 === 0) status = 'LOST';
    
    await pool.query(
      `INSERT INTO "CoHoi" (organization_id, code, stage_id, value_vnd, probability_pct, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [orgId, code, stageId, value, prob, status]
    );
  }
}
