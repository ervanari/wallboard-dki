'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TotalTicketCallCenter: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/total-ticket-call-center', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const ticketData = data?.ticketData || [
    { date: '01/05', count: 45 },
    { date: '02/05', count: 52 },
    { date: '03/05', count: 48 },
    { date: '04/05', count: 58 },
    { date: '05/05', count: 63 },
    { date: '06/05', count: 57 },
    { date: '07/05', count: 65 },
    { date: '08/05', count: 71 },
    { date: '09/05', count: 68 },
    { date: '10/05', count: 75 }
  ];

  const totalTickets = ticketData.reduce((sum: number, item: any) => sum + item.count, 0);
  const dailyAverage = Math.round(totalTickets / ticketData.length);
  const todayTickets = ticketData[ticketData.length - 1]?.count || 0;
  const percentChange = Math.round(((todayTickets - dailyAverage) / dailyAverage) * 100);

  console.log('Total Tickets:', totalTickets);
    console.log('Daily Average:', dailyAverage);
    console.log('Today Tickets:', percentChange);
    
  const options = {
    chart: {
      type: 'column',
      height: '180px',
      backgroundColor: 'transparent'
    },
    title: null,
    xAxis: {
      categories: ticketData.map((item: any) => item.date),
      labels: {
        style: {
          fontSize: '9px'
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
      column: {
        borderRadius: 3,
        color: '#4285F4'
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

  if (isLoading) return <WidgetCard title="Total Ticket Call Center">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Total Ticket Call Center">Error loading data</WidgetCard>;

  return (
      <>
        <WidgetCard title="Total Ticket Call Center">
          <div className="p-3 rounded-lg">
            <div className="flex items-center">
              <div className="text-sm mr-3 w-32">Permohonan</div>
              <div
                  className="bg-[#4472c4] h-6"
                  style={{ width: `${percentChange}%` }}
              ></div>
            </div>
          </div>
          
          <div className="p-3 rounded-lg">
            <div className="flex items-center">
              <div className="text-sm mr-3 w-32">Komplaint</div>
              <div
                  className="bg-[#4472c4] h-6"
                  style={{ width: `${percentChange}%` }}
              ></div>
            </div>
          </div>
          {/*<div className="ticket-chart">*/}
          {/*  <HighchartsReact*/}
          {/*    highcharts={Highcharts}*/}
          {/*    options={options}*/}
          {/*  />*/}
          {/*</div>*/}
        </WidgetCard>
      </>
  );
};

export default TotalTicketCallCenter;
