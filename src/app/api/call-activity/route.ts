import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // In a real application, this would fetch data from the database
    // For now, we'll return dummy data
    
    // Example of how to fetch from the database:
    // const activeCallResult = await query(`
    //   SELECT COUNT(*) as activeCall
    //   FROM calls
    //   WHERE status = 'active'
    // `);
    
    // const waitingCallResult = await query(`
    //   SELECT COUNT(*) as waitingCall
    //   FROM calls
    //   WHERE status = 'waiting'
    // `);
    
    // const agentResult = await query(`
    //   SELECT
    //     COUNT(*) as totalAgents,
    //     SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as availableAgents
    //   FROM agents
    // `);
    
    // Return dummy data for now
    return NextResponse.json({
      activeCall: 12,
      waitingCall: 3,
      totalAgents: 25,
      availableAgents: 18,
      success: true
    });
  } catch (error) {
    console.error('Error fetching call activity data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch call activity data' },
      { status: 500 }
    );
  }
}
