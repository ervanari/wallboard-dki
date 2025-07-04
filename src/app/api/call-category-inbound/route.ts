import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const callCategoryResult = await query(`
      SELECT it.name     AS name,
             COUNT(c.id) AS total
      FROM inbound_types it
             LEFT JOIN
           media_categories m ON it.id = m.inbound_type_id
             AND m.is_active = 1
             LEFT JOIN
           calls c ON m.media_record_id = c.id
             AND c.call_date >= CURDATE()
             AND c.call_date < CURDATE() + INTERVAL 1 DAY
        AND c.direction_id = 1
        AND c.media_status_id =12
      WHERE it.is_active =1 AND it.is_cc =1
      GROUP BY
        it.id, it.name
    `);

    const formattedCategories = Array.isArray(callCategoryResult)
      ? callCategoryResult.map((category: any) => {
          const name = category.name;
          console.log('Category Name:', category);
          return {
            name,
            count: category.total,
          };
        })
      : [];

    if (formattedCategories.length === 0) {
      return NextResponse.json({
        categoryData: [],
        success: true
      });
    }

    const finalCategories = formattedCategories.slice(0, 8);

    return NextResponse.json({
      categoryData: finalCategories,
      success: true
    });
  } catch (error) {
    console.error('Error fetching call category inbound data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch call category inbound data' },
      { status: 500 }
    );
  }
}
