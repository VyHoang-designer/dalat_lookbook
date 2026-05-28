const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function setupReviews() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();

    console.log("Creating table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
        order_id uuid REFERENCES rental_orders(id) ON DELETE CASCADE,
        product_id uuid REFERENCES products(id) ON DELETE CASCADE,
        customer_name text NOT NULL,
        rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment text NOT NULL,
        image_url text,
        location_name text,
        is_visible boolean DEFAULT true,
        is_featured boolean DEFAULT false,
        created_at timestamp with time zone DEFAULT now(),
        UNIQUE(order_id)
      );
    `);

    console.log("Enabling RLS on reviews table...");
    await client.query("ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;");

    console.log("Creating policies...");
    
    // Drop existing policies if any
    await client.query(`DROP POLICY IF EXISTS "Anyone can view visible reviews" ON reviews`);
    await client.query(`DROP POLICY IF EXISTS "Users can create their own reviews" ON reviews`);
    await client.query(`DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews`);
    await client.query(`DROP POLICY IF EXISTS "Admins can manage all reviews" ON reviews`);

    // Anyone can view visible reviews
    await client.query(`
      CREATE POLICY "Anyone can view visible reviews"
      ON reviews FOR SELECT
      USING (is_visible = true);
    `);

    // Users can create their own reviews
    await client.query(`
      CREATE POLICY "Users can create their own reviews"
      ON reviews FOR INSERT
      WITH CHECK (auth.uid() = user_id);
    `);

    // Users can update their own reviews
    await client.query(`
      CREATE POLICY "Users can update their own reviews"
      ON reviews FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
    `);

    // Admins can manage all reviews
    await client.query(`
      CREATE POLICY "Admins can manage all reviews"
      ON reviews FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
    `);

    console.log("Policies created successfully!");
    
    // Get some order and user to insert dummy data
    const usersRes = await client.query("SELECT id FROM profiles WHERE role = 'customer' LIMIT 1");
    if (usersRes.rows.length === 0) {
      console.log("No customer found to insert dummy data.");
      return;
    }
    const userId = usersRes.rows[0].id;

    // Get 3 random completed or confirmed orders
    const ordersRes = await client.query("SELECT id, product_id FROM rental_orders LIMIT 3");
    
    if (ordersRes.rows.length === 3) {
      console.log("Inserting dummy data...");
      
      const reviews = [
        {
          order_id: ordersRes.rows[0].id,
          product_id: ordersRes.rows[0].product_id,
          customer_name: 'Vy Hà Hoàng',
          rating: 5,
          comment: 'Váy rất xinh, lên hình nhẹ nhàng đúng style nàng thơ. Shop tư vấn nhiệt tình và giao đồ đúng giờ.',
          location_name: 'Hồ Xuân Hương',
          is_visible: true,
          is_featured: true
        },
        {
          order_id: ordersRes.rows[1].id,
          product_id: ordersRes.rows[1].product_id,
          customer_name: 'Minh Anh',
          rating: 5,
          comment: 'Mình thuê set picnic để chụp cùng bạn, đồ sạch, thơm và rất hợp không khí Đà Lạt.',
          location_name: 'Đồi cỏ hồng',
          is_visible: true,
          is_featured: true
        },
        {
          order_id: ordersRes.rows[2].id,
          product_id: ordersRes.rows[2].product_id,
          customer_name: 'Thanh Trúc',
          rating: 4,
          comment: 'Set blazer mặc lên rất thanh lịch, phù hợp đi cà phê và dạo phố. Lần sau mình sẽ thuê tiếp.',
          location_name: 'Quán cà phê Đà Lạt',
          is_visible: true,
          is_featured: true
        }
      ];

      for (const review of reviews) {
        try {
          await client.query(`
            INSERT INTO reviews (
              id, user_id, order_id, product_id, customer_name, rating, comment, location_name, is_visible, is_featured
            ) VALUES (
              gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9
            ) ON CONFLICT (order_id) DO NOTHING;
          `, [
            userId, review.order_id, review.product_id, review.customer_name, 
            review.rating, review.comment, review.location_name, review.is_visible, review.is_featured
          ]);
        } catch (e) {
          console.error("Failed to insert review:", e.message);
        }
      }
      console.log("Dummy data inserted.");
    }
    
  } catch (err) {
    console.error("Error setting up reviews:", err);
  } finally {
    await client.end();
  }
}

setupReviews();
