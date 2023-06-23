import { IconProps } from "@/types/CustomType";

const Triangle: React.FC<IconProps> = ({
  size = 16,
  color = "#000000",
  fill = "#000000",
  width = 3,
  className,
  rotate,
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
    transform={`rotate(${rotate ? rotate : 0})`}
  >
    <path d="M3 20h18L12 4z" />
  </svg>
);
export default Triangle;
