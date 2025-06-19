'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Top5KantorCabang: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/top-kantor-cabang', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default values if data is not loaded yet
  const branchData = data?.branchData || [
    { name: 'Cabang Utama', count: 125 },
    { name: 'Cabang Kelapa Gading', count: 87 },
    { name: 'Cabang Kemang', count: 72 },
    { name: 'Cabang Sudirman', count: 58 },
    { name: 'Cabang Pondok Indah', count: 45 }
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
      data: branchData.map((item: { name: any; count: any; }) => ({
        name: item.name,
        y: item.count
      }))
    }],
    colors: ['#6A5ACD', '#8A2BE2', '#9370DB', '#BA55D3', '#DA70D6'],
    credits: {
      enabled: false
    }
  };

  if (isLoading) return (
      <Loading title="Top 5 Kantor Cabang" />
  );

  if (error) return (
      <Error title="Top 5 Kantor Cabang" />
  );

  return (
    <WidgetCard title="Top 5 Kantor Cabang" tooltipPosition="bottom">
      <div className="top-branches-chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </WidgetCard>
  );
};

export default Top5KantorCabang;
