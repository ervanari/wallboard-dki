import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch data from the database using the query from top_5_departments.txt
    const result = await query(`
      SELECT
        d.name AS name,
        COUNT(t.id) AS total
      FROM
        tickets t
          JOIN
        branches b ON t.branch_id = b.id
          JOIN
        departments d ON b.department_id = d.id
      WHERE
        t.create_date >= CURDATE() AND t.create_date < CURDATE() + INTERVAL 1 DAY
        AND b.department_id NOT IN (1,2)
        AND t.ticket_no IS NOT NULL
      GROUP BY
        d.id, d.name
      ORDER BY
        total DESC
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
    const departmentData = result.map((item: any) => ({
      name: item.name || '',
      count: Number(item.total) || 0
    }));

    return NextResponse.json({
      departmentData,
      success: true
    });
  } catch (error) {
    console.error('Error fetching top departments data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch top departments data' },
      { status: 500 }
    );
  }
}
