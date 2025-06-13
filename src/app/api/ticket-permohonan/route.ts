import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // In a real application, this would fetch data from the database
    // For now, we'll return dummy data
    
    // Example of how to fetch from the database:
    // const result = await query(`
    //   SELECT
    //     r.name,
    //     COUNT(t.id) as count
    //   FROM tickets t
    //   JOIN request_types r ON t.request_type_id = r.id
    //   WHERE
    //     t.created_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    //     AND t.type = 'request'
    //   GROUP BY r.name
    //   ORDER BY count DESC
    //   LIMIT 7
    // `);
    
    // Return dummy data for now
    const requestData = [
      { name: 'Informasi Produk', count: 85 },
      { name: 'Pembukaan Rekening', count: 72 },
      { name: 'Kartu ATM', count: 65 },
      { name: 'Mobile Banking', count: 58 },
      { name: 'Internet Banking', count: 45 },
      { name: 'Kredit', count: 38 },
      { name: 'Deposito', count: 32 }
    ];
    
    return NextResponse.json({
      requestData,
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
