'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TotalTicketKantorCabang: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/total-ticket-kantor-cabang', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const ticketData = data?.ticketData || [
    { date: '01/05', count: 32 },
    { date: '02/05', count: 38 },
    { date: '03/05', count: 35 },
    { date: '04/05', count: 42 },
    { date: '05/05', count: 48 },
    { date: '06/05', count: 45 },
    { date: '07/05', count: 52 },
    { date: '08/05', count: 58 },
    { date: '09/05', count: 55 },
    { date: '10/05', count: 62 }
  ];

  const totalTickets = ticketData.reduce((sum: number, item: any) => sum + item.count, 0);
  const dailyAverage = Math.round(totalTickets / ticketData.length);
  const todayTickets = ticketData[ticketData.length - 1]?.count || 0;
  const percentChange = Math.round(((todayTickets - dailyAverage) / dailyAverage) * 100);

  const options = {
    chart: {
      type: 'area',
      height: '180px',
      backgroundColor: 'transparent'
    },
    title: null,
    xAxis: {
      categories: ticketData.map((item: any) => item.date),
      labels: {
        style: {
          fontSize: '8px'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Tickets'
      },
      min: 0
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, 'rgba(106, 90, 205, 0.6)'],
            [1, 'rgba(106, 90, 205, 0.1)']
          ]
        },
        lineColor: '#6A5ACD',
        marker: {
          radius: 3,
          fillColor: '#6A5ACD'
        }
      }
    },
    series: [{
      name: 'Tickets',
      data: ticketData.map((item: any) => item.count)
    }],
    credits: {
      enabled: false
    }
  };

  if (isLoading) return <WidgetCard title="Total Ticket Kantor Cabang">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Total Ticket Kantor Cabang">Error loading data</WidgetCard>;

  return (
    <WidgetCard title="Total Ticket Kantor Cabang">
      <div className="ticket-chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </WidgetCard>
  );
};

export default TotalTicketKantorCabang;
