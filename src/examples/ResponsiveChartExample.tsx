import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ChartContainer from '../components/ChartContainer';
import WidgetCard from '../components/WidgetCard';

/**
 * Example component demonstrating how to create a responsive chart
 * using Highcharts, ChartContainer, and Tailwind CSS.
 *
 * This example shows a simple column chart that adapts to different screen sizes.
 */
const ResponsiveChartExample: React.FC = () => {
  // Sample data for the chart
  const data = [
    { name: 'Jan', y: 29 },
    { name: 'Feb', y: 71 },
    { name: 'Mar', y: 106 },
    { name: 'Apr', y: 129 },
    { name: 'May', y: 144 },
    { name: 'Jun', y: 176 }
  ];

  // Highcharts configuration with responsive options
  const options = {
    chart: {
      type: 'column',
      // Setting height and width to null allows the chart to adapt to its container
      height: null,
      width: null,
      // Remove margins to maximize chart area
      marginTop: 10,
      marginBottom: 30,
      // Ensure chart doesn't overflow its container
      style: {
        overflow: 'visible'
      }
    },
    title: {
      text: null // Remove title to save space
    },
    xAxis: {
      categories: data.map(item => item.name),
      labels: {
        // Responsive font size using CSS clamp
        style: {
          fontSize: '12px'
        }
      }
    },
    yAxis: {
      title: {
        text: null // Remove title to save space
      },
      labels: {
        // Responsive font size
        style: {
          fontSize: '12px'
        }
      }
    },
    // Responsive configuration for different screen sizes
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            enabled: false
          },
          xAxis: {
            labels: {
              style: {
                fontSize: '10px'
              }
            }
          },
          yAxis: {
            labels: {
              style: {
                fontSize: '10px'
              }
            }
          }
        }
      }]
    },
    // Tooltip configuration
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    // Disable credits
    credits: {
      enabled: false
    },
    // Series data
    series: [{
      name: 'Total Calls',
      data: data.map(item => item.y),
      colorByPoint: true,
      dataLabels: {
        enabled: true,
        // Responsive font size using CSS clamp
        style: {
          fontSize: 'clamp(10px, 2vw, 14px)',
          textOutline: 'none',
          fontWeight: 'normal'
        }
      }
    }]
  };

  return (
    <WidgetCard title="Total Calls" tooltipPosition="right">
      <ChartContainer>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{
            className: 'w-full h-full',
            style: { width: '100%', height: '100%', minWidth: 0, minHeight: 0 }
          }}
          immutable={false}
          allowChartUpdate={true}
        />
      </ChartContainer>
    </WidgetCard>
  );
};

export default ResponsiveChartExample;
