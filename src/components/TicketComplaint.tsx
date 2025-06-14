'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TicketComplaint: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/ticket-complaint', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  console.log('TicketComplaint data:', data);
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
      height: '180px',
      backgroundColor: 'transparent'
    },
    title: null,
    xAxis: {
      categories: complaintData.map(item => item.name),
      title: {
        text: null
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Jumlah Complaint',
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
      layout: 'horizontal'
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'Contact Center',
        data: complaintData.map(item => item.contact_center),
        color: '#EA4335'
      },
      {
        name: 'Kantor Cabang',
        data: complaintData.map(item => item.kc),
        color: '#FBBC05'
      }
    ]
  };

  if (isLoading) return <WidgetCard title="Ticket Complaint">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Ticket Complaint">Error loading data</WidgetCard>;

  return (
    <WidgetCard title="Ticket Complaint">
      <div className="ticket-complaint-chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </WidgetCard>
  );
};

export default TicketComplaint;
