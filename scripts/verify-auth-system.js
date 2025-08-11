const { createClient } = require('@supabase/supabase-js');

async function verifyAuthSystem() {
  console.log('🔍 Verifying complete authentication system...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Test database connection
    console.log('\n1️⃣ Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('userdata')
      .select('count');
    
    if (connectionError) {
      console.error('❌ Database connection failed:', connectionError);
      return;
    }
    console.log('✅ Database connection successful');

    // Test admin credentials
    console.log('\n2️⃣ Testing admin authentication...');
    const { data: adminData, error: adminError } = await supabase
      .from('userdata')
      .select('*')
      .eq('page', 'admin')
      .eq('password', 'admin123');

    if (adminError || !adminData || adminData.length === 0) {
      console.error('❌ Admin authentication test failed');
    } else {
      console.log('✅ Admin authentication working');
    }

    // Test report credentials
    console.log('\n3️⃣ Testing report authentication...');
    const { data: reportData, error: reportError } = await supabase
      .from('userdata')
      .select('*')
      .eq('page', 'report')
      .eq('password', 'report123');

    if (reportError || !reportData || reportData.length === 0) {
      console.error('❌ Report authentication test failed');
    } else {
      console.log('✅ Report authentication working');
    }

    // Check for any duplicate entries
    console.log('\n4️⃣ Checking for duplicate entries...');
    const { data: allData, error: allError } = await supabase
      .from('userdata')
      .select('*');

    if (allError) {
      console.error('❌ Error checking duplicates:', allError);
    } else {
      const adminCount = allData.filter(u => u.page === 'admin').length;
      const reportCount = allData.filter(u => u.page === 'report').length;
      
      if (adminCount > 1 || reportCount > 1) {
        console.warn('⚠️ Duplicate entries found - cleaning up...');
        // Keep only the first entry for each page
        for (const page of ['admin', 'report']) {
          const pageEntries = allData.filter(u => u.page === page);
          if (pageEntries.length > 1) {
            for (let i = 1; i < pageEntries.length; i++) {
              await supabase
                .from('userdata')
                .delete()
                .eq('id', pageEntries[i].id);
            }
          }
        }
        console.log('✅ Duplicates cleaned up');
      } else {
        console.log('✅ No duplicate entries found');
      }
    }

    console.log('\n🎉 Authentication system verification complete!');
    console.log('📝 Default credentials:');
    console.log('   Admin: admin123');
    console.log('   Report: report123');

  } catch (error) {
    console.error('❌ Verification script failed:', error);
  }
}

verifyAuthSystem();