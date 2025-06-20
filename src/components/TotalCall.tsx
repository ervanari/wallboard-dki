'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TotalCall: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/total-call', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const totalCallData = data?.totalCallData || [];

  // Process data for the chart
  const hours = Array.from(new Set(totalCallData.map((item: any) => item.call_hour))).sort();
  // const hours = Array.from(new Set(totalCallData.map((item: any) => item.call_hour.toString().slice(0, 2)))).sort();

  // Calculate total answered and abandoned calls
  const totalAnswered = totalCallData.reduce((sum: number, item: any) => sum + (item.answered || 0), 0);
  const totalAbandoned = totalCallData.reduce((sum: number, item: any) => sum + (item.abandon || 0), 0);
  const totalCalls = totalAnswered + totalAbandoned;

  // Prepare data for hourly chart
  const answeredByHour = hours.map(hour => {
    const hourData = totalCallData.filter((item: any) => item.call_hour === hour);
    return hourData.reduce((sum: number, item: any) => sum + (item.answered || 0), 0);
  });

  const abandonedByHour = hours.map(hour => {
    const hourData = totalCallData.filter((item: any) => item.call_hour === hour);
    return hourData.reduce((sum: number, item: any) => sum + (item.abandon || 0), 0);
  });

  const options = {
    chart: {
      type: 'column',
      height: '180px',
      backgroundColor: 'transparent'
    },
    title: null,
    xAxis: {
      categories: hours.map(hour => `${hour}`),
      title: {
        text: 'Hour'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Number of Calls'
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
      column: {
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
        name: 'Answered',
        data: answeredByHour,
        color: '#34A853'
      },
      {
        name: 'Abandoned',
        data: abandonedByHour,
        color: '#EA4335'
      }
    ]
  };

  if (isLoading) return (
      <Loading title="Total Calls" />
  );

  if (error) return (
      <Error title="Total Calls" />
  );

  return (
    <WidgetCard title="Total Call" tooltipPosition="right">
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
