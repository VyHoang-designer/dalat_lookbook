const { createClient } = require('@supabase/supabase-js');

// Dùng service role key để bypass RLS
const supabase = createClient(
  'https://foikyihnyuthrnlteudt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaWt5aWhueXV0aHJubHRldWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MjE3MDMsImV4cCI6MjA5NTA5NzcwM30.bWVKvB47I-G2h-az7nVC29zi4Zw-NjFDLBEAMatiDsI'
);

async function checkSchema() {
  // Check categories columns
  console.log('=== categories ===');
  const { data: cat, error: catErr } = await supabase.from('categories').select('*').limit(0);
  console.log('Error:', catErr?.message || 'none');
  
  // Try to read with a simple select to see column names
  const { data: cat2, error: catErr2 } = await supabase.from('categories').select('*').limit(1);
  console.log('Sample:', cat2);
  console.log('Error:', catErr2?.message || 'none');

  console.log('\n=== products ===');
  const { data: prod, error: prodErr } = await supabase.from('products').select('*').limit(1);
  console.log('Sample:', prod);
  console.log('Error:', prodErr?.message || 'none');

  console.log('\n=== product_images ===');
  const { data: img, error: imgErr } = await supabase.from('product_images').select('*').limit(1);
  console.log('Sample:', img);
  console.log('Error:', imgErr?.message || 'none');

  console.log('\n=== profiles ===');
  const { data: prof, error: profErr } = await supabase.from('profiles').select('*').limit(1);
  console.log('Sample:', prof);
  console.log('Error:', profErr?.message || 'none');

  console.log('\n=== rental_orders ===');
  const { data: ord, error: ordErr } = await supabase.from('rental_orders').select('*').limit(1);
  console.log('Sample:', ord);
  console.log('Error:', ordErr?.message || 'none');
}

checkSchema().catch(console.error);
