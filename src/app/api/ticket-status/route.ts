import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // In a real application, this would fetch data from the database
    // For now, we'll return dummy data
    
    // Example of how to fetch from the database:
    // const result = await query(`
    //   SELECT
    //     SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as openTickets,
    //     SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as inProgressTickets,
    //     SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolvedTickets,
    //     SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closedTickets
    //   FROM tickets
    //   WHERE created_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    // `);
    
    // Return dummy data for now
    return NextResponse.json({
      openTickets: 42,
      inProgressTickets: 28,
      resolvedTickets: 65,
      closedTickets: 103,
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
