import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // In a real application, this would fetch data from the database
    // For now, we'll return dummy data
    
    // Example of how to fetch from the database:
    // const result = await query(`
    //   SELECT AVG(service_level) as serviceLevel
    //   FROM call_metrics
    //   WHERE date = CURDATE()
    // `);
    
    // Return dummy data for now
    return NextResponse.json({
      serviceLevel: 85,
      success: true
    });
  } catch (error) {
    console.error('Error fetching service level data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service level data' },
      { status: 500 }
    );
  }
}
