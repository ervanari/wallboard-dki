'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TicketPermohonan: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/ticket-permohonan', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const requestData = data?.requestData || [
    { name: 'Informasi Produk', count: 85 },
    { name: 'Pembukaan Rekening', count: 72 },
    { name: 'Kartu ATM', count: 65 },
    { name: 'Mobile Banking', count: 58 },
    { name: 'Internet Banking', count: 45 },
    { name: 'Kredit', count: 38 },
    { name: 'Deposito', count: 32 }
  ];

  const options = {
    chart: {
      type: 'bar',
      height: '180px',
      backgroundColor: 'transparent'
    },
    title: null,
    xAxis: {
      categories: requestData.map(item => item.name),
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
      }
    },
    tooltip: {
      valueSuffix: ' tickets'
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        },
        colorByPoint: true
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Permohonan',
      data: requestData.map(item => item.count)
    }],
    colors: ['#4285F4', '#5E97F6', '#7BAAF7', '#99BDF8', '#B6D0F9', '#D3E3FB', '#F1F8FE']
  };

  if (isLoading) return <WidgetCard title="Ticket Permohonan">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Ticket Permohonan">Error loading data</WidgetCard>;

  return (
    <WidgetCard title="Ticket Permohonan">
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
