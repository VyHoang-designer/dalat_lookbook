const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query("SELECT relrowsecurity FROM pg_class WHERE relname = 'rental_orders'");
    console.log("RLS Enabled:", res.rows[0]?.relrowsecurity);
    
    // Check if there are policies
    const policies = await client.query("SELECT * FROM pg_policies WHERE tablename = 'rental_orders'");
    console.log("Policies:", policies.rows);
  } finally {
    await client.end();
  }
}

main();
