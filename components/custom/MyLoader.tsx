import { CustomLoaderProps } from "@/types/CustomType";

const MyLoader: React.FC<CustomLoaderProps> = ({
  children,
  className,
  backgroundColor,
  opacity,
  display = "none",
}) => {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: backgroundColor || "transparent",
        opacity: opacity || 1,
        display,
      }}
    >
      {children}
    </div>
  );
};
export default MyLoader;
