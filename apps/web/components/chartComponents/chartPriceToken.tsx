// "use client"
// import React, { useEffect, useMemo } from 'react';
// import { SingleAreaChart } from './chart';
// import { ChartPriceTokenProps } from '@/types';



// const ChartPriceToken = ({
//   data,
//   onHover
// }: ChartPriceTokenProps) => {

//   const dataChart = useMemo(() => {
//     let dataPrice = data?.map((item: { createAt: string, id: number, price: number }) => {
//       return {
//         date: Date.parse(item.createAt),
//         value: item.price
//       }
//     })
//     if (dataPrice.length === 1) {
//       dataPrice = [...dataPrice, {
//         date: dataPrice[0].date + 30,
//         value: dataPrice[0].value
//       }]
//     }
//     return dataPrice
//   }, [data])

//   useEffect(() => {
//     let ChartPriceToken = document.getElementById('chart-line-token');
//     if (ChartPriceToken) {
//       let ctx = (ChartPriceToken as HTMLCanvasElement).getContext('2d');
//       const chartPriceToken = new SingleAreaChart(ctx, {
//         data: dataChart,
//         color: '#FF603B',
//         colorArea: 'rgba(255, 96, 59, 0.25)',
//         colorPointHover: {
//           color: '#FF603B',
//           colorStroke: 'rgba(255, 96, 59, 0.25)',
//         },
//         axis: { color: '#000', size: 14 },
//         onHover: (x: any, data: any) => {
//           onHover && onHover(data);
//         },
//       });

//       const updateCanvasWidth = () => {
//         if (ChartPriceToken) {
//           const bodyWidth = document.body.offsetWidth;
//           ChartPriceToken.style.width = bodyWidth < 734 ? `${bodyWidth - 20}px` : '734px';
//           ChartPriceToken.style.height = '380px';
//         }
//       };

//       updateCanvasWidth();
//       window.addEventListener('resize', updateCanvasWidth);
//       return () => {
//         window.removeEventListener('resize', updateCanvasWidth);
//       };
//     }
//   }, [JSON.stringify(data)]);

//   return <canvas width="734" height="380" id="chart-line-token"></canvas>;
// };

// export default ChartPriceToken;

"use client";

import React, { useState, useRef, use, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
// import moment from 'moment';
import moment from 'moment-timezone';
import { ChartPriceTokenProps } from '@/types';

const FILTER = {
  HOUR: '1h',
  DAY: '1d',
  WEEK: '1w',
  MONTH: '1m',
  YEAR: '1y',
}

interface ChartData {
  createAt: string;
  price: number;
  id?: number;
  type?: string;
}

const ChartPriceToken: React.FC<ChartPriceTokenProps> = ({ data, onHover, filterTimeValue }) => {
  const [hoveredData, setHoveredData] = useState<ChartData | null>(null);
  const chartRef = React.createRef<HTMLDivElement>();
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    // if (event.deltaY < 0) {
    //   setZoomLevel(prev => prev + 10);
    // } else {
    //   setZoomLevel(prev => Math.max(prev - 10, 1));
    // }
  };

  const handleMouseMove = (event: any) => {
    if (event && event.activePayload) {
      setHoveredData(event.activePayload[0].payload);
      document.body.style.overflow = "hidden"
      if (onHover) {
        onHover(event.activePayload[0].payload);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
    document.body.style.overflow = "scroll"
    if (onHover) {
      onHover(null);
    }
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any }) => {
    if (active && payload && payload.length) {
      const date = hoveredData ? moment(hoveredData.createAt).format('DD/MM HH:mm') : moment(payload[0].payload.createAt).format('DD/MM HH:mm');
      return (
        <div className="w-max h-max p-2 bg-white rounded-[4px]">
          <p className="text-textBlack text-[12px] font-400">{`${date}`}</p>
        </div>
      );
    }
    return null;
  };

  const formatTime = (time: number, filterTimeValue: string | null) => {
    switch (filterTimeValue) {
      case FILTER.HOUR:
        return moment(time).format('HH:mm A');
      case FILTER.DAY:
        return moment(time).format('HH:mm A');
      case FILTER.WEEK:
        return moment(time).format('MMM DD');
      case FILTER.MONTH:
        return moment(time).format('MMM DD');
      case FILTER.YEAR:
        return moment(time).format('MMM YYYY');
      default:
        return moment(time).format('HH:mm');
    }
  }

  const ticks = useMemo(() => {
    if (!filterTimeValue) return [];

    const now = moment();
    let numTicks = 0;
    let tickInterval = 0;
    let unit = 'minutes'; // Đơn vị mặc định

    switch (filterTimeValue) {
      case FILTER.HOUR:
        numTicks = 7;
        tickInterval = -10;
        unit = 'minutes';
        break;
      case FILTER.DAY:
        numTicks = 9;
        tickInterval = -3;
        unit = 'hours';
        break;
      case FILTER.WEEK:
        numTicks = 10;
        tickInterval = -1;
        unit = 'days';
        break;
      case FILTER.MONTH:
        numTicks = 11;
        tickInterval = -3;
        unit = 'days';
        break;
      case FILTER.YEAR:
        numTicks = 7;
        tickInterval = -2;
        unit = 'months';
        break;
      default:
        return [];
    }

    const ticks = [];
    for (let i = 0; i < numTicks; i++) {
      const tickTime = moment(now).add(i * tickInterval, unit as moment.unitOfTime.Diff);
      ticks.push(tickTime.format('YYYY-MM-DDTHH:mm:ss+07:00'));
    }

    return ticks;
  }, [filterTimeValue]);

  const timeInterval = useMemo(() => {
    if (!filterTimeValue) return [];

    const now = moment();
    let timeInterval = 0;
    let numTimeInterval = 0;
    let unitTimeInterval = 'minutes';

    switch (filterTimeValue) {
      case FILTER.HOUR:
        timeInterval = -5;
        numTimeInterval = 13;
        unitTimeInterval = 'minutes';
        break;
      case FILTER.DAY:
        timeInterval = -10;
        numTimeInterval = 145;
        unitTimeInterval = 'minutes';
        break;
      case FILTER.WEEK:
        timeInterval = -1;
        numTimeInterval = 169;
        unitTimeInterval = 'hours';
        break;
      case FILTER.MONTH:
        timeInterval = -1;
        numTimeInterval = 724;
        unitTimeInterval = 'hours';
        break;
      case FILTER.YEAR:
        timeInterval = -1;
        numTimeInterval = 367;
        unitTimeInterval = 'days';
        break;
      default:
        return [];
    }

    const listTimeInterval = [];
    for (let i = 0; i < numTimeInterval; i++) {
      const tickTime = moment(now).add(i * timeInterval, unitTimeInterval as moment.unitOfTime.Diff);
      listTimeInterval.push(tickTime.format('YYYY-MM-DDTHH:mm:ss+07:00'));
    }

    return listTimeInterval;
  }, [filterTimeValue]);

  const dataFormatted = useMemo(() => {
    let dataNew = data;
    if (!data || data.length === 0) return [];
    dataNew = data.map((item) => {
      const plus7TimeStringISO = moment.utc(item.createAt).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm:ss+07:00');
      return {
        ...item,
        createAt: plus7TimeStringISO,
      };
    });

    const missingTime = timeInterval.filter(tick => !data.some(item => item.createAt === tick));

    if (missingTime.length > 0) {
      dataNew = [
        ...dataNew,
        ...missingTime.map(tick => ({ createAt: tick, price: 0, id: 0, type: 'missing' })),
      ];
    }
    dataNew = dataNew.sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime());
    for (let i = 0; i < dataNew.length; i++) {
      if (dataNew[i].price === 0) {
        let closestPrice = null;
        for (let j = i - 1; j >= 0; j--) {
          if (dataNew[j].price !== 0) {
            closestPrice = dataNew[j].price;
            break;
          }
        }
        if (closestPrice === null) {
          for (let j = i + 1; j < dataNew.length; j++) {
            if (dataNew[j].price !== 0) {
              closestPrice = dataNew[j].price;
              break;
            }
          }
        }
        if (closestPrice !== null) {
          dataNew[i].price = closestPrice;
        }
      }
    }

    dataNew = dataNew.filter((item: ChartData) => item?.type === 'missing');

    return dataNew;
    // const index = dataNew.findIndex(item => item.createAt === hoveredData.createAt);
    // const start = Math.min(index - 2, zoomLevel);
    // const end = Math.max(index + 2, dataNew.length - 1 - zoomLevel);
    // return dataNew.slice(start, end);
  }, [JSON.stringify(data), JSON.stringify(ticks), zoomLevel]);

  const yTicks = useMemo(() => {
    if (!dataFormatted || dataFormatted.length === 0) return [];

    const yMin = Math.min(...dataFormatted.map(item => item.price));
    const yMax = Math.max(...dataFormatted.map(item => item.price));

    if (yMin === yMax) {
      const centerValue = yMin;
      const delta = centerValue * 0.1 || 1;
      const ticks = [
        centerValue - 2 * delta,
        centerValue - delta,
        centerValue,
        centerValue + delta,
        centerValue + 2 * delta,
      ];
      return ticks;
    } else {
      const step = (yMax - yMin) / 5;
      const ticks = [];
      for (let i = 0; i < 6; i++) {
        ticks.push(yMin + i * step);
      }
      return ticks;
    }
  }, [JSON.stringify(dataFormatted)]);

  const yMin = dataFormatted && dataFormatted.length > 0 ? Math.min(...dataFormatted.map(item => item.price)) : 0;
  const yMax = dataFormatted && dataFormatted.length > 0 ? Math.max(...dataFormatted.map(item => item.price)) : 0;
  const yRange = yMax - yMin;
  const yMinAdjusted = yMin - yRange * 0.1;

  return (
    <div style={{ width: '100%', height: 400, paddingTop: 40 }} ref={chartRef} onWheel={handleWheel}>
      <ResponsiveContainer>
        <AreaChart
          data={dataFormatted}
          margin={{ top: 10, bottom: -40, right: yMax > 1000 ? 20 : 0 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >

          <XAxis
            dataKey="createAt"
            tickFormatter={(timeStr) => formatTime(timeStr, filterTimeValue || null)}
            height={80}
            style={{ fontSize: '11px', fontWeight: 500, fill: '#000' }}
            axisLine={false}
            tickLine={false}
            ticks={ticks}
          />
          <YAxis
            orientation="right"
            interval={0}
            style={{ fontSize: '12px', fontWeight: 500, fill: '#000' }}
            axisLine={false}
            tickLine={false}
            ticks={yTicks}
            domain={[yMin, yMinAdjusted]}
            tickFormatter={(price) => `$${Number(price).toFixed(3)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="linear"
            dataKey="price"
            stroke="#FF603B"
            fill="rgba(255, 96, 59, 0.25)"
            strokeWidth="2"
            activeDot={{ stroke: '#FF603B', strokeWidth: 2, r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartPriceToken;