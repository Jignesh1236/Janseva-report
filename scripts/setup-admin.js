
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  try {
    // Insert admin user
    const { data, error } = await supabase
      .from('userdata')
      .upsert([
        {
          password: 'admin123',
          page: 'admin',
          role: 'admin'
        },
        {
          password: 'report123',
          page: 'report',
          role: 'user'
        }
      ], {
        onConflict: 'page'
      });

    if (error) {
      console.error('Error setting up admin:', error);
    } else {
      console.log('Admin setup completed successfully');
      console.log('Admin credentials: admin123 (for admin page)');
      console.log('Report credentials: report123 (for report page)');
    }
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupAdmin();
