import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Password reset request received');

    // Reset admin password
    const { data: adminUpdate, error: adminError } = await supabaseAdmin
      .from('userdata')
      .update({
        password: 'admin123',
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
        password: 'report123',
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

    console.log('✅ All passwords reset successfully');
    return NextResponse.json({
      success: true,
      message: 'Passwords reset to default values successfully'
    });

  } catch (error) {
    console.error('Password reset API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}