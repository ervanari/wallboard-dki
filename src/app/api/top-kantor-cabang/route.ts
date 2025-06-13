import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // In a real application, this would fetch data from the database
    // For now, we'll return dummy data
    
    // Example of how to fetch from the database:
    // const result = await query(`
    //   SELECT
    //     b.name,
    //     COUNT(t.id) as count
    //   FROM tickets t
    //   JOIN branch_offices b ON t.branch_id = b.id
    //   WHERE t.created_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    //   GROUP BY b.name
    //   ORDER BY count DESC
    //   LIMIT 5
    // `);
    
    // Return dummy data for now
    const branchData = [
      { name: 'Cabang Utama', count: 125 },
      { name: 'Cabang Kelapa Gading', count: 87 },
      { name: 'Cabang Kemang', count: 72 },
      { name: 'Cabang Sudirman', count: 58 },
      { name: 'Cabang Pondok Indah', count: 45 }
    ];
    
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
