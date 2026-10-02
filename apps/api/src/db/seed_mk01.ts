import { Pool } from 'pg';

export async function seedMk01(pool: Pool, orgId: string) {
  // Get an owner
  const { rows: users } = await pool.query(`SELECT id FROM "NguoiDung" WHERE organization_id = $1 LIMIT 1`, [orgId]);
  if (users.length === 0) return;
  const ownerId = users[0].id;

  // Create Channel
  const { rows: channels } = await pool.query(
    `INSERT INTO "Kenh" (organization_id, code, name) 
     VALUES ($1, $2, $3) RETURNING id`,
    [orgId, 'CH01', 'Facebook Fanpage']
  );
  const channelId = channels[0].id;

  for (let i = 1; i <= 30; i++) {
    const code = `ND${String(i).padStart(3, '0')}`;
    const title = `Bài viết ${i}`;
    const scheduledAt = new Date(new Date().getTime() + (i * 86400000));
    const status = i % 2 === 0 ? 'PUBLISHED' : 'SCHEDULED';
    const publishedAt = status === 'PUBLISHED' ? new Date(scheduledAt.getTime() - 3600000) : null;
    
    await pool.query(
      `INSERT INTO "NoiDung" (organization_id, code, title, channel_id, scheduled_at, published_at, status, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [orgId, code, title, channelId, scheduledAt, publishedAt, status, ownerId]
    );
  }
}
