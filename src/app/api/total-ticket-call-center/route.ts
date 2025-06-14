import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch data from the database using the query from ticket_call_center.txt
    const result = await query(`
      SELECT
        ROW_NUMBER() OVER (ORDER BY it.id) AS no,
        it.name AS inbound_type,
        COUNT(t.id) AS total
      FROM inbound_types it
      LEFT JOIN tickets t
        ON t.ticket_type_id = it.id
        AND t.create_date
        AND t.create_department_id = 1
      WHERE it.id IN (2,3)
      GROUP BY it.id, it.name;
    `);

    console.log('Total Ticket Call Center Data:', result);

    // Transform the data to match the expected format in the component
    const ticketData = result.map((item: any) => ({
      type: item.inbound_type,
      total: item.total
    }));

    return NextResponse.json({
      ticketData,
      success: true
    });
  } catch (error) {
    console.error('Error fetching total ticket call center data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch total ticket call center data' },
      { status: 500 }
    );
  }
}
