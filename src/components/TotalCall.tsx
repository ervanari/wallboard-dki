'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import WidgetCard from './WidgetCard';
import ChartContainer from './ChartContainer';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TotalCall: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/total-call', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const totalCallData = data?.totalCallData || [];
  console.log('Total Call Data:', totalCallData);

  // Process data for the chart
  const hours = Array.from(new Set(totalCallData.map((item: any) => item.call_hour))).sort() as number[];

  // Calculate total answered and abandoned calls
  const totalAnswered = totalCallData.reduce((sum: number, item: any) => sum + (item.answered || 0), 0);
  const totalAbandoned = totalCallData.reduce((sum: number, item: any) => sum + (item.abandon || 0), 0);
  const totalCalls = totalAnswered + totalAbandoned;

  // Prepare data for hourly chart
  const answeredByHour = hours.map((hour: number) => {
    const hourData = totalCallData.filter((item: any) => item.call_hour === hour);
    return hourData.reduce((sum: number, item: any) => sum + (item.answered || 0), 0);
  });

  const abandonedByHour = hours.map((hour: number) => {
    const hourData = totalCallData.filter((item: any) => item.call_hour === hour);
    return hourData.reduce((sum: number, item: any) => sum + (item.abandon || 0), 0);
  });

  const options = {
    chart: {
      type: 'line',
      height: null,
      width: null,
      backgroundColor: 'transparent',
      marginTop: 10,
      marginBottom: 80,
      style: {
        overflow: 'visible'
      }
    },
    title: null,
    xAxis: {
      categories: hours.map((hour: number) => `${hour.toString().padStart(2, '0')}:00`),
      title: {
        text: 'Hour'
      },
      labels: {
        style: {
          fontSize: 'clamp(10px, 1.5vw, 12px)'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Number of Calls'
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'normal',
          color: 'gray',
          fontSize: 'clamp(10px, 1.5vw, 12px)'
        }
      },
      labels: {
        style: {
          fontSize: 'clamp(10px, 1.5vw, 12px)'
        }
      }
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      line: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          style: {
            fontSize: 'clamp(9px, 1.5vw, 11px)',
            fontWeight: 'normal'
          }
        },
        marker: {
          enabled: true
        }
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            itemStyle: {
              fontSize: '10px'
            }
          },
          xAxis: {
            labels: {
              style: {
                fontSize: '9px'
              }
            }
          },
          yAxis: {
            labels: {
              style: {
                fontSize: '9px'
              }
            }
          }
        }
      }]
    },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal'
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'Answered',
        data: answeredByHour,
        color: '#34A853'
      },
      {
        name: 'Abandoned',
        data: abandonedByHour,
        color: '#EA4335'
      }
    ]
  };

  if (isLoading) return (
      <Loading title="Total Calls" />
  );

  if (error) return (
      <Error title="Total Calls" />
  );

  return (
    <WidgetCard title="Total Call" tooltipPosition="right">
      <ChartContainer>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{
            className: 'w-full h-full',
          }}
          immutable={false}
          allowChartUpdate={true}
        />
      </ChartContainer>
    </WidgetCard>
  );
};

export default TotalCall;
