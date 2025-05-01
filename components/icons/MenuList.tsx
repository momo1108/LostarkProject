import { IconProps } from "@/types/CustomType";

const MenuList: React.FC<IconProps> = ({
  className,
  size,
  color,
  width = 3,
  svgAttributes = {},
}) => {
  return (
    <svg
      className={className}
      {...svgAttributes}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-license="MIT LICENSE - https://iconsvg.xyz/"
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
};

export default MenuList;
