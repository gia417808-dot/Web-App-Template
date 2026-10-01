import { Pool, Client } from 'pg';

export async function seedMk02(clientOrPool: Pool | Client, orgId: string) {
  // Ensure we have a channel
  const { rows: channels } = await clientOrPool.query(
    `SELECT id FROM "Kenh" WHERE organization_id = $1 LIMIT 1`,
    [orgId]
  );

  let channelId: string;
  if (channels.length === 0) {
    const { rows: newChannels } = await clientOrPool.query(
      `INSERT INTO "Kenh" (organization_id, code, name)
       VALUES ($1, 'FB', 'Facebook Ads') RETURNING id`,
      [orgId]
    );
    channelId = newChannels[0].id;
  } else {
    channelId = channels[0].id;
  }

  // Seed 5 campaigns
  const campaigns = [
    { code: 'CD01', name: 'Chiến dịch Tết 2026', budget: 50000000, start: '2026-01-01', end: '2026-02-15', status: 'ACTIVE' },
    { code: 'CD02', name: 'Mùa Hè Sôi Động', budget: 30000000, start: '2026-05-01', end: '2026-06-30', status: 'ACTIVE' },
    { code: 'CD03', name: 'Back to School', budget: 20000000, start: '2026-08-01', end: '2026-09-15', status: 'DRAFT' },
    { code: 'CD04', name: 'Black Friday Super Sale', budget: 15000000, start: '2026-11-20', end: '2026-11-30', status: 'ACTIVE' },
    { code: 'CD05', name: 'Chiến dịch Tri Ân Cuối Năm', budget: 10000000, start: '2026-12-01', end: '2026-12-31', status: 'CLOSED' }
  ];

  for (const c of campaigns) {
    const { rows: cdRows } = await clientOrPool.query(
      `INSERT INTO "ChienDich" (organization_id, code, name, start_date, end_date, budget_vnd, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (organization_id, code) DO NOTHING
       RETURNING id`,
      [orgId, c.code, c.name, c.start, c.end, c.budget, c.status]
    );

    const campaignId = cdRows.length > 0 ? cdRows[0].id : null;
    if (campaignId) {
      // Add confirmed expense and draft expense
      await clientOrPool.query(
        `INSERT INTO "ChiPhi" (organization_id, campaign_id, channel_id, business_date, amount_vnd, status)
         VALUES ($1, $2, $3, $4, $5, 'CONFIRMED')`,
        [orgId, campaignId, channelId, c.start, Math.round(c.budget * 0.6)]
      );

      await clientOrPool.query(
        `INSERT INTO "ChiPhi" (organization_id, campaign_id, channel_id, business_date, amount_vnd, status)
         VALUES ($1, $2, $3, $4, $5, 'DRAFT')`,
        [orgId, campaignId, channelId, c.start, Math.round(c.budget * 0.2)]
      );
    }
  }
}
