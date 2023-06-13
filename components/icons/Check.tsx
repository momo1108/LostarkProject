import { IconProps } from "@/types/CustomType";

const Check: React.FC<IconProps> = ({
  size = 16,
  color = "#000000",
  width = 3,
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
export default Check;
