const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.query(`CREATE POLICY "Users can update own orders" ON rental_orders FOR UPDATE USING (auth.uid() = user_id)`);
    console.log("Policy added successfully");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
