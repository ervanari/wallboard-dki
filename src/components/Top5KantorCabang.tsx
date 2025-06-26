'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import WidgetCard from './WidgetCard';
import ChartContainer from './ChartContainer';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { useTheme } from '@/context/ThemeContext';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Top5KantorCabang: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/top-kantor-cabang', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

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
      height: null,
      width: null,
      backgroundColor: 'transparent',
      marginTop: 0,
      marginBottom: 50,
      style: {
        overflow: 'visible'
      }
    },
    title: null,
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>',
      backgroundColor: isDarkMode ? '#374151' : '#fff',
      style: {
        color: isDarkMode ? '#fff' : '#000'
      }
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
              fontSize: '10px',
              color: isDarkMode ? '#fff' : '#000'
            }
          },
          plotOptions: {
            pie: {
              dataLabels: {
                style: {
                  fontSize: '9px',
                  color: isDarkMode ? '#fff' : '#000',
                  textOutline: isDarkMode ? '1px contrast' : 'none'
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
          format: '<span><b>{point.name}</b>' +
              '</span><br>' +
              '<span style="opacity: 0.6">{point.percentage:.1f} ' +
              '%</span>',
          style: {
            fontSize: 'clamp(8px, 1.5vw, 10px)',
            color: isDarkMode ? '#fff' : '#000',
            textOutline: isDarkMode ? '1px contrast' : 'none'
          }
        },
        showInLegend: false,
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
    colors: ['#5b9cd5', '#4472c4', '#ee7d31', '#ffc002', '#a5a5a5'],
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: {
        color: isDarkMode ? '#fff' : '#000'
      }
    },
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

export default Top5KantorCabang;
