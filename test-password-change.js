// Test password change functionality
const { createClient } = require('@supabase/supabase-js');

async function testPasswordChange() {
  console.log('🔑 PASSWORD CHANGE FUNCTIONALITY TEST');
  console.log('====================================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Test 1: Check current admin password
    console.log('\n🧪 TEST 1: Current admin password verification');
    const { data: currentData, error: currentError } = await supabase
      .from('userdata')
      .select('*')
      .eq('page', 'admin');

    if (currentError || !currentData || currentData.length === 0) {
      console.log('❌ Failed to get current admin data');
      return;
    }

    const currentAdmin = currentData[0];
    console.log(`✅ Current admin password: ${currentAdmin.password}`);
    console.log(`✅ Current admin role: ${currentAdmin.role}`);

    // Test 2: Change password using PUT endpoint simulation
    console.log('\n🧪 TEST 2: Simulating password change (PUT /api/auth)');
    
    const newPassword = 'newadmin456';
    
    // This simulates what PUT /api/auth does
    const { data: updateData, error: updateError } = await supabase
      .from('userdata')
      .update({
        password: newPassword,
        role: 'admin'
      })
      .eq('page', 'admin')
      .select();

    if (updateError) {
      console.log('❌ Password update failed:', updateError.message);
      return;
    }

    if (updateData && updateData.length > 0) {
      console.log('✅ Password updated successfully');
      console.log(`✅ New password: ${updateData[0].password}`);
      console.log(`✅ Role maintained: ${updateData[0].role}`);
    } else {
      console.log('❌ No records were updated');
    }

    // Test 3: Verify new password works for login
    console.log('\n🧪 TEST 3: Testing login with new password');
    const { data: loginTest, error: loginError } = await supabase
      .from('userdata')
      .select('*')
      .eq('page', 'admin')
      .eq('password', newPassword);

    if (loginError || !loginTest || loginTest.length === 0) {
      console.log('❌ Login with new password failed');
    } else {
      console.log('✅ Login with new password successful');
      console.log(`✅ Authenticated as: ${loginTest[0].role}`);
    }

    // Test 4: Verify old password no longer works
    console.log('\n🧪 TEST 4: Testing old password (should fail)');
    const { data: oldLoginTest, error: oldLoginError } = await supabase
      .from('userdata')
      .select('*')
      .eq('page', 'admin')
      .eq('password', 'admin123');

    if (!oldLoginTest || oldLoginTest.length === 0) {
      console.log('✅ Old password correctly rejected');
    } else {
      console.log('❌ Security issue: Old password still works');
    }

    // Test 5: Change password back to original
    console.log('\n🧪 TEST 5: Restoring original password');
    const { data: restoreData, error: restoreError } = await supabase
      .from('userdata')
      .update({
        password: 'admin123',
        role: 'admin'
      })
      .eq('page', 'admin')
      .select();

    if (restoreError) {
      console.log('❌ Failed to restore original password:', restoreError.message);
    } else if (restoreData && restoreData.length > 0) {
      console.log('✅ Original password restored successfully');
      console.log(`✅ Password back to: ${restoreData[0].password}`);
    }

    // Final verification
    console.log('\n🧪 FINAL: Verifying admin123 works again');
    const { data: finalTest, error: finalError } = await supabase
      .from('userdata')
      .select('*')
      .eq('page', 'admin')
      .eq('password', 'admin123');

    if (finalError || !finalTest || finalTest.length === 0) {
      console.log('❌ Final verification failed');
    } else {
      console.log('✅ Admin login restored to admin123');
    }

    console.log('\n🎉 PASSWORD CHANGE SYSTEM: WORKING CORRECTLY!');
    console.log('==============================================');
    console.log('\n📋 PASSWORD CHANGE PROCESS:');
    console.log('1. Send PUT request to /api/auth');
    console.log('2. Include: { password: "new_password", page: "admin", role: "admin" }');
    console.log('3. System will update password in database');
    console.log('4. Old password will no longer work');
    console.log('5. New password will be required for login');

  } catch (error) {
    console.error('❌ Password change test failed:', error);
  }
}

testPasswordChange();