"use client";

import React, { useEffect } from "react";
import { LineChart } from "./chart";

interface ChartLineProps {
  tokenData: { date: string; price: number }[];
  width: number;
  height: number;
  id: string;
}

const ChartLine = ({ tokenData, width, height, id }: ChartLineProps) => {
  useEffect(() => {
    const data = tokenData.map((item) => ({
      date: new Date(item.date),
      value: item.price,
    }));

    const chartLine = document.getElementById(id);
    if (chartLine) {
      const ctx = (chartLine as HTMLCanvasElement).getContext("2d");
      const isUpward =
        tokenData[tokenData.length - 1].price > tokenData[0].price;
      const chartColor = isUpward ? "#45B272" : "#F83B28";
      if (ctx) {
        new LineChart(ctx, {
          data,
          color: chartColor,
          axis: { color: "#555", size: 10 },
          marginBottom: 15,
          marginLeft: 10,
          marginTop: 5,
          marginRight: 10,
        });
      }
    }
  }, [tokenData, id]);

  return (
    <canvas
      id={id}
      width={width}
      height={height}
      style={{
        display: "block",
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
};

export default ChartLine;
