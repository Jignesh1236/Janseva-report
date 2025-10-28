
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const username = searchParams.get('username');

    if (!dateParam || !username) {
      return NextResponse.json(
        { success: false, message: 'Date and username parameters are required' },
        { status: 400 }
      );
    }

    // Create date range for the specified date
    const startDate = new Date(dateParam);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(dateParam);
    endDate.setHours(23, 59, 59, 999);

    // Check for existing reports with same username on the same date
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('id, username, timestamp')
      .eq('username', username)
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to check for duplicates' },
        { status: 500 }
      );
    }

    const isDuplicate = data && data.length > 0;

    return NextResponse.json({
      success: true,
      isDuplicate,
      count: data?.length || 0,
      existingReports: data || []
    });
  } catch (error) {
    console.error('Error checking duplicate report:', error);
    return NextResponse.json(
      { success: false, message: 'Error checking duplicate report' },
      { status: 500 }
    );
  }
}
