"use client"
import React, { useEffect } from 'react';
import { SingleAreaChart } from './chart';
import { DATA_DUMMY_PRICE_TOKEN } from '@/constants';
import { ChartDouBarProps } from '@/types';



const ChartPriceToken = ({
  onHover
}: ChartDouBarProps) => {
  useEffect(() => {
    let ChartPriceToken = document.getElementById('chart-line-token');
    if (ChartPriceToken) {
      let ctx = (ChartPriceToken as HTMLCanvasElement).getContext('2d');
      const chartPriceToken = new SingleAreaChart(ctx, {
        data: DATA_DUMMY_PRICE_TOKEN as never[],
        color: '#FF603B',
        colorArea: 'rgba(255, 96, 59, 0.25)',
        colorPointHover: {
          color: '#FF603B',
          colorStroke: 'rgba(255, 96, 59, 0.25)',
        },
        axis: { color: '#000', size: 14 },
        onHover: (x: any, data: any) => {
          onHover && onHover(data);
        },
      });
      const bodyWidth = document.body.offsetWidth;
      if(bodyWidth < 768) {
        ChartPriceToken.style.width = '100%';
      }
    }
  }, []);

  return <canvas width="734" height="325" id="chart-line-token"></canvas>;
};

export default ChartPriceToken;