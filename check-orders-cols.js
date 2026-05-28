const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.foikyihnyuthrnlteudt:Hahoangvy0707%40@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
  });
  
  await client.connect();
  
  try {
    const cols = await client.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'rental_orders'
      ORDER BY ordinal_position;
    `);
    console.table(cols.rows);

  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await client.end();
  }
}

main();
