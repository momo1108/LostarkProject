import { IconProps } from "@/types/CustomType";

const MenuIcons: React.FC<IconProps> = ({
  size = 50,
  color = "#bbb",
  width = 3,
  fill = "none",
  className = "",
  type = 0,
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
          d="M60 10 C 32.5 39.15, 27.5 44.15, 15 88.3 C 24 83.8, 24 83.8, 33 83.3 C 38 53.65, 38 53.65, 60 10"
        />
        <path
          fillOpacity={"73.3%"}
          d="M10 97 C 35 102, 75 102, 100 97 C 94 92, 94 92, 90 82 C 56.5 94, 56.5 94, 10 97"
        />
        <path
          fillOpacity={"100%"}
          d="M110 97 C 100 59, 90 46, 67 15 C 66 24, 66 24, 61 33 C 87.5 58.5, 87.5 58.5, 110 97"
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
