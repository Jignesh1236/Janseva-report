const { createClient } = require('@supabase/supabase-js');

// Helper function to encode password to Base64
function encodePassword(password) {
  return Buffer.from(password).toString('base64');
}

// Helper function to decode password from Base64
function decodePassword(encodedPassword) {
  try {
    return Buffer.from(encodedPassword, 'base64').toString('utf-8');
  } catch (error) {
    return 'Invalid encoding';
  }
}

async function resetToDefaultPasswords() {
  console.log('🔄 Resetting passwords to default values (Base64 encoded)...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Encode default passwords
    const encodedAdminPassword = encodePassword('admin123');
    const encodedReportPassword = encodePassword('report123');

    // Reset admin password to default
    const { data: adminUpdate, error: adminError } = await supabase
      .from('userdata')
      .update({
        password: encodedAdminPassword,
        role: 'admin'
      })
      .eq('page', 'admin');

    if (adminError) {
      console.error('❌ Admin password reset failed:', adminError);
    } else {
      console.log('✅ Admin password reset to: admin123 (Base64 encoded)');
    }

    // Reset report password to default
    const { data: reportUpdate, error: reportError } = await supabase
      .from('userdata')
      .update({
        password: encodedReportPassword,
        role: 'user'
      })
      .eq('page', 'report');

    if (reportError) {
      console.error('❌ Report password reset failed:', reportError);
    } else {
      console.log('✅ Report password reset to: report123 (Base64 encoded)');
    }

    // Verify the reset
    const { data: allUsers, error: verifyError } = await supabase
      .from('userdata')
      .select('*');

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError);
    } else {
      console.log('\n📊 Current user data (encoded/decoded):');
      allUsers.forEach(user => {
        const decodedPassword = decodePassword(user.password);
        console.log(`  ${user.page}: ${user.password} => ${decodedPassword} (${user.role})`);
      });
    }

  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

resetToDefaultPasswords();