import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch call category inbound data from the database
    const callCategoryResult = await query(`
      SELECT
        it.name,
        COUNT(t.id) AS count
      FROM inbound_types it
      LEFT JOIN tickets t
        ON t.ticket_type_id = it.id
        AND t.create_date >= CURDATE()
        AND t.create_date < CURDATE() + INTERVAL 1 DAY
        AND t.create_department_id = 1
      WHERE it.id IN (2, 3, 4, 5, 6, 7, 8, 9)
      GROUP BY it.id, it.name
      ORDER BY count DESC
    `);

    // Map database results to the expected format with icons
    const categoryIcons: { [key: string]: string } = {
      'Informasi': '📱',
      'Transaksi': '💳',
      'Keluhan': '⚠️',
      'Rekening': '💰',
      'Kartu Kredit': '💳',
      'Mobile Banking': '📲',
      'Internet Banking': '🖥️',
      'Lainnya': '📋'
    };

    // Format the data to match what the component expects
    const formattedCategories = Array.isArray(callCategoryResult)
      ? callCategoryResult.map((category: any) => {
          const name = category.name;
          // Find the best matching icon or use a default
          const icon = categoryIcons[name] || '📋';
          
          return {
            name,
            count: category.count || 0,
            icon
          };
        })
      : [];

    // Ensure we have at least 8 categories (pad with empty ones if needed)
    while (formattedCategories.length < 8) {
      const defaultCategories = [
        { name: 'Informasi Produk', count: 0, icon: '📱' },
        { name: 'Transaksi', count: 0, icon: '💳' },
        { name: 'Keluhan', count: 0, icon: '⚠️' },
        { name: 'Rekening', count: 0, icon: '💰' },
        { name: 'Kartu Kredit', count: 0, icon: '💳' },
        { name: 'Mobile Banking', count: 0, icon: '📲' },
        { name: 'Internet Banking', count: 0, icon: '🖥️' },
        { name: 'Lainnya', count: 0, icon: '📋' }
      ];
      
      // Add missing categories
      const existingNames = formattedCategories.map(c => c.name);
      const missingCategories = defaultCategories.filter(c => !existingNames.includes(c.name));
      
      if (missingCategories.length > 0) {
        formattedCategories.push(missingCategories[0]);
      } else {
        break; // No more categories to add
      }
    }

    // Limit to 8 categories
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
