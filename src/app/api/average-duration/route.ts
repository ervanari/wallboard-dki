import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch data from the database using the query from service_level&avg_duration.txt
    const result = await query(`
      SELECT
        (
          SELECT IFNULL(
            CONVERT(
              TIME_FORMAT(
                SEC_TO_TIME(AVG(TIME_TO_SEC(IFNULL(TIMEDIFF(calls.dropcall_date, calls.pickup_date), '00:00:00')))),
              '%H:%i:%s'
            ) USING utf8mb4),
            '00:00:00'
          )
          FROM calls
          WHERE
            calls.direction_id = 1
            AND calls.media_status_id = 12
            AND calls.call_date
        ) AS avg_acd,

        (
          SELECT
            IFNULL(
              CONVERT(
                TIME_FORMAT(
                  ROUND(SEC_TO_TIME(AVG(TIMEDIFF(calls.pickup_date, calls.ringing_date))), 0),
                '%H:%i:%s') USING utf8mb4),
              '00:00:00'
            )
          FROM calls
          WHERE
            calls.call_date >= CURDATE()
            AND calls.call_date < CURDATE() + INTERVAL 1 DAY
            AND calls.direction_id = 1
            AND calls.media_status_id = 12
        ) AS avg_asa,

        (
          SELECT IFNULL(
            CONVERT(
              TIME_FORMAT(
                SEC_TO_TIME(AVG(TIME_TO_SEC(IFNULL(calls.acw_duration, '00:00:00')))),
              '%H:%i:%s'
            ) USING utf8mb4),
            '00:00:00'
          )
          FROM calls
          WHERE
            calls.direction_id = 1
            AND calls.media_status_id = 12
            AND calls.call_date
        ) AS avg_acw,

        (
          SELECT TIME_FORMAT(
            SEC_TO_TIME(
              TIME_TO_SEC(
                (
                  SELECT IFNULL(
                    CONVERT(
                      TIME_FORMAT(
                        SEC_TO_TIME(AVG(TIME_TO_SEC(IFNULL(TIMEDIFF(calls.dropcall_date, calls.pickup_date), '00:00:00')))),
                      '%H:%i:%s'
                    ) USING utf8mb4),
                    '00:00:00'
                  )
                  FROM calls
                  WHERE
                    calls.direction_id = 1
                    AND calls.media_status_id = 12
                    AND calls.call_date
                )
              ) +
              TIME_TO_SEC(
                (
                  SELECT IFNULL(
                    CONVERT(
                      TIME_FORMAT(
                        SEC_TO_TIME(AVG(TIME_TO_SEC(IFNULL(calls.acw_duration, '00:00:00')))),
                      '%H:%i:%s'
                    ) USING utf8mb4),
                    '00:00:00'
                  )
                  FROM calls
                  WHERE
                    calls.direction_id = 1
                    AND calls.media_status_id = 12
                    AND calls.call_date
                )
              )
            ),
            '%H:%i:%s'
          )
        ) AS avg_aht
    `);

    console.log('Average Duration Data:', result);

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data found' },
        { status: 404 }
      );
    }

    const data = result[0];
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'No data found' },
        { status: 404 }
      );
    }

    // Map the query results to the expected format in the component
    return NextResponse.json({
      acd: data.avg_acd || '00:00:00',
      asa: data.avg_asa || '00:00:00',
      aht: data.avg_aht || '00:00:00',
      acw: data.avg_acw || '00:00:00',
      success: true
    });
  } catch (error) {
    console.error('Error fetching average duration data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch average duration data' },
      { status: 500 }
    );
  }
}
