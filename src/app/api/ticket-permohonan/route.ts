import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch data from the database using the query from ticket_permohonan.txt
    const result = await query(`
      SELECT
        itd.name,
        COUNT(CASE WHEN t.create_department_id = 1 THEN 1 END) AS "contact_center",
        COUNT(CASE WHEN t.create_department_id = 2 THEN 1 END) AS "kc"
      FROM tickets t
      JOIN inbound_type_sub_category_details itd ON t.ticket_subcategory_id = itd.id
      WHERE t.create_date
      AND t.ticket_type_id = 2
      GROUP BY itd.name
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
    const requestData = result.map((item: any) => ({
      name: item.name || '',
      contact_center: Number(item.contact_center) || 0,
      kc: Number(item.kc) || 0,
      count: (Number(item.contact_center) || 0) + (Number(item.kc) || 0) // Total count for backward compatibility
    }));

    return NextResponse.json({
      requestData: requestData,
      success: true
    });
  } catch (error) {
    console.error('Error fetching ticket permohonan data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ticket permohonan data' },
      { status: 500 }
    );
  }
}
