import ChartDouArea from "../chartComponents/ChartDouArea";
import ChartDouBar from "../chartComponents/ChartDouBar";
import ChartPriceToken from "../chartComponents/chartPriceToken";
import { TYPE_CHART } from "@/constants";

export interface ChartTokenProps {
  type: string;
  onHover?: (dataHover: any) => void;
  data?: any;
}

export function ChartToken({data, type, onHover }: ChartTokenProps) {
  return (
    <div className="w-full">
      {type === TYPE_CHART.TOTAL_VALUE_LOCK && <ChartDouArea onHover={onHover}/>}
      {type === TYPE_CHART.VOLUME && <ChartDouBar onHover={onHover} />}
      {type === TYPE_CHART.PRICE_TOKEN && <ChartPriceToken data={data} onHover={onHover}/>}
    </div>
  );
}
