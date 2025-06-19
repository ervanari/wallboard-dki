import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

// Handle POST requests only
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    console.log('Login request body:', body);

    // Check if username and password are provided
    if (!body.username || !body.password) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 400 }
      );
    }

    // Query the users table by username
    const users = await query(
      'SELECT * FROM users WHERE username = ?',
      [body.username]
    ) as any[];

    // Check if user exists
    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0];

    console.log('User object:', user);

    // Determine which field contains the password hash
    let passwordHash = user.password_hash;

    // If password_hash doesn't exist, try 'password' field
    if (!passwordHash && user.password) {
      console.log('Using password field instead of password_hash');
      passwordHash = user.password;
    }

    // Check if we have a password hash
    if (!passwordHash) {
      console.error('Password hash is missing for user:', user.username);
      return NextResponse.json(
        { success: false, message: 'Authentication error', error: 'Password hash is missing' },
        { status: 500 }
      );
    }

    // Verify password with bcrypt
    // Ensure both arguments are provided and are strings
    if (typeof body.password !== 'string' || typeof passwordHash !== 'string') {
      console.error('Invalid password or hash type:', {
        passwordType: typeof body.password,
        hashType: typeof passwordHash
      });
      return NextResponse.json(
        { success: false, message: 'Authentication error', error: 'Invalid password or hash format' },
        { status: 500 }
      );
    }

    // Ensure neither argument is empty
    if (body.password.length === 0 || passwordHash.length === 0) {
      console.error('Empty password or hash');
      return NextResponse.json(
        { success: false, message: 'Authentication error', error: 'Empty password or hash' },
        { status: 500 }
      );
    }

    console.log('Comparing password with hash. Password length:', body.password.length, 'Hash length:', passwordHash.length);
    const passwordMatch = await bcrypt.compare(body.password, passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    // Use user_id if available, otherwise fall back to id
    const userId = user.user_id || user.id;
    const token = jwt.sign(
      { id: userId, username: user.username },
      process.env.JWT_SECRET || 'W3bD3v3l0pm3nt_W!54n6G3n1',
      { expiresIn: '1d' }
    );

    console.log('Generated JWT token:', token);
    console.log('User authenticated:', user.username);

    // Create response with success message
    const response = NextResponse.json({ success: true });

    // Set JWT in HTTP-only cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 86400, // 1 day in seconds
      path: '/' // Set path to restrict cookie to wallboard
    });

    console.log('JWT set in cookie', response);
    return response;

  } catch (error) {
    console.error('Login error:', error);

    // Provide more specific error messages for debugging
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
