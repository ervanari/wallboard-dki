import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch ticket status data from the database using the query from ticket_status.txt
    const ticketStatusResult = await query(`
        SELECT
            ROW_NUMBER() OVER (ORDER BY ts.id) AS no,
            ts.name AS ticket_status,
            COUNT(t.id) AS total
        FROM ticket_statuses ts
         LEFT JOIN tickets t
           ON t.ticket_status_id = ts.id
               AND t.create_date
               AND t.ticket_no IS NOT NULL
        WHERE ts.id IN ( 5,6,7,10,11)
        GROUP BY ts.id, ts.name;
    `);

    console.log('Ticket Status Data:', {
        rawStatusData: ticketStatusResult
    })
    return NextResponse.json({
      rawStatusData: ticketStatusResult, // Include raw data for debugging if needed
      success: true
    });
  } catch (error) {
    console.error('Error fetching ticket status data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ticket status data' },
      { status: 500 }
    );
  }
}
