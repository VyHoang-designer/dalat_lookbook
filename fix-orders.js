const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://foikyihnyuthrnlteudt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaWt5aWhueXV0aHJubHRldWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MjE3MDMsImV4cCI6MjA5NTA5NzcwM30.bWVKvB47I-G2h-az7nVC29zi4Zw-NjFDLBEAMatiDsI'
);

async function fixOrders() {
  await supabase.auth.signInWithPassword({
    email: 'admin.dalatlookbook@gmail.com',
    password: 'AdminPassword123!',
  });

  const { error } = await supabase.from('rental_orders').upsert([
    { id: 'cccccccc-cccc-cccc-cccc-ccccccccccc1', user_id: '2d39e9f1-69ff-40c0-8c45-5b72976d608b', product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', start_date: '2026-06-01', end_date: '2026-06-03', rental_days: 2, total_price: 300000, customer_name: 'Nguyễn Hoàng Vy', phone: '0909123456', delivery_address: 'Khách sạn gần chợ Đà Lạt, phường 1, Đà Lạt', note: 'Giao trước 8 giờ sáng.', status: 'pending' },
    { id: 'cccccccc-cccc-cccc-cccc-ccccccccccc2', user_id: '2d39e9f1-69ff-40c0-8c45-5b72976d608b', product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', start_date: '2026-06-05', end_date: '2026-06-06', rental_days: 1, total_price: 180000, customer_name: 'Trần Minh Anh', phone: '0911222333', delivery_address: 'Homestay đường Hoàng Hoa Thám, Đà Lạt', note: 'Khách chọn nhận đồ tại homestay.', status: 'confirmed' },
    { id: 'cccccccc-cccc-cccc-cccc-ccccccccccc3', user_id: '2d39e9f1-69ff-40c0-8c45-5b72976d608b', product_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', start_date: '2026-06-10', end_date: '2026-06-12', rental_days: 2, total_price: 320000, customer_name: 'Lê Thanh Trúc', phone: '0988777666', delivery_address: 'Khu vực Hồ Xuân Hương, Đà Lạt', note: 'Thuê set picnic để chụp ảnh nhóm bạn.', status: 'renting' },
  ], { onConflict: 'id' });
  
  if (error) console.error('❌', error.message);
  else {
    const { count } = await supabase.from('rental_orders').select('*', { count: 'exact', head: true });
    console.log(`✅ ${count} rental_orders inserted`);
  }
}
fixOrders();
