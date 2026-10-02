import { Pool } from 'pg';

export async function seedKd04(pool: Pool, orgId: string) {
  // Get a customer
  let { rows: customers } = await pool.query(`SELECT id FROM "KhachHang" WHERE organization_id = $1 LIMIT 1`, [orgId]);
  
  if (customers.length === 0) {
    const res = await pool.query(
      `INSERT INTO "KhachHang" (organization_id, code, name) VALUES ($1, $2, $3) RETURNING id`,
      [orgId, 'CUST01', 'Khách Hàng KD04']
    );
    customers = res.rows;
  }
  const custId = customers[0].id;

  const today = new Date();
  
  for (let i = 1; i <= 30; i++) {
    const code = `HD${String(i).padStart(3, '0')}`;
    const start = new Date(today.getTime() - (365 * 86400000)); // Started a year ago
    
    // Mix of expiry dates
    let expiryTime = today.getTime();
    if (i % 3 === 0) {
       expiryTime += 15 * 86400000; // Expires in 15 days (Needs reminder)
    } else if (i % 3 === 1) {
       expiryTime += 100 * 86400000; // Expires in 100 days (Safe)
    } else {
       expiryTime -= 10 * 86400000; // Expired 10 days ago (Needs reminder, or is terminated)
    }
    
    const expiryDate = new Date(expiryTime);
    let status = 'ACTIVE';
    if (i % 5 === 0) status = 'TERMINATED';
    if (expiryDate < today && status !== 'TERMINATED') status = 'EXPIRED';

    const startStr = start.toISOString().split('T')[0];
    const expiryStr = expiryDate.toISOString().split('T')[0];

    const { rows: contractRows } = await pool.query(
      `INSERT INTO "HopDong" (organization_id, code, customer_id, start_date, expiry_date, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [orgId, code, custId, startStr, expiryStr, status]
    );

    // Create MocGiaHan
    await pool.query(
      `INSERT INTO "MocGiaHan" (organization_id, contract_id, remind_on, status)
       VALUES ($1, $2, $3, $4)`,
      [orgId, contractRows[0].id, expiryStr, 'PENDING']
    );
  }
}
