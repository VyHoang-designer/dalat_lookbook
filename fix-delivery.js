const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.foikyihnyuthrnlteudt:Hahoangvy0707%40@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
  });
  
  await client.connect();
  
  try {
    // Thêm cột delivery_date để lưu ngày giao hàng do khách chọn
    await client.query(`
      ALTER TABLE rental_orders 
      ADD COLUMN IF NOT EXISTS delivery_date DATE;
    `);
    console.log("✅ Added delivery_date column");
    
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await client.end();
  }
}

main();
