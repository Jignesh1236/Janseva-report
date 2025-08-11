import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Auth POST request received');
    const body = await request.json();
    console.log('Auth request body:', { ...body, password: '***' });

    const { password, page } = body;

    if (!password || !page) {
      console.log('Missing password or page');
      return NextResponse.json(
        { success: false, message: 'Password and page are required' },
        { status: 400 }
      );
    }

    console.log('Checking credentials for page:', page);

    // Check credentials against userdata table with explicit string comparison
    const { data, error } = await supabaseAdmin
      .from('userdata')
      .select('*')
      .eq('page', page.toString())
      .eq('password', password.toString());

    console.log('Supabase query result:', { 
      data: data ? `found ${data.length} rows` : 'not found', 
      error: error?.message,
      searchPage: page.toString(),
      searchPasswordLength: password.toString().length
    });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, message: 'Database error occurred' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.log('No matching credentials found');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Use the first matching record
    const userData = data[0];

    console.log('Authentication successful for role:', userData.role);
    return NextResponse.json({
      success: true,
      role: userData.role,
      username: userData.page === 'admin' ? 'admin' : 'report',
      message: 'Authentication successful'
    });

  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('Password change request received');
    const { password, page, role } = await request.json();

    if (!password || !page) {
      console.log('Missing required fields:', { password: !!password, page: !!page });
      return NextResponse.json(
        { success: false, message: 'Password and page are required' },
        { status: 400 }
      );
    }

    const targetRole = role || (page === 'admin' ? 'admin' : 'user');
    console.log('Updating password for page:', page, 'with role:', targetRole);

    // Update existing record with explicit string conversion
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('userdata')
      .update({
        password: password.toString(),
        role: targetRole
      })
      .eq('page', page.toString())
      .select();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { success: false, message: 'Failed to update password' },
        { status: 500 }
      );
    }

    if (updateData && updateData.length > 0) {
      console.log('Password updated successfully for:', page);
      return NextResponse.json({
        success: true,
        message: 'Password updated successfully'
      });
    }

    // If no existing record found, create new one
    console.log('No existing record found, creating new entry');
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('userdata')
      .insert([
        {
          password: password.toString(),
          page: page.toString(),
          role: targetRole
        }
      ])
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { success: false, message: 'Failed to create password entry' },
        { status: 500 }
      );
    }

    console.log('New password entry created for:', page);
    return NextResponse.json({
      success: true,
      message: 'Password saved successfully'
    });

  } catch (error) {
    console.error('Password change API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save password' },
      { status: 500 }
    );
  }
}