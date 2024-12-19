"use client"
import React, { useEffect, useMemo } from 'react';
import { SingleAreaChart } from './chart';
import { DATA_DUMMY_PRICE_TOKEN } from '@/constants';
import { ChartPriceTokenProps } from '@/types';



const ChartPriceToken = ({
  data,
  onHover
}: ChartPriceTokenProps) => {

  const dataChart = useMemo(() => {
    let dataPrice = data?.map((item: { createAt: string, id: number, price: number }) => {
      return {
        date: Date.parse(item.createAt),
        value: item.price
      }
    })
    if (dataPrice.length === 1) {
      dataPrice = [...dataPrice, {
        date: dataPrice[0].date + 30,
        value: dataPrice[0].value
      }]
    }
    return dataPrice
  }, [data])

  useEffect(() => {
    let ChartPriceToken = document.getElementById('chart-line-token');
    if (ChartPriceToken) {
      let ctx = (ChartPriceToken as HTMLCanvasElement).getContext('2d');
      const chartPriceToken = new SingleAreaChart(ctx, {
        data: dataChart,
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

      const updateCanvasWidth = () => {
        if (ChartPriceToken) {
          const bodyWidth = document.body.offsetWidth;
          ChartPriceToken.style.width = bodyWidth < 734 ? `${bodyWidth - 20}px` : '734px';
          ChartPriceToken.style.height = '380px';
        }
      };

      updateCanvasWidth();
      window.addEventListener('resize', updateCanvasWidth);
      return () => {
        window.removeEventListener('resize', updateCanvasWidth);
      };
    }
  }, [JSON.stringify(data)]);

  return <canvas width="734" height="380" id="chart-line-token"></canvas>;
};

export default ChartPriceToken;