import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch data from the database using the query from top_5_branch.txt
    const result = await query(`
      SELECT b.name, COUNT(t.id) AS total
      FROM tickets t
      JOIN branches b ON t.create_branch_id = b.id
      WHERE t.create_date
      GROUP BY b.name
      ORDER BY total DESC
      LIMIT 3;
    `);

    console.log('Top Kantor Cabang Data:', result);

    // Transform the data to match the expected format in the component
    const branchData = result.map((item: any) => ({
      name: item.name,
      count: item.total
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
