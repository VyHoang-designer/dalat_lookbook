const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://foikyihnyuthrnlteudt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaWt5aWhueXV0aHJubHRldWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MjE3MDMsImV4cCI6MjA5NTA5NzcwM30.bWVKvB47I-G2h-az7nVC29zi4Zw-NjFDLBEAMatiDsI'
);

const ADMIN_USER_ID = '2d39e9f1-69ff-40c0-8c45-5b72976d608b';

async function seed() {
  // Đăng nhập admin để có quyền ghi
  console.log('🔑 Signing in as admin...');
  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email: 'admin.dalatlookbook@gmail.com',
    password: 'AdminPassword123!',
  });
  if (signInErr) {
    console.error('❌ Sign in failed:', signInErr.message);
    return;
  }
  console.log('✅ Signed in!\n');

  // Kiểm tra schema products - thử select tất cả columns
  console.log('🔍 Checking products schema...');
  const { data: testProd, error: testProdErr } = await supabase
    .from('products')
    .select('*')
    .limit(0);
  console.log('Products error:', testProdErr?.message || 'none');
  
  // Thử insert 1 category để kiểm tra
  console.log('\n📁 Testing category insert...');
  const { data: testCat, error: testCatErr } = await supabase
    .from('categories')
    .upsert({ 
      id: '11111111-1111-1111-1111-111111111111', 
      name: 'Vintage Đà Lạt', 
      slug: 'vintage-da-lat', 
      description: 'Test' 
    }, { onConflict: 'id' })
    .select();
  console.log('Category result:', testCat);
  console.log('Category error:', testCatErr?.message || 'none');

  if (testCatErr) {
    console.log('\n⚠ RLS vẫn chặn. Cần chạy SQL trực tiếp hoặc dùng service_role key.');
    console.log('Hãy vào Supabase Dashboard > SQL Editor và chạy SQL sau:\n');
    
    printSQL();
    return;
  }

  // Nếu insert category thành công, tiếp tục
  console.log('\n📁 Seeding all categories...');
  const { error: catErr } = await supabase.from('categories').upsert([
    { id: '22222222-2222-2222-2222-222222222222', name: 'Nàng thơ', slug: 'nang-tho', description: 'Các mẫu váy trắng, váy pastel, váy hoa nhẹ nhàng dành cho khách thích phong cách nữ tính, trong trẻo.' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Hàn Quốc', slug: 'han-quoc', description: 'Outfit theo phong cách Hàn Quốc hiện đại, tối giản, phù hợp đi chơi, chụp ảnh đường phố và quán cà phê.' },
    { id: '44444444-4444-4444-4444-444444444444', name: 'Y2K Cá Tính', slug: 'y2k-ca-tinh', description: 'Trang phục trẻ trung, nổi bật, phù hợp với các bạn trẻ yêu thích phong cách năng động và cá tính.' },
    { id: '55555555-5555-5555-5555-555555555555', name: 'Couple Look', slug: 'couple-look', description: 'Set đồ đôi dành cho các cặp đôi đi du lịch, chụp ảnh kỷ niệm tại Đà Lạt.' },
    { id: '66666666-6666-6666-6666-666666666666', name: 'Picnic Look', slug: 'picnic-look', description: 'Trang phục phù hợp đi picnic, dã ngoại, chụp ảnh tại đồi cỏ, rừng thông và hồ nước.' },
    { id: '77777777-7777-7777-7777-777777777777', name: 'Công chúa / Tiểu thư', slug: 'cong-chua-tieu-thu', description: 'Các mẫu váy bồng, váy ren, váy tiểu thư phù hợp chụp ảnh concept sang trọng, ngọt ngào.' },
  ], { onConflict: 'id' });
  if (catErr) console.error('  ❌', catErr.message);
  else console.log('  ✅ All categories inserted');

  // Products - thử không dùng cột size
  console.log('\n👗 Seeding products...');
  const products = [
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', category_id: '11111111-1111-1111-1111-111111111111', name: 'Váy hoa nhí vintage Đà Lạt', slug: 'vay-hoa-nhi-vintage-da-lat', description: 'Mẫu váy hoa nhí dáng dài mang phong cách vintage nhẹ nhàng.', price_per_day: 150000, deposit: 300000, color: 'Nâu be', quantity: 5, status: 'available', thumbnail_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop' },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', category_id: '22222222-2222-2222-2222-222222222222', name: 'Váy trắng nàng thơ dáng dài', slug: 'vay-trang-nang-tho-dang-dai', description: 'Váy trắng dáng dài tinh tế, phù hợp concept nàng thơ.', price_per_day: 180000, deposit: 350000, color: 'Trắng', quantity: 4, status: 'available', thumbnail_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop' },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', category_id: '33333333-3333-3333-3333-333333333333', name: 'Set blazer Hàn Quốc thanh lịch', slug: 'set-blazer-han-quoc-thanh-lich', description: 'Set blazer phối chân váy theo phong cách Hàn Quốc.', price_per_day: 200000, deposit: 400000, color: 'Kem', quantity: 3, status: 'available', thumbnail_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop' },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', category_id: '44444444-4444-4444-4444-444444444444', name: 'Set Y2K croptop và chân váy', slug: 'set-y2k-croptop-chan-vay', description: 'Outfit Y2K cá tính gồm áo croptop và chân váy ngắn.', price_per_day: 170000, deposit: 300000, color: 'Đen hồng', quantity: 4, status: 'available', thumbnail_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop' },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', category_id: '55555555-5555-5555-5555-555555555555', name: 'Set đồ đôi vintage couple', slug: 'set-do-doi-vintage-couple', description: 'Set đồ đôi tone nâu be dành cho các cặp đôi đi du lịch Đà Lạt.', price_per_day: 280000, deposit: 500000, color: 'Nâu be', quantity: 3, status: 'available', thumbnail_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop' },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', category_id: '66666666-6666-6666-6666-666666666666', name: 'Váy caro picnic kèm mũ beret', slug: 'vay-caro-picnic-kem-mu-beret', description: 'Set váy caro kèm mũ beret, phù hợp concept picnic.', price_per_day: 160000, deposit: 300000, color: 'Đỏ caro', quantity: 6, status: 'available', thumbnail_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop' },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', category_id: '77777777-7777-7777-7777-777777777777', name: 'Váy công chúa ren trắng', slug: 'vay-cong-chua-ren-trang', description: 'Mẫu váy công chúa ren trắng bồng nhẹ.', price_per_day: 250000, deposit: 500000, color: 'Trắng', quantity: 2, status: 'available', thumbnail_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop' },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', category_id: '11111111-1111-1111-1111-111111111111', name: 'Áo len cardigan vintage', slug: 'ao-len-cardigan-vintage', description: 'Áo len cardigan tone kem nâu, dễ phối.', price_per_day: 90000, deposit: 200000, color: 'Kem nâu', quantity: 8, status: 'available', thumbnail_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop' },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9', category_id: '33333333-3333-3333-3333-333333333333', name: 'Set sơ mi trắng và chân váy đen', slug: 'set-so-mi-trang-chan-vay-den', description: 'Outfit basic theo phong cách Hàn Quốc.', price_per_day: 140000, deposit: 250000, color: 'Trắng đen', quantity: 5, status: 'available', thumbnail_url: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&h=800&fit=crop' },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10', category_id: '22222222-2222-2222-2222-222222222222', name: 'Váy pastel hoa nhẹ nhàng', slug: 'vay-pastel-hoa-nhe-nhang', description: 'Mẫu váy pastel họa tiết hoa nhỏ.', price_per_day: 170000, deposit: 300000, color: 'Hồng pastel', quantity: 4, status: 'available', thumbnail_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop' },
  ];
  const { error: prodErr } = await supabase.from('products').upsert(products, { onConflict: 'id' });
  if (prodErr) console.error('  ❌ Products error:', prodErr.message);
  else console.log('  ✅ 10 products inserted');

  // Product images
  console.log('\n🖼️  Seeding product_images...');
  const { error: imgErr } = await supabase.from('product_images').upsert([
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop', sort_order: 1 },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&h=1000&fit=crop', sort_order: 2 },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', image_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1000&fit=crop', sort_order: 1 },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop', sort_order: 1 },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', image_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1000&fit=crop', sort_order: 1 },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6', product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', image_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1000&fit=crop', sort_order: 1 },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb7', product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&h=1000&fit=crop', sort_order: 1 },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8', product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7', image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1000&fit=crop', sort_order: 1 },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb9', product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8', image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1000&fit=crop', sort_order: 1 },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb10', product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9', image_url: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&h=1000&fit=crop', sort_order: 1 },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb11', product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10', image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop', sort_order: 1 },
  ], { onConflict: 'id' });
  if (imgErr) console.error('  ❌ Images error:', imgErr.message);
  else console.log('  ✅ 11 product_images inserted');

  // Profile update
  console.log('\n👤 Updating admin profile...');
  const { error: profErr } = await supabase.from('profiles').update({
    phone: '0909123456',
    address: 'Đà Lạt, Lâm Đồng',
  }).eq('id', ADMIN_USER_ID);
  if (profErr) console.error('  ❌ Profile error:', profErr.message);
  else console.log('  ✅ Admin profile updated');

  // Orders
  console.log('\n📦 Seeding rental_orders...');
  const { error: ordErr } = await supabase.from('rental_orders').upsert([
    { id: 'cccccccc-cccc-cccc-cccc-ccccccccccc1', user_id: ADMIN_USER_ID, product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', start_date: '2026-06-01', end_date: '2026-06-03', total_price: 300000, customer_name: 'Nguyễn Hoàng Vy', phone: '0909123456', delivery_address: 'Khách sạn gần chợ Đà Lạt, phường 1, Đà Lạt', note: 'Giao trước 8 giờ sáng.', status: 'pending' },
    { id: 'cccccccc-cccc-cccc-cccc-ccccccccccc2', user_id: ADMIN_USER_ID, product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', start_date: '2026-06-05', end_date: '2026-06-06', total_price: 180000, customer_name: 'Trần Minh Anh', phone: '0911222333', delivery_address: 'Homestay đường Hoàng Hoa Thám, Đà Lạt', note: 'Khách chọn nhận đồ tại homestay.', status: 'confirmed' },
    { id: 'cccccccc-cccc-cccc-cccc-ccccccccccc3', user_id: ADMIN_USER_ID, product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', start_date: '2026-06-10', end_date: '2026-06-12', total_price: 320000, customer_name: 'Lê Thanh Trúc', phone: '0988777666', delivery_address: 'Khu vực Hồ Xuân Hương, Đà Lạt', note: 'Thuê set picnic để chụp ảnh nhóm bạn.', status: 'renting' },
  ], { onConflict: 'id' });
  if (ordErr) console.error('  ❌ Orders error:', ordErr.message);
  else console.log('  ✅ 3 rental_orders inserted');

  // Verify
  console.log('\n📊 Verifying...');
  const { count: catCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
  const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: imgCount } = await supabase.from('product_images').select('*', { count: 'exact', head: true });
  const { count: ordCount } = await supabase.from('rental_orders').select('*', { count: 'exact', head: true });
  console.log(`  Categories: ${catCount}`);
  console.log(`  Products: ${prodCount}`);
  console.log(`  Product Images: ${imgCount}`);
  console.log(`  Rental Orders: ${ordCount}`);
  console.log('\n🎉 Done!');
}

function printSQL() {
  console.log(`
-- Chạy SQL này trong Supabase Dashboard > SQL Editor:

-- Thêm RLS policies cho admin
CREATE POLICY "Admin can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin can manage product_images" ON product_images FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin can manage rental_orders" ON rental_orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Hoặc tạm tắt RLS để seed:
-- ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE rental_orders DISABLE ROW LEVEL SECURITY;
  `);
}

seed().catch(console.error);
