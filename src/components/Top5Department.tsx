'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Top5Department: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/top-departments', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const departmentData = data?.departmentData || [
    { name: 'Customer Service', count: 145 },
    { name: 'IT Support', count: 98 },
    { name: 'Finance', count: 76 },
    { name: 'Operations', count: 65 },
    { name: 'Marketing', count: 42 }
  ];

  const options = {
    chart: {
      type: 'pie',
      height: '180px',
      backgroundColor: 'transparent'
    },
    title: null,
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f} %',
          style: {
            textOutline: 'none'
          }
        },
        showInLegend: true
      }
    },
    series: [{
      name: 'Tickets',
      colorByPoint: true,
      data: departmentData.map((item: { name: any; count: any; }) => ({
        name: item.name,
        y: item.count
      }))
    }],
    colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#8E24AA'],
    credits: {
      enabled: false
    }
  };

  if (isLoading) return (
      <Loading title="Top 5 Department" />
  );

  if (error) return (
      <Error title="Top 5 Department" />
  );

  return (
    <WidgetCard title="Top 5 Department" tooltipPosition="bottom">
      <div className="top-departments-chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </WidgetCard>
  );
};

export default Top5Department;
