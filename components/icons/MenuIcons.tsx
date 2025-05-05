import { IconProps } from "@/types/CustomType";

const MenuIcons: React.FC<IconProps> = ({
  size = 50,
  color = "#bbb",
  width = 3,
  fill = "none",
  className = "",
  type = 0,
  svgAttributes = {},
}) => {
  if (type === 0)
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
      >
        <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
        <circle cx="12" cy="10" r="3" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  else if (type === 1)
    return (
      <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="7" />
        <path d="M12 2 C 13 11, 13 11, 22 12 C 13 13, 13 13, 12 22 C 11 13, 11 13, 2 12 C 11 11, 11 11, 12 2" />
      </svg>
    );
  else if (type === 2)
    return (
      <svg
        className={className}
        {...svgAttributes}
        data-type="2"
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        width={size}
        height={size}
        fill={color}
        stroke="none"
        viewBox="0 0 120 107"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          fillOpacity={"46%"}
          d="M60 5 C 32.5 34.15, 27.5 40.15, 15 83.3 C 24 78.8, 24 78.8, 33 78.3 C 38 48.65, 38 48.65, 60 5"
        />
        <path
          fillOpacity={"73.3%"}
          d="M10 92 C 35 97, 75 97, 100 92 C 94 87, 94 87, 90 77 C 56.5 89, 56.5 89, 10 92"
        />
        <path
          fillOpacity={"100%"}
          d="M110 92 C 100 54, 90 41, 67 10 C 66 19, 66 19, 61 28 C 87.5 53.5, 87.5 53.5, 110 92"
        />
      </svg>
    );
  else
    return (
      <svg
        className={className}
        width={size}
        height={size}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        viewBox="0 0 24 24"
      >
        <path d="M6 6 L 18 18 M18 6 L6 18" />
      </svg>
    );
};
export default MenuIcons;
