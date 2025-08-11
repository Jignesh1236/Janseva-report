import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    if (!dateParam) {
      return NextResponse.json({ message: 'Date parameter is required' }, { status: 400 });
    }

    // Create date range for the specified date
    const startDate = new Date(dateParam);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(dateParam);
    endDate.setHours(23, 59, 59, 999);

    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch filtered reports' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching filtered reports:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching filtered reports' },
      { status: 500 }
    );
  }
}