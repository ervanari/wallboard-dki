import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch data from the database using the query from ticket_branch.txt
    const result = await query(`
      SELECT ROW_NUMBER() OVER (ORDER BY it.id) AS no,
        it.name AS inbound_type,
        COUNT(t.id) AS total
            FROM inbound_types it
              LEFT JOIN tickets t
            ON t.ticket_type_id = it.id
              AND t.create_date >= CURDATE()
              AND t.create_date < CURDATE() + INTERVAL 1 DAY
              AND t.create_department_id = 2
              AND t.ticket_no IS NOT NULL
            WHERE it.id IN (2, 3)
            GROUP BY it.id, it.name;
    `);

    // Check if result is an array before using map
    if (!Array.isArray(result)) {
      return NextResponse.json(
        { success: false, error: 'Invalid data format received' },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format in the component
    const ticketData = result.map((item: any) => ({
      type: item.inbound_type,
      total: Number(item.total) || 0
    }));

    return NextResponse.json({
      ticketData,
      success: true
    });
  } catch (error) {
    console.error('Error fetching total ticket kantor cabang data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch total ticket kantor cabang data' },
      { status: 500 }
    );
  }
}
