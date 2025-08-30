
const { createClient } = require('@supabase/supabase-js');

// Helper function to encode password to Base64
function encodePassword(password) {
  return Buffer.from(password).toString('base64');
}

// Helper function to decode password from Base64 (for verification)
function decodePassword(encodedPassword) {
  try {
    return Buffer.from(encodedPassword, 'base64').toString('utf-8');
  } catch (error) {
    return 'Invalid encoding';
  }
}

async function migratePasswordsToBase64() {
  console.log('🔄 Migrating existing passwords to Base64 encoding...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Get all current users
    const { data: allUsers, error: fetchError } = await supabase
      .from('userdata')
      .select('*');

    if (fetchError) {
      console.error('❌ Failed to fetch users:', fetchError);
      return;
    }

    console.log('\n📊 Current passwords (before migration):');
    allUsers.forEach(user => {
      console.log(`  ${user.page}: ${user.password} (${user.role})`);
    });

    // Migrate each user's password
    for (const user of allUsers) {
      // Check if password is already Base64 encoded
      const decodedTest = decodePassword(user.password);
      const isAlreadyEncoded = decodedTest !== 'Invalid encoding' && 
                              encodePassword(decodedTest) === user.password;

      if (isAlreadyEncoded) {
        console.log(`✅ ${user.page}: Password already Base64 encoded`);
        continue;
      }

      // Encode the current password
      const encodedPassword = encodePassword(user.password);

      // Update the user's password
      const { data: updateData, error: updateError } = await supabase
        .from('userdata')
        .update({
          password: encodedPassword,
          role: user.role
        })
        .eq('page', user.page);

      if (updateError) {
        console.error(`❌ Failed to update ${user.page}:`, updateError);
      } else {
        console.log(`✅ ${user.page}: ${user.password} => ${encodedPassword} (Base64)`);
      }
    }

    // Verify migration
    const { data: updatedUsers, error: verifyError } = await supabase
      .from('userdata')
      .select('*');

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError);
    } else {
      console.log('\n📊 Passwords after migration (encoded/decoded):');
      updatedUsers.forEach(user => {
        const decodedPassword = decodePassword(user.password);
        console.log(`  ${user.page}: ${user.password} => ${decodedPassword} (${user.role})`);
      });
    }

    console.log('\n✅ Password migration to Base64 completed!');
    console.log('\n🔑 Login credentials remain the same:');
    console.log('   Admin: admin123 (for /report/admin)');
    console.log('   Report: report123 (for /reports/view)');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migratePasswordsToBase64();
