import * as React from "react";
import { Bar, BarChart, Brush, CartesianGrid, XAxis, YAxis } from "recharts";
import styles from "../css/detailToken.module.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatNumber } from "@/lib/utils";
import BigNumber from "bignumber.js";
import { precision } from "../ui/balance";
import { BASE_TOKEN } from "@/constants";

interface DataPoint {
  createAt: string;
  tokenAPrice: number | string;
  tokenBPrice: number | string;
  tokenAAmount: number | string;
  tokenBAmount: number | string;
}

interface BarChartProps {
  data: DataPoint[];
  time: "1h" | "1d" | "1w" | "1m" | "1y" | string;
  params: {
    value: string;
    time: string;
  };
}

const chartConfig = {
  views: {
    label: "Volume",
  },
  value: {
    label: "Value",
    color: "#FF8035",
  },
} satisfies ChartConfig;

export function ChartPoolBar({ params, data, time }: BarChartProps) {
  const [labelTime, setLabelTime] = React.useState(params.time);
  const [volume, setVolume] = React.useState<string | null>(null);
  //Track the date displayed for Xaxis to manage first occurrance
  const lastSeenDateRef = React.useRef<string | null>(null);

  //Moved date formatter to its own function for reuse
  const formatDateForAxis = (
    date: Date,
    time: string,
    lastSeenDate: string | null,
  ) => {
    if (time === "1h") {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } else if (time === "1d") {
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      if (lastSeenDate === null || lastSeenDate != formattedDate) {
        return `${formattedDate} , ${formattedTime}`;
      }

      return formattedTime;
    } else if (time === "1w") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else if (time === "1m") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else if (time === "1y") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const groupData = React.useCallback(
    (data: DataPoint[], timeOption: string) => {
      const groupBy: Record<string, number> = {
        "1h": 5 * 60 * 1000,
        "1d": 60 * 60 * 1000,
        "1w": 6 * 60 * 60 * 1000,
        "1m": 24 * 60 * 60 * 1000,
        "1y": 7 * 24 * 60 * 60 * 1000,
      };

      const interval = groupBy[timeOption] || groupBy["1d"];
      const grouped: Record<string, BigNumber> = {};
      const now = new Date();
      const nowTime = now.getTime();

      const timestamps = data.map((item) => new Date(item.createAt).getTime());
      const minTime = Math.min(...timestamps);
      const maxTime = Math.max(...timestamps);

      data.forEach((item) => {
        const tokenAPrice = new BigNumber(item.tokenAPrice);
        const tokenBPrice = new BigNumber(item.tokenBPrice);
        const tokenAAmount = new BigNumber(item.tokenAAmount);
        const tokenBAmount = new BigNumber(item.tokenBAmount);

        const value = tokenAPrice
          .times(tokenAAmount)
          .plus(tokenBPrice.times(tokenBAmount))
          .dividedBy(new BigNumber(10).pow(precision));

        const bucket = Math.floor(new Date(item.createAt).getTime() / interval);

        if (!grouped[bucket]) {
          grouped[bucket] = new BigNumber(0);
        }
        grouped[bucket] = grouped[bucket].plus(value);
      });

      const result: { date: string; value: number | null }[] = [];
      // Logic for '1h'
      if (timeOption === "1h") {
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const oneHourTimestamps = [];
        for (
          let time = oneHourAgo.getTime();
          time <= now.getTime();
          time += 5 * 60 * 1000
        ) {
          oneHourTimestamps.push(time);
        }
        for (const time of oneHourTimestamps) {
          const bucket = Math.floor(time / interval);
          result.push({
            date: new Date(time).toISOString(),
            value: grouped[bucket]?.toNumber() || null,
          });
        }
        return result;
      }

      //Logic for '1d'
      if (timeOption === "1d") {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneDayTimestamps = [];
        for (
          let time = oneDayAgo.getTime();
          time <= now.getTime();
          time += 60 * 60 * 1000
        ) {
          oneDayTimestamps.push(time);
        }
        for (const time of oneDayTimestamps) {
          const bucket = Math.floor(time / interval);
          result.push({
            date: new Date(time).toISOString(),
            value: grouped[bucket]?.toNumber() || null,
          });
        }
        return result;
      }

      // Logic for 1w
      if (timeOption === "1w") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneWeekTimestamps = [];
        for (
          let time = oneWeekAgo.getTime();
          time <= now.getTime();
          time += 6 * 60 * 60 * 1000
        ) {
          oneWeekTimestamps.push(time);
        }
        // Check if last timestamp is not the maxTime. If not, add maxTime
        const lastTimestamp = oneWeekTimestamps[oneWeekTimestamps.length - 1];
        if (lastTimestamp < maxTime) {
          oneWeekTimestamps.push(maxTime);
        }
        for (const time of oneWeekTimestamps) {
          const bucket = Math.floor(time / interval);
          result.push({
            date: new Date(time).toISOString(),
            value: grouped[bucket]?.toNumber() || null,
          });
        }
        return result;
      }

      // Logic for 1m
      if (timeOption === "1m") {
        const oneMonthAgo = new Date(nowTime - 30 * 24 * 60 * 60 * 1000);
        const oneMonthTimestamps = [];
        let currentDayStart = new Date(oneMonthAgo);
        currentDayStart.setHours(17, 0, 0, 0);
        while (currentDayStart.getTime() <= nowTime) {
          oneMonthTimestamps.push(currentDayStart.getTime());
          currentDayStart.setDate(currentDayStart.getDate() + 1);
        }
        // Check if last timestamp is not the maxTime. If not, add maxTime
        const lastTimestamp = oneMonthTimestamps[oneMonthTimestamps.length - 1];
        if (lastTimestamp < maxTime) {
          oneMonthTimestamps.push(maxTime);
        }

        for (let i = 0; i < oneMonthTimestamps.length; i++) {
          const time = oneMonthTimestamps[i];
          let totalValue = new BigNumber(0);
          const startBucket = Math.floor(time / interval);
          const endBucket = Math.floor((time + groupBy["1m"]) / interval);

          for (const key in grouped) {
            if (Number(key) >= startBucket && Number(key) < endBucket) {
              totalValue = totalValue.plus(grouped[key] || 0);
            }
          }
          // Add today's data to the previous bar if it exists
          if (
            i === oneMonthTimestamps.length - 1 &&
            time > nowTime - 24 * 60 * 60 * 1000
          ) {
            if (result.length > 0) {
              result[result.length - 1].value = new BigNumber(
                result[result.length - 1].value || 0,
              ).toNumber();
            }
            continue;
          }
          result.push({
            date: new Date(time).toISOString(),
            value: totalValue.toNumber() || null,
          });
        }
        return result;
      }

      // Logic for 1y
      if (timeOption === "1y") {
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        const oneYearTimestamps = [];

        let currentWeekStart = new Date(oneYearAgo);
        currentWeekStart.setHours(7, 0, 0, 0); // Set to 7 AM
        while (currentWeekStart.getTime() <= nowTime) {
          oneYearTimestamps.push(currentWeekStart.getTime());
          currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        }

        //Check if last timestamp is not the maxTime. If not, add maxTime
        const lastTimestamp = oneYearTimestamps[oneYearTimestamps.length - 1];
        if (lastTimestamp < maxTime) {
          oneYearTimestamps.push(maxTime);
        }

        for (let i = 0; i < oneYearTimestamps.length; i++) {
          const time = oneYearTimestamps[i];
          let currentWeekTotal = new BigNumber(0);
          const startBucket = Math.floor(time / interval);
          const endBucket = Math.floor((time + groupBy["1y"]) / interval);

          for (const key in grouped) {
            if (Number(key) >= startBucket && Number(key) < endBucket) {
              currentWeekTotal = currentWeekTotal.plus(grouped[key] || 0);
            }
          }
          // Add today's data to the previous bar if it exists
          if (
            i === oneYearTimestamps.length - 1 &&
            time > nowTime - 7 * 24 * 60 * 60 * 1000
          ) {
            if (result.length > 0) {
              result[result.length - 1].value = new BigNumber(
                result[result.length - 1].value || 0,
              ).toNumber();
            }
            continue;
          }

          result.push({
            date: new Date(time).toISOString(),
            value: currentWeekTotal.toNumber() || null,
          });
        }
        return result;
      }

      // default case
      for (let time = minTime; time <= maxTime; time += interval) {
        const bucket = Math.floor(time / interval);
        result.push({
          date: new Date(bucket * interval).toISOString(),
          value: grouped[bucket]?.toNumber() || null,
        });
      }
      return result;
    },
    [precision],
  );

  const chartData = React.useMemo(
    () => groupData(data, time),
    [data, time, groupData],
  );

  const handleMouseLeave = () => {
    setLabelTime(params.time);
    setVolume(null);
  };

  const handleMouseMove = (event: any) => {
    const payload = event.activePayload?.[0]?.payload;
    if (!payload) {
      return;
    }
    const date = new Date(payload.date);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    if (payload.value) {
      setLabelTime(`${formattedDate}, ${formattedTime}`);
    } else {
      setLabelTime(params.time);
    }
    setVolume(payload.value ? formatNumber(payload.value, 1) : null);
  };

  React.useEffect(() => {
    setLabelTime(params.time);
    lastSeenDateRef.current = null; // Reset last seen date when time changes
  }, [params.time]);

  return (
    <Card className="border-none bg-[transparent]">
      <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle>
            <span className={styles["token-chart-price-text"]}>
              {volume ?? params.value} {BASE_TOKEN}
            </span>
          </CardTitle>
          <CardDescription>
            {" "}
            <span
              className={`text-[16px] font-[500] text-textBlack sm:text-[16px] lg:text-[20px] xl:text-[20px]`}
            >
              {labelTime}
            </span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:py-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full [&_.recharts-cartesian-axis-tick]:fill-[#4b5563] [&_.recharts-cartesian-axis-tick_text]:fill-[#4b5563]"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            onMouseLeave={handleMouseLeave}
            onMouseMove={(event) => {
              handleMouseMove(event);
            }}
          >
            <CartesianGrid
              vertical={false}
              horizontal={false}
              strokeDasharray="3 3"
              onMouseUp={() => console.log("okay")}
            />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={48}
              tickFormatter={(value) => {
                const date = new Date(value);
                const formattedValue = formatDateForAxis(
                  date,
                  time,
                  lastSeenDateRef.current,
                );
                if (time === "1d") {
                  const formattedDate = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                  lastSeenDateRef.current = formattedDate;
                }
                return formattedValue;
              }}
              className="text-[12px] sm:text-[13px] lg:text-[14px] xl:text-[14px]"
            />
            <YAxis
              dataKey={"value"}
              tickLine={false}
              axisLine={false}
              tickMargin={2}
              orientation="right"
              tickFormatter={(value) => {
                const numericValue = Number(value);
                if (numericValue === 0) {
                  return "";
                }
                return `${formatNumber(value, 1)}`;
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="box-shadow w-[150px] border-none bg-[#fffbf7b3] text-[#000000]"
                  nameKey="views"
                  hideLabel
                  cursor={false}
                  defaultIndex={1}
                  formatter={(value) => (
                    <div className="flex min-w-[130px] items-center text-[12px] sm:text-[13px] lg:text-[14px] xl:text-[14px]">
                      Volume
                      <div className="ml-auto flex items-baseline gap-0.5 font-weight-[700]-important">
                        {formatNumber(+value, 1)}
                        <span className="font-normal ">{BASE_TOKEN}</span>
                      </div>
                    </div>
                  )}
                  // formatter={(value) => {
                  //   return (
                  //     <p className="font-weight-[700] text-[12px] sm:text-[13px] lg:text-[14px] xl:text-[14px]">
                  //       Volume: {formatNumber(+value, 1)} {BASE_TOKEN}
                  //     </p>
                  //   );
                  // }}
                />
              }
            />
            {/* <Brush
              dataKey="date"
              height={15}
              stroke="#FF8035"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  hour: "numeric",
                  month: "short",
                  day: "numeric",
                })
              }
            /> */}
            <Bar
              dataKey={"value"}
              fill="#FF8035"
              isAnimationActive
              radius={[4, 4, 0, 0]}
              layout="vertical"
              fillRule="inherit"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
