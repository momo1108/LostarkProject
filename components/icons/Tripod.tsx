import { IconProps } from "@/types/CustomType";

const Tripod: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    className={className}
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
      d="M60 10 C 32.5 39.15, 27.5 44.15, 15 88.3 C 24 83.8, 24 83.8, 33 83.3 C 38 53.65, 38 53.65, 60 10"
    />
    <path
      fill={"#65fdfe"}
      d="M10 97 C 35 102, 75 102, 100 97 C 94 92, 94 92, 90 82 C 56.5 94, 56.5 94, 10 97"
    />
    <path
      fill={"#79da26"}
      d="M110 97 C 100 59, 90 46, 67 15 C 66 24, 66 24, 61 33 C 87.5 58.5, 87.5 58.5, 110 97"
    />
  </svg>
);

export default Tripod;
