import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch data from the database using the query from call_activity&abandone.txt
    const result = await query(`
      SELECT
        COUNT(id) AS incoming_call,
        SUM(
            call_state_id = 2
            AND media_status_detail_id IS NULL
        ) AS queue_call,
        SUM(media_status_id = 12) AS answer_call,
        SUM(
            media_status_id = 13
            AND \`calls\`.\`hangup_date\` IS NOT NULL
            AND \`calls\`.\`media_status_detail_id\` = 3
        ) AS abandone_ivr,
        SUM(
            media_status_id = 13
            AND \`calls\`.\`media_status_detail_id\` = 4
        ) AS abandone_queue
      FROM calls
      WHERE
        direction_id = 1
        AND calls.call_date >= CURDATE()
        AND calls.call_date < CURDATE() + INTERVAL 1 DAY
    `);

    console.log('Call Activity Data:', result);

    // Extract the first row of the result (there should be only one row)
    const callData = result[0] || {
      incoming_call: 0,
      queue_call: 0,
      answer_call: 0,
      abandone_ivr: 0,
      abandone_queue: 0
    };

    return NextResponse.json({
      incomingCall: callData.incoming_call,
      queueCall: callData.queue_call,
      answerCall: callData.answer_call,
      abandoneIvr: callData.abandone_ivr,
      abandoneQueue: callData.abandone_queue,
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
