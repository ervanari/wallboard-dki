import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {

    const sql = `
        SELECT
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
              SEC_TO_TIME(AVG(TIME_TO_SEC(IFNULL(TIMEDIFF(calls.dropcall_date, calls.pickup_date), '00:00:00')))),
            '%H:%i:%s'
          ) USING utf8mb4),
          '00:00:00'
        )
        FROM calls
        WHERE
          calls.direction_id = 1
          AND calls.media_status_id = 12
          AND calls.call_date >= CURDATE()
          AND calls.call_date < CURDATE() + INTERVAL 1 DAY
      ) AS avg_acd,

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
          AND calls.call_date >= CURDATE()
          AND calls.call_date < CURDATE() + INTERVAL 1 DAY
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
                  AND calls.call_date >= CURDATE()
                  AND calls.call_date < CURDATE() + INTERVAL 1 DAY
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
                  AND calls.call_date >= CURDATE()
                  AND calls.call_date < CURDATE() + INTERVAL 1 DAY
              )
            )
          ),
          '%H:%i:%s'
        )
      ) AS avg_aht,

      (
        SELECT ROUND(
          (
            (
              SELECT COUNT(calls.id)
              FROM calls
              WHERE
                calls.direction_id = 1
                AND calls.call_date
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
                  AND calls.call_date
              ) +
              (
                SELECT COUNT(calls.id)
                FROM calls
                WHERE
                  calls.direction_id = 1
                  AND calls.media_status_id = 12
                  AND calls.call_date
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
              AND calls.call_date
              AND (calls.hangup_date IS NOT NULL OR calls.pickup_date IS NOT NULL)
          )
          * 100,
          1
        )
      ) AS service_level;

    `;

    const result = await query(sql);

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
    // Return the service level data

    console.log('Service Level Data:', data);
    // Ensure service_level is a valid number, default to 0 if not
    const serviceLevel = data.service_level !== null && data.service_level !== undefined ?
      parseFloat(data.service_level) : 0;

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
