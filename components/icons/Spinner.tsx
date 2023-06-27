import { SpinnerIconProps } from "@/types/CustomType";

const Spinner: React.FC<SpinnerIconProps> = ({
  size = 300,
  color = "#bbb",
  width = 2.5,
  fill = "none",
  className = "",
  progress,
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill={fill}
    strokeWidth={width}
  >
    <g>
      <circle cx="50" cy="50" r="46" stroke="#666"></circle>
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke={color}
        style={{
          transition: "stroke-dasharray 0.05s linear",
          strokeDasharray: `${300 * progress} 1000`,
          strokeDashoffset: `${progress ? 0 : 10}`,
        }}
      ></circle>
    </g>
  </svg>
);
export default Spinner;
