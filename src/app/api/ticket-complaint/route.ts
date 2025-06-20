import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch data from the database using the query from ticket_complain.txt
    const result = await query(`
      SELECT
        itd.name,
        COUNT(CASE WHEN t.create_department_id = 1 THEN 1 END) AS "contact_center",
        COUNT(CASE WHEN t.create_department_id = 2 THEN 1 END) AS "kc"
      FROM tickets t
      JOIN inbound_type_sub_category_details itd ON t.ticket_subcategory_id = itd.id
      WHERE t.create_date
      AND t.ticket_type_id = 3
      GROUP BY itd.name
      ORDER BY itd.name
      LIMIT 5;
    `);

    // Transform the data to match the expected format in the component
    const complaintData = result.map((item: any) => ({
      name: item.name,
      count: (item.contact_center || 0) + (item.kc || 0), // Total count combining both departments
      contact_center: item.contact_center || 0,
      kc: item.kc || 0
    }));

    return NextResponse.json({
      complaintData: complaintData,
      success: true
    });
  } catch (error) {
    console.error('Error fetching ticket complaint data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ticket complaint data' },
      { status: 500 }
    );
  }
}
