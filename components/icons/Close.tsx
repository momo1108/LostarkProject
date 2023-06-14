import { IconProps } from "@/types/CustomType";

const Close: React.FC<IconProps> = ({
  className,
  size,
  color,
  width,
  onClick,
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
    >
      <path d="M3 3h18v18H3zM15 9l-6 6m0-6l6 6" />
    </svg>
  );
};

export default Close;
