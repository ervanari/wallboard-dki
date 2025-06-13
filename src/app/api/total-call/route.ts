import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // In a real application, this would fetch data from the database
    // For now, we'll return dummy data
    
    // Example of how to fetch from the database:
    // const result = await query(`
    //   SELECT
    //     HOUR(time) as hour,
    //     COUNT(CASE WHEN direction = 'inbound' THEN 1 END) as inbound,
    //     COUNT(CASE WHEN direction = 'outbound' THEN 1 END) as outbound
    //   FROM calls
    //   WHERE date = CURDATE()
    //   GROUP BY HOUR(time)
    //   ORDER BY HOUR(time)
    // `);
    
    // Return dummy data for now
    const callData = [
      { time: '08:00', inbound: 45, outbound: 32 },
      { time: '09:00', inbound: 78, outbound: 41 },
      { time: '10:00', inbound: 95, outbound: 53 },
      { time: '11:00', inbound: 83, outbound: 47 },
      { time: '12:00', inbound: 65, outbound: 38 },
      { time: '13:00', inbound: 72, outbound: 43 },
      { time: '14:00', inbound: 88, outbound: 51 },
      { time: '15:00', inbound: 92, outbound: 49 },
      { time: '16:00', inbound: 75, outbound: 45 }
    ];
    
    return NextResponse.json({
      callData,
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
