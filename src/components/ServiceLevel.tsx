'use client';

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more';
import solidGauge from 'highcharts/modules/solid-gauge';
import WidgetCard from './WidgetCard';
import useSWR from 'swr';

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
  const serviceLevel = data?.serviceLevel || 87;

  const options = {
    chart: {
      type: 'solidgauge',
      height: '180px',
      backgroundColor: 'transparent'
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
    tooltip: {
      enabled: false
    },
    yAxis: {
      min: 0,
      max: 100,
      stops: [
        [0.1, '#DF5353'], // red
        [0.5, '#DDDF0D'], // yellow
        [0.9, '#55BF3B']  // green
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
        format: '<div style="text-align:center"><span style="font-size:25px;color:black">{y}%</span></div>'
      },
      rounded: false,
    }]
  };

  if (isLoading) return <WidgetCard title="Service Level">Loading...</WidgetCard>;
  if (error) return <WidgetCard title="Service Level">Error loading data</WidgetCard>;

  return (
    <WidgetCard title="Service Level">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </WidgetCard>
  );
};

export default ServiceLevel;
