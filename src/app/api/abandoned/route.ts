import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // In a real application, this would fetch data from the database
    // For now, we'll return dummy data
    
    // Example of how to fetch from the database:
    // const result = await query(`
    //   SELECT
    //     COUNT(*) as abandonedCalls,
    //     (COUNT(*) / (SELECT COUNT(*) FROM calls WHERE date = CURDATE())) * 100 as abandonedRate
    //   FROM calls
    //   WHERE status = 'abandoned' AND date = CURDATE()
    // `);
    
    // Return dummy data for now
    return NextResponse.json({
      abandonedCalls: 8,
      abandonedRate: 3.2,
      success: true
    });
  } catch (error) {
    console.error('Error fetching abandoned calls data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch abandoned calls data' },
      { status: 500 }
    );
  }
}
