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

const TicketPermohonan: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/ticket-permohonan', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const chartRef = React.useRef<any>(null);

  // Effect to resize chart when container size changes
  React.useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartRef.current.chart) {
        chartRef.current.chart.reflow();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Default values if data is not loaded yet
  const requestData = data?.requestData || [];

  const options = {
    chart: {
      type: 'bar',
      height: null,
      width: null,
      backgroundColor: 'transparent',
      marginTop: 0,
      marginBottom: 0,
      style: {
        overflow: 'visible'
      }
    },
    title: null,
    xAxis: {
      categories: requestData.map((item: { name: any; }) => item.name),
      title: {
        text: null
      },
      labels: {
        style: {
          fontSize: 'clamp(10px, 1.5vw, 12px)',
          color: isDarkMode ? '#fff' : '#000'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Jumlah Ticket',
        align: 'high',
        style: {
          fontSize: 'clamp(7px, 1.5vw, 9px)',
          color: isDarkMode ? '#fff' : '#000'
        }
      },
      labels: {
        overflow: 'justify',
        style: {
          fontSize: 'clamp(7px, 1.5vw, 9px)',
          color: isDarkMode ? '#fff' : '#000'
        }
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: isDarkMode ? '#fff' : 'gray',
          fontSize: 'clamp(7px, 1.5vw, 9px)'
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
      bar: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          style: {
            fontSize: 'clamp(9px, 1.5vw, 11px)',
            textOutline: isDarkMode ? '1px contrast' : 'none',
            fontWeight: 'normal',
            color: isDarkMode ? '#fff' : '#000'
          }
        }
      }
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 1366
          },
          chartOptions: {
            chart: {
              marginBottom: 70,
            },
            legend: {
              itemStyle: {
                fontSize: '9px'
              },
              symbolHeight: 8,
              symbolWidth: 8,
              symbolRadius: 4
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
              },
              stackLabels: {
                style: {
                  fontSize: '9px'
                }
              }
            },
            plotOptions: {
              bar: {
                dataLabels: {
                  style: {
                    fontSize: '9px'
                  }
                }
              }
            }
          }
        },
        {
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
        }
      ]
    },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: {
        fontSize: 'clamp(8px, 1.5vw, 10px)',
        color: isDarkMode ? '#fff' : '#000'
      }
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'Contact Center',
        data: requestData.map((item: { contact_center: any; }) => item.contact_center),
        color: '#2c62c2'
      },
      {
        name: 'Kantor Cabang',
        data: requestData.map((item: { kc: any; }) => item.kc),
        color: '#e96812'
      }
    ]
  };

  if (isLoading) return (
      <Loading title="Ticket Permohonan" />
  );

  if (error) return (
      <Error title="Ticket Permohonan" />
  );

  return (
    <WidgetCard title="Ticket Permohonan" tooltipPosition="bottom">
      <ChartContainer>
        <HighchartsReact
          ref={chartRef}
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

export default TicketPermohonan;
