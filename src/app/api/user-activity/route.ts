import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch user activity data from the database using the query from user_activity.txt
    const userActivityResult = await query(`
      SELECT
        -- login_count
        (SELECT COUNT(\`users\`.\`id\`)
         FROM \`users\`
         JOIN \`user_levels\` ON \`users\`.\`user_level_id\` = \`user_levels\`.\`id\`
         WHERE \`users\`.\`user_activity_id\` > 1
         AND \`users\`.\`last_activity_time\`
         AND \`users\`.\`ext_inbound\` <> 0
         AND \`users\`.\`department_id\` = 1
         AND (\`user_levels\`.\`is_agent\` = 1 OR \`user_levels\`.\`is_spv\` = 1)) AS \`login_count\`,

        -- not_available
        (SELECT COUNT(\`users\`.\`id\`)
         FROM \`users\`
         JOIN \`user_levels\` ON \`users\`.\`user_level_id\` = \`user_levels\`.\`id\`
         WHERE \`users\`.\`user_activity_id\` = 2
         AND \`users\`.\`last_activity_time\`
         AND \`users\`.\`ext_inbound\` <> 0
         AND \`users\`.\`department_id\` = 1
         AND (\`user_levels\`.\`is_agent\` = 1 OR \`user_levels\`.\`is_spv\` = 1)) AS \`not_available\`,

        -- ready_in
        (SELECT COUNT(\`users\`.\`id\`)
         FROM \`users\`
         JOIN \`user_levels\` ON \`users\`.\`user_level_id\` = \`user_levels\`.\`id\`
         WHERE \`users\`.\`user_activity_id\` = 3
         AND \`users\`.\`last_activity_time\`
         AND \`users\`.\`ext_inbound\` <> 0
         AND \`users\`.\`department_id\` = 1
         AND (\`user_levels\`.\`is_agent\` = 1 OR \`user_levels\`.\`is_spv\` = 1)) AS \`ready_in\`,

        -- online_in
        (SELECT COUNT(\`users\`.\`id\`)
         FROM \`users\`
         JOIN \`user_levels\` ON \`users\`.\`user_level_id\` = \`user_levels\`.\`id\`
         WHERE \`users\`.\`user_activity_id\` = 4
         AND \`users\`.\`last_activity_time\`
         AND \`users\`.\`ext_inbound\` <> 0
         AND \`users\`.\`department_id\` = 1
         AND (\`user_levels\`.\`is_agent\` = 1 OR \`user_levels\`.\`is_spv\` = 1)) AS \`online_in\`,

        -- paperwork
        (SELECT COUNT(\`users\`.\`id\`)
         FROM \`users\`
         JOIN \`user_levels\` ON \`users\`.\`user_level_id\` = \`user_levels\`.\`id\`
         WHERE \`users\`.\`user_activity_id\` = 14
         AND \`users\`.\`last_activity_time\`
         AND \`users\`.\`ext_inbound\` <> 0
         AND \`users\`.\`department_id\` = 1
         AND (\`user_levels\`.\`is_agent\` = 1 OR \`user_levels\`.\`is_spv\` = 1)) AS \`paperwork\`,

        -- break_user
        (SELECT COUNT(\`users\`.\`id\`)
         FROM \`users\`
         JOIN \`user_levels\` ON \`users\`.\`user_level_id\` = \`user_levels\`.\`id\`
         WHERE \`users\`.\`user_activity_id\` = 6
         AND \`users\`.\`last_activity_time\`
         AND \`users\`.\`ext_inbound\` <> 0
         AND \`users\`.\`department_id\` = 1
         AND (\`user_levels\`.\`is_agent\` = 1 OR \`user_levels\`.\`is_spv\` = 1)) AS \`break_user\`
    `);

    // Define a type for the activity counts
    type ActivityCounts = {
      login_count: number;
      not_available: number;
      ready_in: number;
      online_in: number;
      paperwork: number;
      break_user: number;
    };

    // Format the data for the UI component with proper type assertion
    const activityCounts = Array.isArray(userActivityResult) && userActivityResult.length > 0
      ? userActivityResult[0] as ActivityCounts
      : {
          login_count: 0,
          not_available: 0,
          ready_in: 0,
          online_in: 0,
          paperwork: 0,
          break_user: 0
        };

    // Create an array of agent data objects that the UI component expects
    const agentData = [
      {
        name: 'Total Logged In',
        status: 'active',
        duration: '-',
        activity: `${activityCounts.login_count} agents`
      },
      {
        name: 'Not Available',
        status: 'offline',
        duration: '-',
        activity: `${activityCounts.not_available} agents`
      },
      {
        name: 'Ready',
        status: 'idle',
        duration: '-',
        activity: `${activityCounts.ready_in} agents`
      },
      {
        name: 'On Call',
        status: 'active',
        duration: '-',
        activity: `${activityCounts.online_in} agents`
      },
      {
        name: 'Paperwork',
        status: 'idle',
        duration: '-',
        activity: `${activityCounts.paperwork} agents`
      },
      {
        name: 'Break',
        status: 'break',
        duration: '-',
        activity: `${activityCounts.break_user} agents`
      }
    ];

    return NextResponse.json({
      agentData: agentData,
      activityCounts: activityCounts,
      success: true
    });
  } catch (error) {
    console.error('Error fetching user activity data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user activity data' },
      { status: 500 }
    );
  }
}
