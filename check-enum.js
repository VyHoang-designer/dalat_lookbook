const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.foikyihnyuthrnlteudt:Hahoangvy0707%40@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
  });
  
  await client.connect();
  
  try {
    const enumTypes = await client.query(`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus');
    `);
    console.log("OrderStatus values:", enumTypes.rows.map(r => r.enumlabel));

    // Try to add 'awaiting_deposit' if it doesn't exist
    if (!enumTypes.rows.map(r => r.enumlabel).includes('awaiting_deposit')) {
      await client.query(`ALTER TYPE "OrderStatus" ADD VALUE 'awaiting_deposit';`);
      console.log("✅ Added awaiting_deposit to OrderStatus enum");
    }

  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await client.end();
  }
}

main();
