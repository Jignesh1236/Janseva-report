import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { encodePassword } from '../../../../lib/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Password reset request received');

    // Encode default passwords to Base64
    const encodedAdminPassword = encodePassword('admin123');
    const encodedReportPassword = encodePassword('report123');

    // Reset admin password
    const { data: adminUpdate, error: adminError } = await supabaseAdmin
      .from('userdata')
      .update({
        password: encodedAdminPassword,
        role: 'admin'
      })
      .eq('page', 'admin');

    if (adminError) {
      console.error('Admin password reset failed:', adminError);
      return NextResponse.json(
        { success: false, message: 'Failed to reset admin password' },
        { status: 500 }
      );
    }

    // Reset report password
    const { data: reportUpdate, error: reportError } = await supabaseAdmin
      .from('userdata')
      .update({
        password: encodedReportPassword,
        role: 'user'
      })
      .eq('page', 'report');

    if (reportError) {
      console.error('Report password reset failed:', reportError);
      return NextResponse.json(
        { success: false, message: 'Failed to reset report password' },
        { status: 500 }
      );
    }

    console.log('✅ All passwords reset successfully (Base64 encoded)');
    return NextResponse.json({
      success: true,
      message: 'Passwords reset to default values successfully (Base64 encoded)'
    });

  } catch (error) {
    console.error('Password reset API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}