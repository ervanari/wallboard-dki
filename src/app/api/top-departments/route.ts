import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // In a real application, this would fetch data from the database
    // For now, we'll return dummy data
    
    // Example of how to fetch from the database:
    // const result = await query(`
    //   SELECT
    //     d.name,
    //     COUNT(t.id) as count
    //   FROM tickets t
    //   JOIN departments d ON t.department_id = d.id
    //   WHERE t.created_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    //   GROUP BY d.name
    //   ORDER BY count DESC
    //   LIMIT 5
    // `);
    
    // Return dummy data for now
    const departmentData = [
      { name: 'Customer Service', count: 145 },
      { name: 'IT Support', count: 98 },
      { name: 'Finance', count: 76 },
      { name: 'Operations', count: 65 },
      { name: 'Marketing', count: 42 }
    ];
    
    return NextResponse.json({
      departmentData,
      success: true
    });
  } catch (error) {
    console.error('Error fetching top departments data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch top departments data' },
      { status: 500 }
    );
  }
}
