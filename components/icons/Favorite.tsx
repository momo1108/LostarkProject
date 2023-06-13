import { IconProps } from "@/types/CustomType";

const Favorite: React.FC<IconProps> = ({
  size = 20,
  color = "#000000",
  width = 3,
  fill = "none",
  className = "",
  onClick,
}) => (
  <svg
    className={`favoriteIcon ${className}`}
    onClick={onClick}
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
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);
export default Favorite;
