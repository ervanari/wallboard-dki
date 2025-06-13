import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // In a real application, this would fetch data from the database
    // For now, we'll return dummy data
    
    // Example of how to fetch from the database:
    // const result = await query(`
    //   SELECT
    //     SEC_TO_TIME(AVG(TIME_TO_SEC(talk_time))) as avgTalkTime,
    //     SEC_TO_TIME(AVG(TIME_TO_SEC(hold_time))) as avgHoldTime,
    //     SEC_TO_TIME(AVG(TIME_TO_SEC(handle_time))) as avgHandleTime,
    //     SEC_TO_TIME(AVG(TIME_TO_SEC(wrap_up_time))) as avgWrapUpTime
    //   FROM call_details
    //   WHERE date = CURDATE()
    // `);
    
    // Return dummy data for now
    return NextResponse.json({
      avgTalkTime: '03:45',
      avgHoldTime: '01:20',
      avgHandleTime: '05:15',
      avgWrapUpTime: '02:10',
      success: true
    });
  } catch (error) {
    console.error('Error fetching average duration data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch average duration data' },
      { status: 500 }
    );
  }
}
