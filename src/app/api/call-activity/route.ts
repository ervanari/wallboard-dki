import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Define the type for the expected result row
type CallActivityData = {
  incoming_call: number;
  queue_call: number;
  answer_call: number;
  abandone_ivr: number;
  abandone_queue: number;
  abandone_agent: number;
  abandone_transfer: number;
};

export async function GET() {
  try {
    // Fetch data from the database using the query from call_activity&abandone.txt
    const result = await query(`
        SELECT COUNT(id)                 AS incoming_call,
               SUM(
                       call_state_id = 2
                           AND media_status_detail_id IS NULL
               )                         AS queue_call,
               SUM(media_status_id = 12) AS answer_call,
               SUM(
                       media_status_id = 13
                           AND \`calls\`.\`hangup_date\` IS NOT NULL
                           AND \`calls\`.\`media_status_detail_id\` = 3
               )                         AS abandone_ivr,
               SUM(
                       media_status_id = 13
                           AND \`calls\`.\`media_status_detail_id\` = 4
               )                         AS abandone_queue,
               SUM(
                       media_status_id = 13
                           AND \`calls\`.\`media_status_detail_id\` = 5
               )                         AS abandone_agent,
               SUM(
                       media_status_id = 13
                           AND \`calls\`.\`media_status_detail_id\` = 34
                           AND \`calls\`.\`hangup_date\` IS NOT NULL
               )                         AS abandone_transfer
        FROM calls
        WHERE direction_id = 1
          AND calls.call_date >= CURDATE()
          AND calls.call_date < CURDATE() + INTERVAL 1 DAY
    
    `);

    // Check if the result is an array and extract the first row
    let callData: CallActivityData = {
      incoming_call: 0,
      queue_call: 0,
      answer_call: 0,
      abandone_ivr: 0,
      abandone_queue: 0,
      abandone_agent: 0,
      abandone_transfer: 0
    };
    
    if (Array.isArray(result) && result.length > 0) {
      // Cast the first row to our expected type
      const firstRow = result[0] as CallActivityData;
      callData = {
        incoming_call: Number(firstRow.incoming_call) || 0,
        queue_call: Number(firstRow.queue_call) || 0,
        answer_call: Number(firstRow.answer_call) || 0,
        abandone_ivr: Number(firstRow.abandone_ivr) || 0,
        abandone_queue: Number(firstRow.abandone_queue) || 0,
        abandone_agent: Number(firstRow.abandone_agent) || 0,
        abandone_transfer: Number(firstRow.abandone_transfer) || 0
      };
    }

    return NextResponse.json({
      incomingCall: callData.incoming_call,
      queueCall: callData.queue_call,
      answerCall: callData.answer_call,
      abandoneIvr: callData.abandone_ivr,
      abandoneQueue: callData.abandone_queue,
      abandoneAgent: callData.abandone_agent,
      abandoneTransfer: callData.abandone_transfer,
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
