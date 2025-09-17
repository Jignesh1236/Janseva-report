import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { verifyAuth, canAccessReport } from '../../../lib/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/reports - Starting request processing');

    const reportData = await request.json();
    console.log('Received report data:', JSON.stringify(reportData, null, 2));

    // Validate required fields
    if (!reportData.username) {
      console.error('Missing username in report data');
      return NextResponse.json(
        { success: false, message: 'Username is required' },
        { status: 400 }
      );
    }

    // Prepare data for Supabase
    const report = {
      income: reportData.income || {},
      deposit: reportData.deposit || {},
      stamp: reportData.stamp || {},
      balance: reportData.balance || {},
      mgvcl: reportData.mgvcl || {},
      expences: reportData.expences || {},
      online: reportData.onlinePayment || [], // Map onlinePayment to online field
      cash: reportData.cash || 0, // Save cash as direct number value
      totals: reportData.totals || {},
      username: reportData.username, // Add username field
      timestamp: reportData.timestamp || new Date().toISOString(),
    };

    console.log('Prepared report for Supabase:', JSON.stringify(report, null, 2));

    // Insert into Supabase
    const { data, error } = await supabaseAdmin
      .from('reports')
      .insert([report])
      .select();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to save report to database',
          error: error.message
        },
        { status: 500 }
      );
    }

    console.log('Report saved successfully:', data);
    return NextResponse.json({
      success: true,
      message: 'Report saved successfully',
      reportId: data[0].id
    });
  } catch (error) {
    console.error('Error saving report:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to save report',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  console.log('GET /api/reports - Starting request processing');

  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    console.log('Auth result:', authResult);

    if (!authResult.isAuthenticated) {
      console.log('Authentication failed:', authResult.error);
      return NextResponse.json(
        { error: 'Authentication failed: ' + authResult.error },
        { status: 401 }
      );
    }

    console.log('User authenticated with role:', authResult.role);

    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch reports',
          error: error.message
        },
        { status: 500 }
      );
    }

    console.log(`Fetched ${data?.length || 0} reports from database`);

    // Filter data based on user permissions and username
    let filteredData = data || [];
    
    // For regular users, only show their own reports
    if (authResult.role === 'user' && authResult.username !== 'admin') {
      filteredData = data?.filter(report => report.username === authResult.username) || [];
    }

    console.log(`Filtered to ${filteredData.length} reports for user role: ${authResult.role}, username: ${authResult.username}`);

    // Map the data to ensure online field is properly mapped
    const mappedData = filteredData.map(report => ({
      ...report,
      onlinePayment: report.online || [],
      cash: typeof report.cash === 'object' ? (report.cash?.amount || 0) : (report.cash || 0), // Handle both object and direct number
      // Use date and time if available, otherwise fall back to timestamp
      timestamp: report['date and time'] || report.timestamp
    }));

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch reports',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const reportId = url.searchParams.get('id');

    if (!reportId) {
      return NextResponse.json(
        { success: false, message: 'Report ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('reports')
      .delete()
      .eq('id', reportId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to delete report' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete report' },
      { status: 500 }
    );
  }
}
