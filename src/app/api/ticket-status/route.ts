import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch ticket status data from the database using the query from ticket_status.txt
    const ticketStatusResult = await query(`
      SELECT
        ROW_NUMBER() OVER (ORDER BY ts.id) AS no,
        ts.name AS ticket_status,
        ts.id AS status_id,
        COUNT(t.id) AS total
      FROM ticket_statuses ts
      LEFT JOIN tickets t
        ON t.ticket_status_id = ts.id
        AND t.create_date
      WHERE ts.id IN (1, 2, 4, 5, 6, 11)
      GROUP BY ts.id, ts.name
    `);

    // Initialize counters for each ticket status category
    let createTickets = 0;
    let passedTickets = 0;
    let failedTickets = 0;
    let queueTickets = 0;
    let openTickets = 0;
    let closedTickets = 0;
    //
    // // Map the database results to the expected format
    // if (Array.isArray(ticketStatusResult)) {
    //   ticketStatusResult.forEach((status: any) => {
    //     switch (status.status_id) {
    //       case 1:
    //         createTickets += status.total;
    //         break;
    //       case 2:
    //         passedTickets += status.total;
    //         break;
    //       case 4:
    //         failedTickets += status.total;
    //         break;
    //       case 5:
    //         queueTickets += status.total;
    //         break;
    //       case 6:
    //         openTickets += status.total;
    //         break;
    //       case 11:
    //         closedTickets += status.total;
    //         break;
    //       default:
    //         break;
    //     }
    //   });
    // }

    console.log('Ticket Status Data:', {
        createTickets,
        passedTickets,
        failedTickets,
        queueTickets,
        openTickets,
        closedTickets,
        rawStatusData: ticketStatusResult
    })
    return NextResponse.json({
      createTickets,
      passedTickets,
      failedTickets,
      queueTickets,
      openTickets,
      closedTickets,
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
