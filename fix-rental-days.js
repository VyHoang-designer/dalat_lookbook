const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.query("UPDATE rental_orders SET rental_days = 5 WHERE id = '96b9a6c2-e792-4945-8da2-5c1de9820c53'");
    console.log("Fixed rental days");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
