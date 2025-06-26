'use client';

import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more';
import solidGauge from 'highcharts/modules/solid-gauge';
import WidgetCard from './WidgetCard';
import ChartContainer from './ChartContainer';
import useSWR from 'swr';
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { useTheme } from '@/context/ThemeContext';
import { useResizeObserver } from '@/hooks/useResizeObserver';

// Initialize the additional Highcharts modules
if (typeof Highcharts === 'object') {
  highchartsMore(Highcharts);
  solidGauge(Highcharts);
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface ServiceLevelProps {
  containerWidth?: number;
  containerHeight?: number;
}

const ServiceLevel: React.FC<ServiceLevelProps> = ({ containerWidth, containerHeight }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(chartContainerRef);

  // Use container dimensions if provided, otherwise use measured dimensions
  const effectiveWidth = containerWidth || width;
  const effectiveHeight = containerHeight || height;

  const { data, error, isLoading } = useSWR('/api/service-level', fetcher, {
    refreshInterval: 30000 // refresh every 30 seconds
  });
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Default value if data is not loaded yet
  const serviceLevel = data?.serviceLevel !== undefined && data?.serviceLevel !== null ? parseFloat(data.serviceLevel) : 0;

  // Calculate dynamic font sizes based on container width
  const titleFontSize = `clamp(12px, ${Math.max(effectiveWidth * 0.02, 1)}px, 18px)`;
  const labelFontSize = `clamp(10px, ${Math.max(effectiveWidth * 0.015, 1)}px, 14px)`;
  const valueFontSize = `clamp(16px, ${Math.max(effectiveWidth * 0.05, 1)}px, 28px)`;

  // Calculate dynamic sizes for gauge
  const gaugeSize = Math.min(effectiveWidth, effectiveHeight * 2) * 0.9;
  const paneSize = `${Math.min(90, Math.max(70, gaugeSize / 3))}%`;

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
      center: ['50%', '65%'],
      size: paneSize,
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: isDarkMode ? '#374151' : '#EEE', // dark:gray-700 for dark mode
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 300
          },
          chartOptions: {
            pane: {
              size: '70%',
              center: ['50%', '60%']
            },
            yAxis: {
              labels: {
                y: 12,
                style: {
                  fontSize: '8px'
                }
              },
              title: {
                y: -35,
                style: {
                  fontSize: '10px'
                }
              }
            }
          }
        },
        {
          condition: {
            minWidth: 301,
            maxWidth: 500
          },
          chartOptions: {
            pane: {
              size: '80%'
            },
            yAxis: {
              labels: {
                style: {
                  fontSize: '10px'
                }
              },
              title: {
                style: {
                  fontSize: '12px'
                }
              }
            }
          }
        },
        {
          condition: {
            minWidth: 501
          },
          chartOptions: {
            pane: {
              size: '90%'
            },
            yAxis: {
              labels: {
                style: {
                  fontSize: '12px'
                }
              },
              title: {
                style: {
                  fontSize: '14px'
                }
              }
            }
          }
        }
      ]
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
        text: 'Service Level',
        style: {
          color: isDarkMode ? '#fff' : '#000',
          fontSize: titleFontSize
        }
      },
      labels: {
        y: 16,
        style: {
          color: isDarkMode ? '#fff' : '#000',
          fontSize: labelFontSize
        }
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
        format: `<div style="text-align:center"><span style="font-size:${valueFontSize};color:${serviceLevel >= 95 ? '#55BF3B' : '#DF5353'}">{y}%</span></div>`,
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
      <div ref={chartContainerRef} className="w-full h-full min-w-0 min-h-0">
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
      </div>
    </WidgetCard>
  );
};

export default ServiceLevel;
