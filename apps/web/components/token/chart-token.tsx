import ChartDouArea from "../chartComponents/ChartDouArea";
import ChartDouBar from "../chartComponents/ChartDouBar";
import ChartPriceToken from "../chartComponents/chartPriceToken";

export interface ChartTokenProps {
  type: string;
  onHover?: (dataHover: any) => void;
}

export function ChartToken({ type, onHover }: ChartTokenProps) {
  return (
    <div className="w-full">
      {type === 'tvl' && <ChartDouArea onHover={onHover}/>}
      {type === 'vol' && <ChartDouBar onHover={onHover} />}
      {type === 'priceToken' && <ChartPriceToken onHover={onHover}/>}
    </div>
  );
}
