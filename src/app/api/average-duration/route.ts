import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch data from the database using the query from service_level&avg_duration.txt
    const result = await query(`
SELECT
    -- Average Speed of Answer (ASA)
    (SELECT IFNULL(
        CONVERT(
            TIME_FORMAT(
                ROUND(SEC_TO_TIME(AVG(TIMEDIFF(calls.pickup_date, calls.ringing_date))), 0),
                '%H:%i:%s'
            ) USING utf8mb4
        ),
        '00:00:00'
    )
    FROM calls
    WHERE calls.call_date >= CURDATE()
        AND calls.call_date < CURDATE() + INTERVAL 1 DAY
        AND calls.direction_id = 1
        AND calls.media_status_id = 12
    ) AS avg_asa,

    -- Average Call Duration (ACD)
    (SELECT IFNULL(
        CONVERT(
            TIME_FORMAT(
                SEC_TO_TIME(AVG(TIME_TO_SEC(IFNULL(TIMEDIFF(calls.dropcall_date, calls.pickup_date), '00:00:00')))),
                '%H:%i:%s'
            ) USING utf8mb4
        ),
        '00:00:00'
    )
    FROM calls
    WHERE calls.direction_id = 1
        AND calls.media_status_id = 12
        AND calls.call_date >= CURDATE()
        AND calls.call_date < CURDATE() + INTERVAL 1 DAY
    ) AS avg_acd,

    -- Average After Call Work (ACW)
    (SELECT IFNULL(
        CONVERT(
            TIME_FORMAT(
                SEC_TO_TIME(AVG(TIME_TO_SEC(IFNULL(calls.acw_duration, '00:00:00')))),
                '%H:%i:%s'
            ) USING utf8mb4
        ),
        '00:00:00'
    )
    FROM calls
    WHERE calls.direction_id = 1
        AND calls.media_status_id = 12
        AND calls.call_date >= CURDATE()
        AND calls.call_date < CURDATE() + INTERVAL 1 DAY
    ) AS avg_acw,

    -- Average Handle Time (AHT) = ACD + ACW
    (SELECT TIME_FORMAT(
        SEC_TO_TIME(
            TIME_TO_SEC(
                (SELECT IFNULL(
                    CONVERT(
                        TIME_FORMAT(
                            SEC_TO_TIME(AVG(TIME_TO_SEC(IFNULL(TIMEDIFF(calls.dropcall_date, calls.pickup_date), '00:00:00')))),
                            '%H:%i:%s'
                        ) USING utf8mb4
                    ),
                    '00:00:00'
                )
                FROM calls
                WHERE calls.direction_id = 1
                    AND calls.media_status_id = 12
                    AND calls.call_date >= CURDATE()
                    AND calls.call_date < CURDATE() + INTERVAL 1 DAY
                )
            ) +
            TIME_TO_SEC(
                (SELECT IFNULL(
                    CONVERT(
                        TIME_FORMAT(
                            SEC_TO_TIME(AVG(TIME_TO_SEC(IFNULL(calls.acw_duration, '00:00:00')))),
                            '%H:%i:%s'
                        ) USING utf8mb4
                    ),
                    '00:00:00'
                )
                FROM calls
                WHERE calls.direction_id = 1
                    AND calls.media_status_id = 12
                    AND calls.call_date >= CURDATE()
                    AND calls.call_date < CURDATE() + INTERVAL 1 DAY
                )
            )
        ),
        '%H:%i:%s'
    )) AS avg_aht;
    `);

    if (!result || !Array.isArray(result) || result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data found' },
        { status: 404 }
      );
    }

    // Add type assertion for the database result
    type ResultRow = {
      avg_acd?: string;
      avg_asa?: string;
      avg_aht?: string;
      avg_acw?: string;
    };
    
    const data = result[0] as ResultRow;
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
