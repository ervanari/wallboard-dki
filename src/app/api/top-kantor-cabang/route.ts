import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch data from the database using the query from top_5_branch.txt
    const result = await query(`
      SELECT b.name, COUNT(t.id) AS total
      FROM tickets t
             JOIN branches b ON t.create_branch_id = b.id
      WHERE t.create_date >= CURDATE() AND t.create_date < CURDATE() + INTERVAL 1 DAY
        AND t.create_branch_id != 297
        AND ticket_no IS NOT NULL
      GROUP BY b.name
      ORDER BY total DESC
        LIMIT 5;
    `);

    // Check if result is an array before using map
    if (!Array.isArray(result)) {
      return NextResponse.json(
        { success: false, error: 'Invalid data format received' },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format in the component
    const branchData = result.map((item: any) => ({
      name: item.name || '',
      count: Number(item.total) || 0
    }));

    return NextResponse.json({
      branchData,
      success: true
    });
  } catch (error) {
    console.error('Error fetching top kantor cabang data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch top kantor cabang data' },
      { status: 500 }
    );
  }
}
