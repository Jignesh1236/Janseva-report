const { createClient } = require('@supabase/supabase-js');

// Test authentication functionality
async function testAuth() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('Testing authentication system...');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Service Key exists:', !!supabaseServiceKey);

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Test admin credentials
    console.log('\n🔍 Testing admin login credentials...');
    const { data: adminData, error: adminError } = await supabase
      .from('userdata')
      .select('*')
      .eq('page', 'admin')
      .eq('password', 'admin123');

    if (adminError) {
      console.error('❌ Admin test failed:', adminError.message);
    } else if (adminData && adminData.length > 0) {
      console.log('✅ Admin login working! Found user:', adminData[0]);
    } else {
      console.log('❌ Admin credentials not found');
    }

    // Test report credentials
    console.log('\n🔍 Testing report login credentials...');
    const { data: reportData, error: reportError } = await supabase
      .from('userdata')
      .select('*')
      .eq('page', 'report')
      .eq('password', 'report123');

    if (reportError) {
      console.error('❌ Report test failed:', reportError.message);
    } else if (reportData && reportData.length > 0) {
      console.log('✅ Report login working! Found user:', reportData[0]);
    } else {
      console.log('❌ Report credentials not found');
    }

    // List all users in table
    console.log('\n📋 All users in database:');
    const { data: allUsers, error: listError } = await supabase
      .from('userdata')
      .select('*');

    if (listError) {
      console.error('❌ Failed to list users:', listError.message);
    } else {
      console.log(allUsers);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuth();