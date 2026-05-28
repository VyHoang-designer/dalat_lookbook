const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.foikyihnyuthrnlteudt:Hahoangvy0707%40@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
  });
  
  await client.connect();
  
  try {
    // Thêm cột deposit_status để theo dõi trạng thái đặt cọc
    await client.query(`
      ALTER TABLE rental_orders 
      ADD COLUMN IF NOT EXISTS deposit_status TEXT NOT NULL DEFAULT 'pending';
    `);
    console.log("✅ Added deposit_status column");

    // Cập nhật các giá trị hợp lệ: pending, confirmed, rejected
    // pending = chưa xác nhận, confirmed = admin đã xác nhận nhận cọc, rejected = từ chối
    
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await client.end();
  }
}

main();
