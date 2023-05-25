import { IconProps } from "@/types/IconType";

const Empty: React.FC<IconProps> = ({
  size = 300,
  color = "#bbb",
  width = 2.5,
  fill = "none",
  className = "",
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
  </svg>
);
export default Empty;
