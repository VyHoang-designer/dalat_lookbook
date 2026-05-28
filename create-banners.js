const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const banners = [
  "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/cong-chua-tieu-thu.png",
  "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/couple-picnic-look.png",
  "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/nang-tho-collection.png",
  "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/style-han-quoc.png",
  "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/vintage-da-lat.png",
  "https://foikyihnyuthrnlteudt.supabase.co/storage/v1/object/public/banner/y2k-ca-tinh.png"
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
  });

  await client.connect();

  console.log("Connected to PostgreSQL");

  try {
    // 1. Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        image_url text NOT NULL,
        sort_order integer DEFAULT 0,
        created_at timestamp with time zone DEFAULT now()
      );
    `);
    console.log("Table 'banners' ensured.");

    // 2. Enable RLS and add public select policy
    try {
      await client.query(`ALTER TABLE banners ENABLE ROW LEVEL SECURITY;`);
      await client.query(`
        CREATE POLICY "Public profiles are viewable by everyone." 
        ON banners FOR SELECT USING (true);
      `);
      console.log("RLS policy enabled.");
    } catch (e) {
      if (!e.message.includes("already exists")) {
        console.warn("Could not create policy (might already exist):", e.message);
      }
    }

    // 3. Clear existing banners to ensure fresh seed
    await client.query(`DELETE FROM banners`);

    // 4. Insert the banners
    let sort_order = 1;
    for (const url of banners) {
      await client.query(
        `INSERT INTO banners (image_url, sort_order) VALUES ($1, $2)`,
        [url, sort_order++]
      );
    }
    console.log("Banners inserted successfully.");

  } catch (err) {
    console.error("Error executing queries:", err);
  } finally {
    await client.end();
  }
}

main();
