import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch data from the database using the query from ticket_complain.txt
    const result = await query(`
      SELECT
        itd.name,
        COUNT(CASE WHEN t.create_department_id = 1 THEN 1 END) AS "contact_center",
        COUNT(CASE WHEN t.create_department_id = 2 THEN 1 END) AS "kc",
        (COUNT(CASE WHEN t.create_department_id = 1 THEN 1 END) + COUNT(CASE WHEN t.create_department_id = 2 THEN 1 END)) AS total
      FROM tickets t
             JOIN inbound_type_sub_category_details itd ON t.ticket_subcategory_id = itd.id
      WHERE t.create_date >= CURDATE() AND t.create_date < CURDATE() + INTERVAL 1 DAY
        AND t.ticket_type_id = 3
        AND t.ticket_no IS NOT NULL
      GROUP BY itd.name
      ORDER BY total DESC
        LIMIT 5;
    `);

    // Define type for each item in the result
    type ComplaintItem = {
      name: string;
      contact_center: number | null;
      kc: number | null;
    };

    // Check if result is an array before using map
    if (!Array.isArray(result)) {
      return NextResponse.json(
        { success: false, error: 'Invalid data format received' },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format in the component
    // Use a type assertion for each item in the array
    const complaintData = result.map((item: any) => ({
      name: item.name || '',
      count: (Number(item.contact_center) || 0) + (Number(item.kc) || 0), // Total count combining both departments
      contact_center: Number(item.contact_center) || 0,
      kc: Number(item.kc) || 0
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
