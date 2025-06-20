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

const TicketComplaint: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/ticket-complaint', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const complaintData = data?.complaintData || [
    { name: 'Transaksi Gagal', count: 65, contact_center: 40, kc: 25 },
    { name: 'Layanan Lambat', count: 52, contact_center: 30, kc: 22 },
    { name: 'Biaya Admin', count: 48, contact_center: 28, kc: 20 },
    { name: 'ATM Rusak', count: 42, contact_center: 25, kc: 17 },
    { name: 'Mobile Banking Error', count: 38, contact_center: 22, kc: 16 },
    { name: 'Antrian Panjang', count: 35, contact_center: 20, kc: 15 },
    { name: 'Lainnya', count: 28, contact_center: 15, kc: 13 }
  ];

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
      categories: complaintData.map((item: { name: any; }) => item.name),
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
        text: 'Jumlah Complaint',
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
        data: complaintData.map((item: { contact_center: any; }) => item.contact_center),
        color: '#2c62c2'
      },
      {
        name: 'Kantor Cabang',
        data: complaintData.map((item: { kc: any; }) => item.kc),
        color: '#e96812'
      }
    ]
  };

  if (isLoading) return (
      <Loading title="Ticket Complaint" />
  );

  if (error) return (
      <Error title="Ticket Complaint" />
  );

  return (
    <WidgetCard title="Ticket Complaint" tooltipPosition="bottom">
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

export default TicketComplaint;
