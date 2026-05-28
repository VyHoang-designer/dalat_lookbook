const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Missing DATABASE_URL in .env.local");
    return;
  }

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to database");

    // 1. Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS support_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        sender_role TEXT NOT NULL CHECK (sender_role IN ('customer', 'admin')),
        content TEXT NOT NULL,
        image_url TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("Created support_messages table");

    // 2. Enable Realtime
    // Check if the publication 'supabase_realtime' exists
    const pubRes = await client.query(`
      SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime';
    `);

    if (pubRes.rowCount === 0) {
       await client.query(`CREATE PUBLICATION supabase_realtime;`);
    }

    // Add table to publication if not already added
    try {
      await client.query(`
        ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;
      `);
      console.log("Enabled realtime for support_messages");
    } catch (e) {
      if (e.message.includes("already in publication")) {
        console.log("Realtime already enabled for support_messages");
      } else {
        console.warn("Could not add to publication:", e.message);
      }
    }
    
    console.log("Chat setup completed successfully!");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

main();
