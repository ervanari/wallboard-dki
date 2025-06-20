import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch data from the database using the query from total_call.txt
    const result = await query(`
      SELECT
        EXTRACT(HOUR FROM rci.call_hour) AS call_hour,
        rci.call_date,
        rci.answered,
        rci.abandon
      FROM report_call_in_summaries rci
      WHERE rci.call_date >= CURDATE() AND rci.call_date < CURDATE() + INTERVAL 1 DAY
    `);

    // Return the data as JSON with a success flag
    return NextResponse.json({
      totalCallData: result,
      success: true
    });
  } catch (error) {
    console.error('Error fetching total call data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch total call data' },
      { status: 500 }
    );
  }
}
