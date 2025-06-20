'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more';
import solidGauge from 'highcharts/modules/solid-gauge';
import WidgetCard from './WidgetCard';
import ChartContainer from './ChartContainer';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";

// Initialize the additional Highcharts modules
if (typeof Highcharts === 'object') {
  highchartsMore(Highcharts);
  solidGauge(Highcharts);
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ServiceLevel: React.FC = () => {
  const { data, error, isLoading } = useSWR('/api/service-level', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });

  // Default value if data is not loaded yet
  const serviceLevel = data?.serviceLevel !== undefined && data?.serviceLevel !== null ? parseFloat(data.serviceLevel) : 0;
  
  const options = {
    chart: {
      type: 'solidgauge',
      height: null,
      width: null,
      backgroundColor: 'transparent',
      marginTop: 0,
      marginBottom: 0,
      style: {
        overflow: 'visible'
      }
    },
    title: null,
    pane: {
      center: ['50%', '85%'],
      size: '90%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: '#EEE',
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          pane: {
            size: '85%'
          }
        }
      }]
    },
    tooltip: {
      enabled: false
    },
    yAxis: {
      min: 0,
      max: 100,
     stops: [
       [0.00, '#DF5353'], // red for < 95%
       [0.9499, '#DF5353'], // red up to just below 95%
       [0.95, '#55BF3B']    // green for >= 95%
     ],
      lineWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      title: {
        y: -50,
        text: 'Service Level'
      },
      labels: {
        y: 16
      }
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true
        }
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Service Level',
      data: [serviceLevel],
      dataLabels: {
        format: `<div style="text-align:center"><span style="font-size:clamp(16px, 4vw, 25px);color:${serviceLevel >= 95 ? '#55BF3B' : '#DF5353'}">{y}%</span></div>`,
        style: {
          textOutline: 'none'
        }
      },
      rounded: false,
    }]
  };

  if (isLoading) return (
      <Loading title="Service Level" />
  );

  if (error) return (
      <Error title="Service Level" />
  );

  return (
    <WidgetCard title="Service Level" tooltipPosition="bottom">
      <ChartContainer>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          containerProps={{
            className: 'w-full h-[80px] md:h-[100px] lg:h-[120px] xl:h-[150px] 2xl:h-[180px]',
          }}
          immutable={false}
          allowChartUpdate={true}
        />
      </ChartContainer>
    </WidgetCard>
  );
};

export default ServiceLevel;
