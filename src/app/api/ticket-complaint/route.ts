import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // In a real application, this would fetch data from the database
    // For now, we'll return dummy data
    
    // Example of how to fetch from the database:
    // const result = await query(`
    //   SELECT
    //     c.name,
    //     COUNT(t.id) as count
    //   FROM tickets t
    //   JOIN complaint_types c ON t.complaint_type_id = c.id
    //   WHERE
    //     t.created_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    //     AND t.type = 'complaint'
    //   GROUP BY c.name
    //   ORDER BY count DESC
    //   LIMIT 7
    // `);
    
    // Return dummy data for now
    const complaintData = [
      { name: 'Transaksi Gagal', count: 65 },
      { name: 'Layanan Lambat', count: 52 },
      { name: 'Biaya Admin', count: 48 },
      { name: 'ATM Rusak', count: 42 },
      { name: 'Mobile Banking Error', count: 38 },
      { name: 'Antrian Panjang', count: 35 },
      { name: 'Lainnya', count: 28 }
    ];
    
    return NextResponse.json({
      complaintData,
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
