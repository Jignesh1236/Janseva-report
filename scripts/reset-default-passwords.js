const { createClient } = require('@supabase/supabase-js');

async function resetToDefaultPasswords() {
  console.log('🔄 Resetting passwords to default values...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Reset admin password to default
    const { data: adminUpdate, error: adminError } = await supabase
      .from('userdata')
      .update({
        password: 'admin123',
        role: 'admin'
      })
      .eq('page', 'admin');

    if (adminError) {
      console.error('❌ Admin password reset failed:', adminError);
    } else {
      console.log('✅ Admin password reset to: admin123');
    }

    // Reset report password to default
    const { data: reportUpdate, error: reportError } = await supabase
      .from('userdata')
      .update({
        password: 'report123',
        role: 'user'
      })
      .eq('page', 'report');

    if (reportError) {
      console.error('❌ Report password reset failed:', reportError);
    } else {
      console.log('✅ Report password reset to: report123');
    }

    // Verify the reset
    const { data: allUsers, error: verifyError } = await supabase
      .from('userdata')
      .select('*');

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError);
    } else {
      console.log('\n📊 Current user data:');
      allUsers.forEach(user => {
        console.log(`  ${user.page}: ${user.password} (${user.role})`);
      });
    }

  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

resetToDefaultPasswords();