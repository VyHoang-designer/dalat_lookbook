const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function reload() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log("Granting privileges to anon and authenticated...");
    await client.query("GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.reviews TO anon, authenticated;");
    console.log("Reloading PostgREST schema cache...");
    await client.query("NOTIFY pgrst, 'reload schema'");
    console.log("Success!");
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

reload();
