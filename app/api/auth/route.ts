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

    // Check credentials against userdata table
    const { data, error } = await supabaseAdmin
      .from('userdata')
      .select('*')
      .eq('page', page)
      .eq('password', password);

    console.log('Supabase query result:', { data: data ? `found ${data.length} rows` : 'not found', error: error?.message });

    if (error || !data || data.length === 0) {
      console.log('Invalid credentials:', error?.message || 'No matching records found');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // If multiple records exist, use the first one
    const userData = Array.isArray(data) ? data[0] : data;

    console.log('Authentication successful for:', userData.role);
    return NextResponse.json({
      success: true,
      role: userData.role,
      message: 'Authentication successful'
    });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { password, page, role } = await request.json();

    if (!password || !page) {
      return NextResponse.json(
        { success: false, message: 'Password and page are required' },
        { status: 400 }
      );
    }

    // First, try to update the existing record
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('userdata')
      .update({
        password: password,
        role: role || 'user'
      })
      .eq('page', page)
      .select();

    // If update worked (found existing record), return success
    if (!updateError && updateData && updateData.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Password updated successfully'
      });
    }

    // If no existing record found, insert a new one
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('userdata')
      .insert([
        {
          password: password,
          page: page,
          role: role || 'user'
        }
      ])
      .select();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { success: false, message: 'Failed to save password' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password saved successfully'
    });
  } catch (error) {
    console.error('Error saving password:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save password' },
      { status: 500 }
    );
  }
}