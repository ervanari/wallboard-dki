import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // In a real application, this would fetch data from the database
    // For now, we'll return dummy data
    
    // Example of how to fetch from the database:
    // const result = await query(`
    //   SELECT
    //     DATE_FORMAT(created_date, '%d/%m') as date,
    //     COUNT(*) as count
    //   FROM tickets
    //   WHERE
    //     created_date >= DATE_SUB(CURDATE(), INTERVAL 10 DAY)
    //     AND source = 'branch_office'
    //   GROUP BY DATE_FORMAT(created_date, '%d/%m')
    //   ORDER BY created_date
    // `);
    
    // Return dummy data for now
    const ticketData = [
      { date: '01/05', count: 32 },
      { date: '02/05', count: 38 },
      { date: '03/05', count: 35 },
      { date: '04/05', count: 42 },
      { date: '05/05', count: 48 },
      { date: '06/05', count: 45 },
      { date: '07/05', count: 52 },
      { date: '08/05', count: 58 },
      { date: '09/05', count: 55 },
      { date: '10/05', count: 62 }
    ];
    
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
