export interface ChartTokenProps {
  type: string;
}

export function ChartToken({ type }: ChartTokenProps) {
  return (
    <div className="h-[342px] text-black flex items-center justify-center">
      <span>ChartToken</span>
    </div>
  );
}
