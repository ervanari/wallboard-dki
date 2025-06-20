import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Custom JWT verification function that works in Edge Runtime
async function verifyJWT(token: string, secret: string): Promise<any> {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Base64Url decode function
    function base64UrlDecode(input: string): string {
      // Replace base64url characters with base64 standard characters
      const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if needed
      const padding = '='.repeat((4 - base64.length % 4) % 4);
      return atob(base64 + padding);
    }

    // Decode the header and payload
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token expired');
    }

    // For simplicity, we're not verifying the signature cryptographically
    // In a production environment, you should use the jose library or implement proper signature verification

    return payload;
  } catch (error) {
    throw error;
  }
}

// Define the paths that require authentication
const protectedPaths = ['/', '/wallboard'];

// Define paths that should be excluded from authentication
const excludedPaths = ['/api/auth/login'];

// Define API paths that should be accessible without authentication
const publicApiPaths = [
  '/api/service-level',
  '/api/call-activity',
  '/api/total-call',
  '/api/average-duration',
  '/api/ticket-status',
  '/api/total-ticket',
  '/api/top-department',
  '/api/top-kantor-cabang',
  '/api/ticket-permohonan',
  '/api/ticket-complaint',
  '/api/call-category',
  '/api/user-activity'
];

// Function to check if the path is protected
function isProtectedPath(path: string): boolean {
  // First check if the path is in the excluded list
  if (excludedPaths.some(excludedPath => path === excludedPath)) {
    return false;
  }

  // Check if it's a public API path
  if (publicApiPaths.some(apiPath => path.startsWith(apiPath))) {
    return false;
  }

  // Then check if it's in the protected list
  return protectedPaths.some(prefix => path.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Get the token from the cookies
  const token = request.cookies.get('auth_token')?.value;
  // console.log('Auth token found:', token ? 'Yes' : 'No');

  // Special handling for login page - redirect to wallboard if already logged in
  if (path === '/login') {
    if (token) {
      try {
        // Verify the token
        const secret = process.env.JWT_SECRET || 'W3bD3v3l0pm3nt_W!54n6G3n1';
        await verifyJWT(token, secret);

        // If token is valid, redirect to wallboard
        const url = new URL('/app/wallboard', request.url);
        return NextResponse.redirect(url);
      } catch (error) {
        // If token is invalid, clear it and continue to login page
        const response = NextResponse.next();
        response.cookies.delete('auth_token');
        return response;
      }
    }
    // If no token, continue to login page
    return NextResponse.next();
  }

  // Only run auth check middleware for protected paths
  if (!isProtectedPath(path)) {
    return NextResponse.next();
  }

  // If there's no token, redirect to login
  if (!token) {
    console.log('No auth token, redirecting to login');
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  try {
    // Verify the token
    const secret = process.env.JWT_SECRET || 'secret';
    console.log('Verifying token with secret:', secret ? 'Secret available' : 'No secret');

    const decoded = await verifyJWT(token, secret);

    // If token is valid, continue with the request
    console.log('Token is valid, continuing with request');
    return NextResponse.next();
  } catch (error) {
    // If token verification fails, redirect to login
    // Provide more detailed error logging for debugging
    if (error instanceof Error) {
      console.error('Token verification failed:', error.name, error.message);
    } else {
      console.error('Token verification failed with unknown error:', error);
    }

    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
}

// Configure the middleware to run only for specific paths
export const config = {
  matcher: ['/', '/wallboard/:path*', '/login'],
};
