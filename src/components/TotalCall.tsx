'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TotalCall: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/total-call', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const callData = data?.callData || [
    { time: '08:00', inbound: 45, outbound: 32 },
    { time: '09:00', inbound: 78, outbound: 41 },
    { time: '10:00', inbound: 95, outbound: 53 },
    { time: '11:00', inbound: 83, outbound: 47 },
    { time: '12:00', inbound: 65, outbound: 38 },
    { time: '13:00', inbound: 72, outbound: 43 },
    { time: '14:00', inbound: 88, outbound: 51 },
    { time: '15:00', inbound: 92, outbound: 49 },
    { time: '16:00', inbound: 75, outbound: 45 }
  ];

  const options = {
    chart: {
      type: 'line',
      height: '180px',
      backgroundColor: 'transparent'
    },
    title: null,
    xAxis: {
      categories: callData.map((item: any) => item.time),
      labels: {
        style: {
          fontSize: '9px'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Number of Calls'
      },
      min: 0
    },
    legend: {
      align: 'center',
      verticalAlign: 'top',
      layout: 'horizontal'
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          radius: 3
        }
      }
    },
    series: [
      {
        name: 'Inbound',
        data: callData.map((item: any) => item.inbound),
        color: '#4285F4'
      },
      {
        name: 'Outbound',
        data: callData.map((item: any) => item.outbound),
        color: '#34A853'
      }
    ],
    credits: {
      enabled: false
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 250
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  };

  if (isLoading) return <WidgetCard title="Total Call">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Total Call">Error loading data</WidgetCard>;

  return (
    <WidgetCard title="Total Call">
      <div className="total-call-chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </WidgetCard>
  );
};

export default TotalCall;
