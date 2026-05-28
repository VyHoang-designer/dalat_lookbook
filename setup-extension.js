const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Missing DATABASE_URL in .env.local");
    process.exit(1);
  }

  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    
    // Create new columns for rental_orders
    console.log("Updating rental_orders table...");
    await client.query(`
      ALTER TABLE rental_orders
      ADD COLUMN IF NOT EXISTS extension_count integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS original_end_date date,
      ADD COLUMN IF NOT EXISTS extra_fee numeric DEFAULT 0;
    `);
    
    // Create order_extensions table
    console.log("Creating order_extensions table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_extensions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id uuid REFERENCES rental_orders(id) ON DELETE CASCADE,
        user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
        old_end_date date NOT NULL,
        new_end_date date NOT NULL,
        extra_days integer NOT NULL,
        extra_amount numeric NOT NULL,
        status text DEFAULT 'approved',
        note text,
        created_at timestamp with time zone DEFAULT now()
      );
    `);
    
    // Force Supabase (PostgREST) to reload schema cache
    console.log("Reloading Supabase schema cache...");
    await client.query(`NOTIFY pgrst, 'reload schema';`);
    
    console.log("Database schema updated successfully.");
  } catch (err) {
    console.error("Database error:", err.message);
  } finally {
    await client.end();
  }
}

main();
