import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('username')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching usernames:', error);
      return NextResponse.json(
        { error: 'Failed to fetch usernames' },
        { status: 500 }
      );
    }

    // Extract unique usernames
    const uniqueUsernames = Array.from(
      new Set(data?.map(report => report.username).filter(Boolean))
    );

    return NextResponse.json(uniqueUsernames);
  } catch (error) {
    console.error('Error in usernames API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
