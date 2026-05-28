require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    // Add policies for storage.objects
    await client.query(`
      CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'product_images');
    `);
    console.log("Insert policy created.");

  } catch (err) {
    if (err.message.includes("already exists")) {
       console.log("Policy already exists or another issue:", err.message);
    } else {
       console.error("Error:", err.message);
    }
  } finally {
    await client.end();
  }
}

main();
