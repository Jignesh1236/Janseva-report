import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { encodePassword } from '../../../lib/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    const { page, password, role } = await request.json();

    console.log('🔐 Authentication attempt:', { page, role, hasPassword: !!password });

    if (!page || !password) {
      console.log('❌ Missing credentials');
      return NextResponse.json(
        { success: false, message: 'Page and password are required' },
        { status: 400 }
      );
    }

    // Encode the input password to Base64
    const encodedPassword = encodePassword(String(password));

    // Query the userdata table
    const { data, error } = await supabaseAdmin
      .from('userdata')
      .select('*')
      .eq('page', String(page))
      .eq('password', encodedPassword);

    if (error) {
      console.error('❌ Database error:', error);
      return NextResponse.json(
        { success: false, message: 'Database error' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.log('❌ Invalid credentials for page:', page);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = data[0];
    console.log('✅ Authentication successful for:', user.page);

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        page: user.page,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Auth API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { page, password, role } = await request.json();

    console.log('🔄 Password change attempt:', { page, role, hasPassword: !!password });

    if (!page || !password || !role) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { success: false, message: 'Page, password, and role are required' },
        { status: 400 }
      );
    }

    // Encode the new password to Base64 before storing
    const encodedPassword = encodePassword(String(password));

    // Update the password in userdata table
    const { data, error } = await supabaseAdmin
      .from('userdata')
      .update({
        password: encodedPassword,
        role: String(role)
      })
      .eq('page', String(page))
      .select();

    if (error) {
      console.error('❌ Database update error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to update password' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.log('❌ No records updated for page:', page);
      return NextResponse.json(
        { success: false, message: 'No records found to update' },
        { status: 404 }
      );
    }

    console.log('✅ Password updated successfully for:', data[0].page);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
      user: {
        page: data[0].page,
        role: data[0].role
      }
    });

  } catch (error) {
    console.error('❌ Password change API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}