"use client"
import React, { useEffect } from 'react';
import { DoubleAreaChart } from './chart';
import { DATA_DUMMY_CHART } from '@/constants';
import styles from '../css/tokens.module.css'

export interface ChartDouAreaProps {
    onHover?: (dataHover: any) => void
}

const ChartDouArea = ({
    onHover
}: ChartDouAreaProps) => {
    useEffect(() => {
        // dummy data
        let data = DATA_DUMMY_CHART;

        data.sort((a: any, b: any) => a.date - b.date);

        data.slice(0, 500).forEach((item: any) => {
            item.value2 = item.value1 + 50;
        });

        data.slice(501, 999).forEach((item: any) => {
            item.value2 = item.value1;
        });

        data.slice(1000).forEach((item: any) => {
            item.value2 = item.value1 - 50;
        });

        // end dummy data

        let chartDouArea = document.getElementById('chart-dou-area');
        if (chartDouArea) {
            let ctx = (chartDouArea as HTMLCanvasElement).getContext('2d');
            let doubleAreaChart = new DoubleAreaChart(ctx, {
                data: data as never[],
                colors: ['#792FFD', '#45C793'],
                colorArea: ['rgba(225, 217, 240, 0.5)', 'rgba(230, 247, 240, 0.5)'],
                onHover: (x: number, dataHover: any) => {
                    // console.log('Hover x position:', x);
                    let boxInfo = document.getElementById('box-chart-dou-area');
                    if (boxInfo) {
                        boxInfo.style.left = (x - 40) + 'px';
                        boxInfo.style.top = x < 170 ? '85px' : '35px';
                    }
                    onHover && onHover(dataHover);
                },
            });
            chartDouArea.addEventListener('mousemove', (e) => {
                let boxInfo = document.getElementById('box-chart-dou-area');
                if (boxInfo) {
                    boxInfo.style.opacity = '1';
                    boxInfo.style.visibility = 'visible';
                }
            })
            chartDouArea.addEventListener('mouseleave', (e) => {
                let boxInfo = document.getElementById('box-chart-dou-area');
                if (boxInfo) {
                    boxInfo.style.opacity = '0';
                    boxInfo.style.visibility = 'hidden';
                }
            })
        }
    }, []);

    return <canvas width="548" height="325" id="chart-dou-area" className={styles['chart-dou-area']}></canvas>;
};

export default ChartDouArea;