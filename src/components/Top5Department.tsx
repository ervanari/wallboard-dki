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

const Top5Department: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/top-departments', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const departmentData = data?.departmentData || [
    { name: 'Customer Service', count: 0 },
    { name: 'IT Support', count: 0 },
    { name: 'Finance', count: 0 },
    { name: 'Operations', count: 0 },
    { name: 'Marketing', count: 0 }
  ];

  const options = {
    chart: {
      type: 'pie',
      height: null,
      width: null,
      backgroundColor: 'transparent',
      marginTop: 0,
      marginBottom: 30,
      style: {
        overflow: 'visible'
      }
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
          plotOptions: {
            pie: {
              dataLabels: {
                style: {
                  fontSize: '9px'
                }
              }
            }
          }
        }
      }]
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f} %',
          style: {
            fontSize: 'clamp(10px, 1.5vw, 12px)',
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
    colors: ['#5b9cd5', '#4472c4', '#ee7d31', '#ffc002', '#a5a5a5'],
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

export default Top5Department;
