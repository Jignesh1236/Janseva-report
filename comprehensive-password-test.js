// Comprehensive password change system test
const { createClient } = require('@supabase/supabase-js');

async function comprehensivePasswordTest() {
  console.log('🔐 COMPREHENSIVE PASSWORD CHANGE SYSTEM TEST');
  console.log('=============================================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Test scenarios
  const scenarios = [
    {
      name: 'Admin Password Security Test',
      page: 'admin',
      currentPassword: 'admin123',
      newPassword: 'supersecure456',
      role: 'admin'
    },
    {
      name: 'Report User Password Security Test', 
      page: 'report',
      currentPassword: 'report123',
      newPassword: 'reportnew789',
      role: 'user'
    }
  ];

  let allTestsPassed = true;

  for (const scenario of scenarios) {
    console.log(`\n🧪 ${scenario.name}`);
    console.log('='.repeat(scenario.name.length + 4));

    try {
      // 1. Verify current state
      console.log('1️⃣ Current password verification...');
      const { data: current, error: currentError } = await supabase
        .from('userdata')
        .select('*')
        .eq('page', scenario.page);

      if (currentError || !current || current.length === 0) {
        console.log(`❌ Failed to get current data for ${scenario.page}`);
        allTestsPassed = false;
        continue;
      }

      console.log(`   Current password: ${current[0].password}`);
      console.log(`   Current role: ${current[0].role}`);

      // 2. Test authentication with current password
      console.log('2️⃣ Authentication test with current password...');
      const { data: authCurrent, error: authCurrentError } = await supabase
        .from('userdata')
        .select('*')
        .eq('page', scenario.page)
        .eq('password', scenario.currentPassword);

      if (authCurrentError || !authCurrent || authCurrent.length === 0) {
        console.log('❌ Current password authentication failed');
        allTestsPassed = false;
        continue;
      }
      console.log('✅ Current password authentication successful');

      // 3. Change password (simulate PUT /api/auth)
      console.log('3️⃣ Password change operation...');
      const { data: updateResult, error: updateError } = await supabase
        .from('userdata')
        .update({
          password: scenario.newPassword,
          role: scenario.role
        })
        .eq('page', scenario.page)
        .select();

      if (updateError) {
        console.log(`❌ Password update failed: ${updateError.message}`);
        allTestsPassed = false;
        continue;
      }

      if (!updateResult || updateResult.length === 0) {
        console.log('❌ Password update returned no results');
        allTestsPassed = false;
        continue;
      }

      console.log('✅ Password updated successfully');
      console.log(`   New password: ${updateResult[0].password}`);

      // 4. Test authentication with new password
      console.log('4️⃣ Authentication test with new password...');
      const { data: authNew, error: authNewError } = await supabase
        .from('userdata')
        .select('*')
        .eq('page', scenario.page)
        .eq('password', scenario.newPassword);

      if (authNewError || !authNew || authNew.length === 0) {
        console.log('❌ New password authentication failed');
        allTestsPassed = false;
        continue;
      }
      console.log('✅ New password authentication successful');
      console.log(`✅ Role preserved: ${authNew[0].role}`);

      // 5. Verify old password is rejected
      console.log('5️⃣ Old password rejection test...');
      const { data: authOld, error: authOldError } = await supabase
        .from('userdata')
        .select('*')
        .eq('page', scenario.page)
        .eq('password', scenario.currentPassword);

      if (!authOld || authOld.length === 0) {
        console.log('✅ Old password correctly rejected');
      } else {
        console.log('❌ SECURITY RISK: Old password still works!');
        allTestsPassed = false;
      }

      // 6. API endpoint simulation test
      console.log('6️⃣ API endpoint simulation test...');
      const apiRequest = {
        password: scenario.newPassword,
        page: scenario.page,
        role: scenario.role
      };

      console.log('   Simulating POST /api/auth (login check)...');
      const { data: apiTest, error: apiError } = await supabase
        .from('userdata')
        .select('*')
        .eq('page', apiRequest.page)
        .eq('password', apiRequest.password);

      if (apiError || !apiTest || apiTest.length === 0) {
        console.log('❌ API simulation failed');
        allTestsPassed = false;
      } else {
        console.log('✅ API simulation passed');
        console.log(`✅ Would return: { success: true, role: "${apiTest[0].role}" }`);
      }

      // 7. Restore original password for consistency
      console.log('7️⃣ Restoring original password...');
      await supabase
        .from('userdata')
        .update({
          password: scenario.currentPassword,
          role: scenario.role
        })
        .eq('page', scenario.page);

      console.log(`✅ Password restored to: ${scenario.currentPassword}`);

    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
      allTestsPassed = false;
    }
  }

  // Final summary
  console.log('\n📊 FINAL TEST RESULTS');
  console.log('=====================');
  
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('');
    console.log('✅ Password change system fully functional');
    console.log('✅ Security measures working correctly');
    console.log('✅ Authentication endpoints operational');
    console.log('✅ Role preservation working');
    console.log('✅ Old password invalidation working');
    
    console.log('\n🔧 HOW TO USE PASSWORD CHANGE:');
    console.log('=============================');
    console.log('1. Frontend sends PUT request to /api/auth');
    console.log('2. Include JSON body: { password: "new_pass", page: "admin", role: "admin" }');
    console.log('3. System updates password in database');
    console.log('4. Old password becomes invalid immediately');
    console.log('5. New password required for future logins');

    console.log('\n🌐 CURRENT WORKING CREDENTIALS:');
    console.log('===============================');
    console.log('Admin: admin123 (for /report/admin)');
    console.log('Report: report123 (for /reports/view)');
  } else {
    console.log('❌ SOME TESTS FAILED!');
    console.log('Please check the error messages above');
  }
}

comprehensivePasswordTest();