import { IconProps } from "@/types/CustomType";

const Skip: React.FC<IconProps> = ({
  size = 24,
  color = "#000000",
  fill = "#000000",
  className = "",
  rotate = 0,
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    transform={`rotate(${rotate})`}
  >
    <polygon points="5 4 15 12 5 20 5 4"></polygon>
    <line x1="19" y1="5" x2="19" y2="19"></line>
  </svg>
);
export default Skip;
