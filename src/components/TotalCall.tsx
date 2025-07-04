'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import WidgetCard from './WidgetCard';
import ChartContainer from './ChartContainer';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { useTheme } from '@/context/ThemeContext';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TotalCall: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/total-call', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const totalCallData = data?.totalCallData || [];

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const totalAnswered = totalCallData.reduce((sum: number, item: any) => sum + (item.answered || 0), 0);
  const totalAbandoned = totalCallData.reduce((sum: number, item: any) => sum + (item.abandon || 0), 0);
  const totalCalls = totalAnswered + totalAbandoned;

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
      marginTop: 0,
      marginBottom: 80,
      style: {
        overflow: 'visible'
      }
    },
    title: null,
    xAxis: {
      categories: hours.map((hour: number) => `${hour.toString().padStart(2, '0')}:00`),
      title: {
        text: 'Hour',
        style: {
          color: isDarkMode ? '#fff' : '#000'
        }
      },
      labels: {
        style: {
          fontSize: 'clamp(7px, 1.5vw, 9px)',
          color: isDarkMode ? '#fff' : '#000'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Number of Calls',
        style: {
          color: isDarkMode ? '#fff' : '#000'
        }
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'normal',
          color: isDarkMode ? '#fff' : '#000',
          fontSize: 'clamp(7px, 1.5vw, 9px)'
        }
      },
      labels: {
        style: {
          fontSize: 'clamp(7px, 1.5vw, 9px)',
          color: isDarkMode ? '#fff' : '#000'
        }
      }
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
      backgroundColor: isDarkMode ? '#374151' : '#fff',
      style: {
        color: isDarkMode ? '#fff' : '#000'
      }
    },
    plotOptions: {
      line: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          style: {
            fontSize: 'clamp(7px, 1.5vw, 9px)',
            fontWeight: 'normal',
            color: isDarkMode ? '#fff' : '#000',
            textOutline: isDarkMode ? '1px contrast' : 'none'
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
              fontSize: '8px',
              color: isDarkMode ? '#fff' : '#000'
            }
          },
          xAxis: {
            labels: {
              style: {
                fontSize: '8px',
                color: isDarkMode ? '#fff' : '#000'
              }
            }
          },
          yAxis: {
            labels: {
              style: {
                fontSize: '8px',
                color: isDarkMode ? '#fff' : '#000'
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
      layout: 'horizontal',
      itemStyle: {
        color: isDarkMode ? '#fff' : '#000'
      }
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
