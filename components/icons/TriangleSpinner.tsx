import { IconProps } from "@/types/CustomType";

const TriangleSpinner: React.FC<IconProps> = ({
  size = 180,
  width = 2,
  className,
}) => (
  <svg
    id="triangle"
    width={size}
    height={size}
    viewBox="0 0 40 40"
    className={className}
  >
    <polygon
      fill="none"
      stroke="url(#lg)"
      strokeWidth={width}
      points="20,4 36,36 4,36"
    ></polygon>
    <defs>
      <linearGradient id="lg">
        <stop offset="0" stopColor="#4f84" />
        <stop offset="1" stopColor="#55f4" />
      </linearGradient>
    </defs>
  </svg>
);
export default TriangleSpinner;
