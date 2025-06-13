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
  const complaintData = data?.complaintData || [
    { name: 'Transaksi Gagal', count: 65 },
    { name: 'Layanan Lambat', count: 52 },
    { name: 'Biaya Admin', count: 48 },
    { name: 'ATM Rusak', count: 42 },
    { name: 'Mobile Banking Error', count: 38 },
    { name: 'Antrian Panjang', count: 35 },
    { name: 'Lainnya', count: 28 }
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
      name: 'Complaint',
      data: complaintData.map(item => item.count)
    }],
    colors: ['#EA4335', '#EB6859', '#ED8B7E', '#F0AEA3', '#F2D1C8', '#F5F4ED', '#F8F8F2']
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
