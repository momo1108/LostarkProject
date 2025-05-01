import { IconProps } from "@/types/CustomType";

const Tripod: React.FC<IconProps> = ({
  className,
  size = 16,
  svgAttributes = {},
}) => (
  <svg
    className={className}
    {...svgAttributes}
    data-type="2"
    xmlns="http://www.w3.org/2000/svg"
    version="1.0"
    width={size}
    height={size}
    stroke="none"
    viewBox="0 0 120 107"
    preserveAspectRatio="xMidYMid meet"
  >
    <path
      fill={"#c5c34b"}
      d="M60 5 C 32.5 34.15, 27.5 40.15, 15 83.3 C 24 78.8, 24 78.8, 33 78.3 C 38 48.65, 38 48.65, 60 5"
    />
    <path
      fill={"#65fdfe"}
      d="M10 92 C 35 97, 75 97, 100 92 C 94 87, 94 87, 90 77 C 56.5 89, 56.5 89, 10 92"
    />
    <path
      fill={"#79da26"}
      d="M110 92 C 100 54, 90 41, 67 10 C 66 19, 66 19, 61 28 C 87.5 53.5, 87.5 53.5, 110 92"
    />
  </svg>
);

export default Tripod;
