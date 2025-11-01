import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Report ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('reports')
      .delete()
      .eq('id', id);

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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Report ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch report' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updatedData = await request.json();

    const updateFields: any = {
      income: updatedData.income,
      deposit: updatedData.deposit,
      stamp: updatedData.stamp,
      balance: updatedData.balance,
      mgvcl: updatedData.mgvcl,
      expences: updatedData.expences,
      online: updatedData.onlinePayment, // Map onlinePayment to online field
      cash: updatedData.cash || 0,
      totals: updatedData.totals,
      prepared_by: updatedData.prepared_by || updatedData.username,
    };

    // If timestamp is being updated (from admin edit), save to date and time column
    if (updatedData.timestamp) {
      (updateFields as any)['date and time'] = updatedData.timestamp;
    }

    const { data, error } = await supabaseAdmin
      .from('reports')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating report:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to update report' },
        { status: 500 }
      );
    }

    // Map the response data back to match frontend expectations
    const mappedData = {
      ...data,
      onlinePayment: data.online || [],
      cash: typeof data.cash === 'object' ? (data.cash?.amount || 0) : (data.cash || 0),
      // Use date and time if available, otherwise fall back to timestamp
      timestamp: data['date and time'] || data.timestamp
    };

    return NextResponse.json({ 
      success: true, 
      message: 'Report updated successfully',
      data: mappedData
    });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update report' },
      { status: 500 }
    );
  }
}
