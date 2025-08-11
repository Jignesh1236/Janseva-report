import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 System verification started');
    const results = [];

    // Test database connection
    const { data: connectionTest, error: connectionError } = await supabaseAdmin
      .from('userdata')
      .select('count');
    
    if (connectionError) {
      results.push('❌ Database connection failed');
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        details: results
      });
    }
    results.push('✅ Database connection successful');

    // Test admin credentials
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('userdata')
      .select('*')
      .eq('page', 'admin')
      .eq('password', 'admin123');

    if (adminError || !adminData || adminData.length === 0) {
      results.push('❌ Admin authentication test failed');
    } else {
      results.push('✅ Admin authentication working');
    }

    // Test report credentials
    const { data: reportData, error: reportError } = await supabaseAdmin
      .from('userdata')
      .select('*')
      .eq('page', 'report')
      .eq('password', 'report123');

    if (reportError || !reportData || reportData.length === 0) {
      results.push('❌ Report authentication test failed');
    } else {
      results.push('✅ Report authentication working');
    }

    // Check for duplicates
    const { data: allData, error: allError } = await supabaseAdmin
      .from('userdata')
      .select('*');

    if (allError) {
      results.push('❌ Error checking duplicates');
    } else {
      const adminCount = allData.filter(u => u.page === 'admin').length;
      const reportCount = allData.filter(u => u.page === 'report').length;
      
      if (adminCount > 1 || reportCount > 1) {
        results.push('⚠️ Duplicate entries found');
      } else {
        results.push('✅ No duplicate entries');
      }
    }

    const allTestsPassed = results.every(r => r.startsWith('✅'));
    
    console.log('System verification completed:', allTestsPassed ? 'PASSED' : 'FAILED');
    
    return NextResponse.json({
      success: allTestsPassed,
      message: allTestsPassed ? 'All system checks passed' : 'Some system checks failed',
      details: results.join('\n')
    });

  } catch (error) {
    console.error('System verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed due to internal error' },
      { status: 500 }
    );
  }
}