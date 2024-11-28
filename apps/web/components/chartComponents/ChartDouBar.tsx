"use client"
import React, { useEffect } from 'react';
import { DoubleBarChart } from './chart';
import { ChartDouBarProps } from '@/types';


const ChartDouBar = ({
    onHover
}: ChartDouBarProps) => {
    useEffect(() => {
        // dummy data
        let data = [
            { date: new Date('2022-04-23'), value1: 0.1, value2: 0.23 },
            { date: new Date('2022-05-25'), value1: 0.03, value2: 0.2 },
            { date: new Date('2022-07-26'), value1: 0.12, value2: 0.14 },
            { date: new Date('2022-10-23'), value1: 0.12, value2: 0.1 },
            { date: new Date('2022-12-31'), value1: 0.12, value2: 0.25 },
            { date: new Date('2023-01-01'), value1: 0.12, value2: 0.41 },
            { date: new Date('2023-05-23'), value1: 0.4, value2: 0.8 },
            { date: new Date('2023-07-15'), value1: 0.12, value2: 0.14 },
            { date: new Date('2023-10-23'), value1: 0.3, value2: 0.6 },
            { date: new Date('2023-12-05'), value1: 0.12, value2: 0.7 },
            { date: new Date('2024-01-06'), value1: 0.12, value2: 0.14 },
            { date: new Date('2024-03-07'), value1: 0.12, value2: 0.6 },
            { date: new Date('2024-04-08'), value1: 0.12, value2: 0.14 },
            { date: new Date('2024-05-09'), value1: 0.2, value2: 0.4 },
            { date: new Date('2024-06-10'), value1: 0.3, value2: 0.44 },
            { date: new Date('2024-07-23'), value1: 0.12, value2: 0.14 },
            { date: new Date('2024-08-23'), value1: 0.12, value2: 0.14 },
            { date: new Date('2024-09-23'), value1: 0.12, value2: 0.14 },
          ];

        // end dummy data

        let chartDouBarsPool = document.getElementById('chart-dou-bars-pool');
        if (chartDouBarsPool) {
            let ctx = (chartDouBarsPool as HTMLCanvasElement).getContext('2d');
            let doubleBarChart = new DoubleBarChart(ctx, {
                data: data,
                colors: ['#E1D9F0', '#E4F5EE'],
                axis: { color: '#000000', size: 12 },
                hoverColors: ['#6A16FF', '#0A6'],
                onHover: (x: number, data:any) => {
                    let boxInfo = document.getElementById('box-chart-dou-bar');
                    if (boxInfo) {
                        boxInfo.style.left = (x - 30) + 'px';
                        boxInfo.style.top = x < 170 ? '85px' : '35px';
                    }
                    onHover && onHover(data);
                },
            });
            chartDouBarsPool.addEventListener('mousemove', (e) => {
                let boxInfo = document.getElementById('box-chart-dou-bar');
                if (boxInfo) {
                    boxInfo.style.opacity = '1';
                    boxInfo.style.visibility = 'visible';
                }
            })
            chartDouBarsPool.addEventListener('mouseleave', (e) => {
                let boxInfo = document.getElementById('box-chart-dou-bar');
                if (boxInfo) {
                    boxInfo.style.opacity = '0';
                    boxInfo.style.visibility = 'hidden';
                }
            })
        }
    }, []);

    return <canvas width="548" height="325" id="chart-dou-bars-pool"></canvas>;
};

export default ChartDouBar;