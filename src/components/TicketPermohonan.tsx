'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TicketPermohonan: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/ticket-permohonan', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  console.log('TicketPermohonan data:', data);
  const requestData = data?.requestData || [];

  const options = {
    chart: {
      type: 'bar',
      height: '180px',
      backgroundColor: 'transparent'
    },
    title: null,
    xAxis: {
      categories: requestData.map((item: { name: any; }) => item.name),
      title: {
        text: null
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Jumlah Ticket',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: 'gray'
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
          enabled: true
        }
      }
    },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      fontSize: '8px',
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'Contact Center',
        data: requestData.map((item: { contact_center: any; }) => item.contact_center),
        color: '#4285F4'
      },
      {
        name: 'Kantor Cabang',
        data: requestData.map((item: { kc: any; }) => item.kc),
        color: '#34A853'
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
      <div className="ticket-permohonan-chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </WidgetCard>
  );
};

export default TicketPermohonan;
