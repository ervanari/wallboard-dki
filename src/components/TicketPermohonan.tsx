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

const TicketPermohonan: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/ticket-permohonan', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const requestData = data?.requestData || [];

  const options = {
    chart: {
      type: 'bar',
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
      categories: requestData.map((item: { name: any; }) => item.name),
      title: {
        text: null
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
        text: 'Jumlah Ticket',
        align: 'high',
        style: {
          fontSize: 'clamp(10px, 1.5vw, 12px)'
        }
      },
      labels: {
        overflow: 'justify',
        style: {
          fontSize: 'clamp(10px, 1.5vw, 12px)'
        }
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: 'gray',
          fontSize: 'clamp(10px, 1.5vw, 12px)'
        }
      }
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      bar: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          style: {
            fontSize: 'clamp(9px, 1.5vw, 11px)',
            textOutline: 'none',
            fontWeight: 'normal'
          }
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
      layout: 'horizontal',
      itemStyle: {
        fontSize: 'clamp(8px, 1.5vw, 10px)'
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
