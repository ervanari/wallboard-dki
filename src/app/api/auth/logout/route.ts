import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Handle POST requests only
export async function POST() {
  try {
    // Get the cookie store
    const cookieStore = cookies();
    
    // Check if the auth_token cookie exists
    const token = cookieStore.get('auth_token');
    
    // Delete the auth_token cookie by setting it with empty value and maxAge: 0
    // Use the same settings as in the login route
    cookieStore.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0, // This will expire the cookie immediately
      path: '/'
    });
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Provide error message for debugging
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { success: false, message: 'Server error', error: errorMessage },
      { status: 500 }
    );
  }
}
