"use client"
import React, { useEffect, useMemo, useRef } from 'react';
import { BarsChart } from './chart';
import { ChartPoolBarProps } from '@/types';
import BigNumber from 'bignumber.js';
import { precision } from '../ui/balance';



const ChartPoolBar = ({
  data
}: ChartPoolBarProps) => {

    const chartPoolBarRef = useRef<HTMLCanvasElement>(null)

  const dataChart = useMemo(() => {
    let dataPrice = data?.map((item: { createAt: string, tokenAPrice: number, tokenBPrice: number, tokenAAmount: number | string, tokenBAmount: number | string }) => {
      let valueItem = BigNumber(item.tokenAPrice).times(item.tokenAAmount).plus(BigNumber(item.tokenBPrice).times(item.tokenBAmount)).dividedBy(10**precision).toNumber()
      return {
        letter: new Date(item.createAt).valueOf(),
        value: valueItem
      }
    })
    console.log('dataPrice:::',dataPrice)
    return dataPrice
  }, [JSON.stringify(data)])

  useEffect(() => {
    // let data = [
    //   { letter: '2024-12-18T04:05:00.000Z', value: 0.01 },
    //   { letter: '2024-12-18T05:06:00.000Z', value: 0.03 },
    //   { letter: '2024-12-18T06:07:00.000Z', value: 0.12 },
    //   { letter: '2024-12-18T07:05:00.000Z', value: 0.05 },
    //   { letter: '2024-12-18T08:05:00.000Z', value: 0.09 },
    //   { letter: '2024-12-18T09:05:00.000Z', value: 0.05 },
    //   { letter: '2024-12-18T10:05:00.000Z', value: 0.13 },
    //   { letter: '2024-12-18T11:05:00.000Z', value: 0.02 },
    //   { letter: '2024-12-18T00:05:00.000Z', value: 0.12 },
    //   { letter: '2024-12-18T13:05:00.000Z', value: 0.1 },
    //   { letter: '2024-12-18T14:05:00.000Z', value: 0.01 },
    //   { letter: '2024-12-18T15:05:00.000Z', value: 0.1 },
    //   { letter: '2024-12-18T16:05:00.000Z', value: 0.1 },
    //   { letter: '2024-12-18T17:05:00.000Z', value: 0.1 },
    //   { letter: '2024-12-18T18:05:00.000Z', value: 0.1 },
    //   { letter: '2024-12-18T19:05:00.000Z', value: 0.1 },
    //   { letter: '2024-12-18T20:05:00.000Z', value: 0.12 },
    // ];
      let chartBarsPool = chartPoolBarRef.current;
      if (chartBarsPool) {
        let ctx = chartBarsPool.getContext('2d');
        let barsChart = new BarsChart(ctx, {
          data: dataChart as never[],
          color: '#FF8035',
          axis: { color: '#000000', size: 14 },
        });
      }
      const updateCanvasWidth = () => {
        if (chartBarsPool) {
          const bodyWidth = document.body.offsetWidth;
          chartBarsPool.style.width = bodyWidth < 734 ? `${bodyWidth -20}px` : '734px';
          chartBarsPool.style.height = '380px';
        }
      };

      updateCanvasWidth();
      window.addEventListener('resize', updateCanvasWidth);
      return () => {
        window.removeEventListener('resize', updateCanvasWidth);
      };
  }, [JSON.stringify(dataChart)]);

  return <canvas width="730" height="380" id="chart-bars-pool" ref={chartPoolBarRef}></canvas>;
};

export default ChartPoolBar;