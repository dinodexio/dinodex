import { BASE_TOKEN } from "@/constants";
type Props = {
  className?: string;
  fontSize?: string;
};
const BaseTokenTag = ({ fontSize, className }: Props) => {
  return (
    <span className={className} style={{ fontSize: fontSize }}>
      {BASE_TOKEN}
    </span>
  );
};

export default BaseTokenTag;
