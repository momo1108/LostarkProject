import { IconProps } from "@/types/CustomType";

const Dots: React.FC<IconProps> = ({
  className,
  size = 100,
  color = "#eee",
  fill = "#eee",
  width = 1.5,
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * 0.1}
      stroke={color}
      fill={fill}
      strokeWidth={width}
      viewBox="0 0 200 20"
    >
      <circle cx={10} cy={10} r={2}></circle>
      <circle cx={20} cy={10} r={2}></circle>
      <circle cx={30} cy={10} r={2}></circle>
      <circle cx={40} cy={10} r={2}></circle>
      <circle cx={50} cy={10} r={2}></circle>
      <circle cx={60} cy={10} r={2}></circle>
      <circle cx={70} cy={10} r={2}></circle>
      <circle cx={80} cy={10} r={2}></circle>
      <circle cx={90} cy={10} r={2}></circle>
      <circle cx={100} cy={10} r={2}></circle>
      <circle cx={110} cy={10} r={2}></circle>
      <circle cx={120} cy={10} r={2}></circle>
      <circle cx={130} cy={10} r={2.1}></circle>
      <circle cx={140} cy={10} r={2.4}></circle>
      <circle cx={150} cy={10} r={2.1}></circle>
      <circle cx={160} cy={10} r={2}></circle>
      <circle cx={170} cy={10} r={2}></circle>
      <circle cx={180} cy={10} r={2}></circle>
      <circle cx={190} cy={10} r={2}></circle>
    </svg>
  );
};

export default Dots;
