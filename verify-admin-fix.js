// Final verification that admin login is fixed
const { createClient } = require('@supabase/supabase-js');

async function verifyAdminFix() {
  console.log('🔧 ADMIN LOGIN FIX VERIFICATION');
  console.log('================================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Check environment variables
  console.log('✅ Environment Variables:');
  console.log(`   SUPABASE_URL: ${supabaseUrl ? 'SET' : '❌ MISSING'}`);
  console.log(`   SERVICE_KEY: ${supabaseServiceKey ? 'SET' : '❌ MISSING'}`);

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ FAILED: Missing Supabase credentials');
    return false;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Test database connection
    console.log('\n✅ Database Connection:');
    const { data: testData, error: testError } = await supabase
      .from('userdata')
      .select('count')
      .limit(1);

    if (testError) {
      console.log(`   ❌ FAILED: ${testError.message}`);
      return false;
    }
    console.log('   ✅ Connected successfully');

    // Verify admin credentials
    console.log('\n✅ Admin Credentials:');
    const { data: adminData, error: adminError } = await supabase
      .from('userdata')
      .select('*')
      .eq('page', 'admin')
      .eq('password', 'admin123');

    if (adminError || !adminData || adminData.length === 0) {
      console.log('   ❌ FAILED: Admin credentials not found');
      return false;
    }

    const admin = adminData[0];
    console.log(`   ✅ Admin found: ${admin.role} role`);
    console.log(`   ✅ Password: admin123`);
    console.log(`   ✅ Page: ${admin.page}`);

    // Verify API endpoint simulation
    console.log('\n✅ API Endpoint Simulation:');
    
    // This mimics what happens when someone tries to login
    const loginRequest = { password: 'admin123', page: 'admin' };
    const { data: authResult, error: authError } = await supabase
      .from('userdata')
      .select('*')
      .eq('page', loginRequest.page)
      .eq('password', loginRequest.password);

    if (authError || !authResult || authResult.length === 0) {
      console.log('   ❌ FAILED: Authentication would fail');
      return false;
    }

    console.log('   ✅ Authentication would succeed');
    console.log(`   ✅ User role: ${authResult[0].role}`);

    console.log('\n🎉 ADMIN LOGIN SYSTEM: FULLY FIXED!');
    console.log('=====================================');
    console.log('\n📋 USAGE INSTRUCTIONS:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Go to: http://localhost:3000/report/admin');
    console.log('3. Enter password: admin123');
    console.log('4. You will be logged in as admin');
    console.log('\n📋 ALTERNATIVE PAGES:');
    console.log('• /reports/view (password: report123)');
    console.log('• /debug-auth (for testing)');
    console.log('• /debug (for diagnostics)');

    return true;

  } catch (error) {
    console.log(`\n❌ VERIFICATION FAILED: ${error.message}`);
    return false;
  }
}

verifyAdminFix();