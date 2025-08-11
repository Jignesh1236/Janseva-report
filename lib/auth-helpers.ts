import { NextRequest } from 'next/server';
import { supabaseAdmin } from './supabase';

export interface AuthResult {
  isAuthenticated: boolean;
  role?: 'user';
  username?: string;
  error?: string;
}

// Helper function to verify authentication for API routes
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Get authentication info from headers
    const authHeader = request.headers.get('authorization');
    const usernameHeader = request.headers.get('x-username');
    const pageHeader = request.headers.get('x-page');

    if (!authHeader || !pageHeader) {
      return { isAuthenticated: false, error: 'Missing authentication headers' };
    }

    // Extract password from Authorization header (format: "Bearer password")
    const password = authHeader.replace('Bearer ', '');

    // Verify against userdata table
    const { data, error } = await supabaseAdmin
      .from('userdata')
      .select('*')
      .eq('page', pageHeader)
      .eq('password', password)
      .single();

    if (error || !data) {
      return { isAuthenticated: false, error: 'Invalid credentials' };
    }

    // Allow both report and admin page access
    if (data.page !== 'report' && data.page !== 'admin') {
      return { isAuthenticated: false, error: 'Access denied' };
    }

    return {
      isAuthenticated: true,
      role: 'user',
      username: usernameHeader || 'unknown' // Prioritize username from headers
    };
  } catch (error) {
    return { isAuthenticated: false, error: 'Authentication verification failed' };
  }
}

// Helper function to check if user can access specific data
export function canAccessReport(report: any, userRole: 'user', username?: string): boolean {
  // All authenticated users can access all reports
  return userRole === 'user';
}
