import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {

    const sql = `
    SELECT ROUND(
      (
        (
          SELECT COUNT(calls.id)
          FROM calls
          WHERE
            calls.direction_id = 1
            AND calls.call_date >= CURDATE()
            AND calls.call_date < CURDATE() + INTERVAL 1 DAY
            AND (calls.hangup_date IS NOT NULL OR calls.pickup_date IS NOT NULL)
        ) -
        (
          (
            SELECT COUNT(calls.id)
            FROM calls
            WHERE
              calls.direction_id = 1
              AND calls.media_status_id = 13
              AND calls.media_status_detail_id = 4
              AND calls.call_date >= CURDATE()
              AND calls.call_date < CURDATE() + INTERVAL 1 DAY
          ) +
          (
            SELECT COUNT(calls.id)
            FROM calls
            WHERE
              calls.direction_id = 1
              AND calls.media_status_id = 12
              AND calls.call_date >= CURDATE()
              AND calls.call_date < CURDATE() + INTERVAL 1 DAY
              AND TIME_TO_SEC(TIMEDIFF(calls.transfer_date, calls.queue_date)) > 20
          )
        )
      )
      /
      (
        SELECT COUNT(calls.id)
        FROM calls
        WHERE
          calls.direction_id = 1
          AND calls.call_date >= CURDATE()
          AND calls.call_date < CURDATE() + INTERVAL 1 DAY
          AND (calls.hangup_date IS NOT NULL OR calls.pickup_date IS NOT NULL)
      )
      * 100,
      1
    ) AS service_level;
    `;

    const result = await query(sql);
    
    // Define a type for the expected result structure
    type ServiceLevelResult = {
      service_level: number | string | null;
    };
    
    // Check if result is an array before accessing length property
    if (!result || !Array.isArray(result) || result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data found' },
        { status: 404 }
      );
    }
    
    // Use type assertion for the data
    const data = result[0] as ServiceLevelResult;
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'No data found' },
        { status: 404 }
      );
    }
    // Return the service level data

    // Ensure service_level is a valid number, default to 0 if not
    let serviceLevel = 0;
    if (data.service_level !== null && data.service_level !== undefined) {
      if (typeof data.service_level === 'string') {
        serviceLevel = parseFloat(data.service_level);
      } else if (typeof data.service_level === 'number') {
        serviceLevel = data.service_level;
      }
    }
    
    return NextResponse.json({
      serviceLevel: serviceLevel,
      success: true
    });
  } catch (error) {
    console.error('Error fetching service level data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service level data' },
      { status: 500 }
    );
  }
}
