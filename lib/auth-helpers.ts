import { NextRequest } from 'next/server';
import { supabaseAdmin } from './supabase';

export interface AuthResult {
  isAuthenticated: boolean;
  role?: 'admin' | 'user';
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

    return {
      isAuthenticated: true,
      role: data.role as 'admin' | 'user',
      username: usernameHeader || undefined
    };
  } catch (error) {
    return { isAuthenticated: false, error: 'Authentication verification failed' };
  }
}

// Helper function to check if user can access specific data
export function canAccessReport(report: any, userRole: 'admin' | 'user', username?: string): boolean {
  // Admin can access all reports
  if (userRole === 'admin') {
    return true;
  }
  
  // Regular users can only access their own reports
  if (userRole === 'user' && username && report.username) {
    return report.username.toLowerCase() === username.toLowerCase();
  }
  
  return false;
}